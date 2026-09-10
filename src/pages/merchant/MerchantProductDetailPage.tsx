import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Handshake, MapPin, Package, Ruler, Clock } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { categoryName } from '@/data/categories';
import { fishImage } from '@/data/images';
import { useI18n } from '@/i18n';
import { useCart } from '@/store/CartContext';
import { relativeDay } from '@/utils/format';
import { formatDualQuantity, formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, CardHeader, EmptyState, LoadingState, StatusBadge, useToast,
} from '@/components/ui';
import { PriceDisplay } from '@/components/product/PriceDisplay';
import { PriceHistory } from '@/components/product/PriceHistory';
import {
  WholesaleQuantityInput,
  quantityIsValid,
} from '@/components/product/WholesaleQuantityInput';
import { NegotiationDialog } from '@/components/product/NegotiationDialog';
import type { QuantityUnit } from '@/types';
import { STOCK_STATUS } from '@/constants';

export function MerchantProductDetailPage() {
  const { id = '' } = useParams();
  const { hash } = useLocation();
  const { locale } = useI18n();
  const cart = useCart();
  const toast = useToast();
  const { data: product, loading } = useAsync(() => productService.get(id), [id]);

  const [qtyKg, setQtyKg] = useState(0);
  const [, setUnit] = useState<QuantityUnit>('TON');
  const [negOpen, setNegOpen] = useState(false);

  useEffect(() => {
    if (product) setQtyKg(product.moqKg);
  }, [product]);
  useEffect(() => {
    if (hash === '#negotiate' && product) setNegOpen(true);
  }, [hash, product]);

  if (loading) return <LoadingState />;
  if (!product) {
    return <EmptyState title="Product not found" body="This product may have been archived." action={<Button to="/merchant/products">Back to catalogue</Button>} />;
  }

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionEn;
  const freeKg = product.availableKg - product.reservedKg;
  const outOfStock = product.stockStatus === STOCK_STATUS.OUT_OF_STOCK;
  const valid = quantityIsValid(qtyKg, product.moqKg, freeKg);

  const addToCart = () => {
    if (!valid) return;
    cart.add({ productId: product.id, quantityKg: qtyKg, displayUnit: qtyKg >= 1000 ? 'TON' : 'KG' });
    toast.success(`${name} — ${formatKg(qtyKg)} added to cart.`);
  };

  return (
    <div>
      <Link to="/merchant/products" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Catalogue
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
          <p dir="rtl" className="text-sm text-ink-400">{locale === 'ar' ? product.nameEn : product.nameAr}</p>

          <div className="mt-4">
            <PriceDisplay basePrice={product.basePrice} baseCurrency={product.baseCurrency} unit="KG" size="lg" showDisclaimer />
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
              <Clock className="h-3 w-3" /> Price effective {relativeDay(product.priceEffectiveAt)}
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Detail icon={MapPin} label="Origin" value={product.origin} />
            <Detail icon={Ruler} label="Size / grade" value={`${product.size} · ${product.grade}`} />
            <Detail icon={Package} label="Packaging" value={product.packaging} />
            <Detail icon={Ruler} label="Weight range" value={product.weightRange} />
          </dl>

          <Card className="mt-5">
            <CardBody>
              <p className="text-sm text-ink-600">
                Available inventory:{' '}
                <span className="font-semibold text-ink-800">{formatDualQuantity(freeKg)}</span>
                {' · '}MOQ {formatKg(product.moqKg)}
              </p>
              <div className="mt-3">
                <p className="mb-1 text-sm font-medium text-ink-700">Order quantity</p>
                <WholesaleQuantityInput
                  valueKg={qtyKg}
                  onChange={(kg, u) => {
                    setQtyKg(kg);
                    setUnit(u);
                  }}
                  moqKg={product.moqKg}
                  availableKg={freeKg}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button icon={ShoppingCart} onClick={addToCart} disabled={outOfStock || !valid}>
                  Add to Cart
                </Button>
                <Button variant="secondary" icon={Handshake} onClick={() => setNegOpen(true)}>
                  Request Negotiation
                </Button>
              </div>
              {outOfStock && (
                <p className="mt-2 text-xs font-medium text-red-600">This product is currently unavailable.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Description" />
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-600">{description}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Price history" />
          <CardBody>
            <PriceHistory history={product.priceHistory} />
          </CardBody>
        </Card>
      </div>

      <NegotiationDialog product={product} open={negOpen} onClose={() => setNegOpen(false)} initialKg={qtyKg} />
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
