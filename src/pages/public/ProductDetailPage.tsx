import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, MapPin, Package, Ruler } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { categoryName } from '@/data/categories';
import { fishImage } from '@/data/images';
import { formatDualQuantity, formatKg } from '@/utils/quantity';
import { relativeDay } from '@/utils/format';
import { Button, Card, LoadingState, StatusBadge } from '@/components/ui';
import { PriceDisplay } from '@/components/product/PriceDisplay';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { t, locale } = useI18n();
  const { data: product, loading } = useAsync(() => productService.get(id), [id]);

  if (loading) {
    return (
      <div className="container-page py-10">
        <LoadingState />
      </div>
    );
  }

  // Hidden products must not be reachable by direct URL (spec §11).
  if (!product || !product.publicVisible || !product.active) {
    return (
      <div className="container-page py-16">
        <Card className="mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-500">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="text-lg font-bold text-ink-900">{t('access.merchantRequired.title')}</h1>
          <p className="text-sm text-ink-500">
            This product is not part of the public preview. Approved merchants can view full details
            and pricing.
          </p>
          <div className="flex gap-2">
            <Button to="/register">{t('access.merchantRequired.cta')}</Button>
            <Button to="/products" variant="secondary">
              {t('nav.products')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;
  const freeKg = product.availableKg - product.reservedKg;

  return (
    <div className="container-page py-8">
      <Link
        to="/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4 flip-x" /> {t('nav.products')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-ink-200">
          <img src={fishImage(product.images[0])} alt={name} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-sea-700">
              {categoryName(product.category, locale)}
            </span>
            <StatusBadge status={product.stockStatus} />
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">{name}</h1>
          <p dir="rtl" className="text-sm text-ink-400">
            {locale === 'ar' ? product.nameEn : product.nameAr}
          </p>

          <div className="mt-4">
            <PriceDisplay
              basePrice={product.basePrice}
              baseCurrency={product.baseCurrency}
              unit="KG"
              size="lg"
              showDisclaimer
            />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Detail icon={MapPin} label="Origin" value={product.origin} />
            <Detail icon={Ruler} label="Size / grade" value={`${product.size} · ${product.grade}`} />
            <Detail icon={Package} label="Packaging" value={product.packaging} />
            <Detail icon={Ruler} label="Weight range" value={product.weightRange} />
          </dl>

          <div className="mt-5 rounded-lg bg-ink-50 p-4 text-sm">
            <p>
              Available: <span className="font-semibold text-ink-800">{formatDualQuantity(freeKg)}</span>
            </p>
            <p className="mt-1">
              Minimum order: <span className="font-semibold text-ink-800">{formatKg(product.moqKg)}</span>
            </p>
            <p className="mt-1 text-xs text-ink-400">Price updated {relativeDay(product.priceEffectiveAt)}</p>
          </div>

          <div className="mt-6 rounded-lg border border-sea-200 bg-sea-50 p-4">
            <p className="text-sm font-medium text-sea-900">Wholesale ordering requires an approved account</p>
            <p className="mt-1 text-sm text-sea-800">
              Register your business to add products to a wholesale cart, request negotiations and
              place bulk orders.
            </p>
            <div className="mt-3 flex gap-2">
              <Button to="/register" iconRight={ArrowRight}>
                {t('nav.register')}
              </Button>
              <Button to="/login" variant="secondary">
                {t('nav.login')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-lg font-semibold text-ink-900">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
      </section>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3">
      <dt className="flex items-center gap-1 text-xs text-ink-400">
        <Icon className="h-3 w-3" /> {label}
      </dt>
      <dd className="mt-0.5 font-medium text-ink-800">{value}</dd>
    </div>
  );
}
