import { useMemo, useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { categoryFilterOptions } from '@/data/categories';
import { MAX_PUBLIC_PRODUCTS } from '@/constants';
import {
  Button,
  EmptyState,
  LoadingState,
  PageHeader,
  SegmentedControl,
} from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';

export function ProductsPage() {
  const { t, locale } = useI18n();
  const { data, loading } = useAsync(() => productService.publicList(), []);
  const [cat, setCat] = useState('all');

  const products = useMemo(
    () => (data ?? []).filter((p) => cat === 'all' || p.category === cat),
    [data, cat],
  );

  return (
    <div className="container-page py-10">
      <PageHeader
        title="Wholesale Fish — Public Preview"
        subtitle={`A limited selection chosen by our team (up to ${MAX_PUBLIC_PRODUCTS} products). Approved merchants see the full catalogue and live pricing.`}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl value={cat} onChange={setCat} options={categoryFilterOptions(locale)} />
        <span className="text-sm text-ink-500">{products.length} shown</span>
      </div>

      {loading ? (
        <LoadingState label={t('common.loading')} />
      ) : products.length === 0 ? (
        <EmptyState title="No products in this category" body="Try another category filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              to={`/products/${p.id}`}
              footer={
                <Button to={`/products/${p.id}`} variant="secondary" size="sm" fullWidth>
                  View details
                </Button>
              }
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 rounded-xl bg-brand-900 p-8 text-center text-white">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
          <Lock className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-bold">{t('access.merchantRequired.title')}</h2>
        <p className="max-w-md text-sm text-brand-100">
          The full catalogue — every grade, live tonnage, negotiation and ordering — is available to
          approved wholesale merchants only.
        </p>
        <Button to="/register" iconRight={ArrowRight}>
          {t('access.merchantRequired.cta')}
        </Button>
      </div>
    </div>
  );
}
