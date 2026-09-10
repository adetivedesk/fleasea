import { useMemo, useState } from 'react';
import { Search, ShoppingCart, Handshake, X } from 'lucide-react';
import { STOCK_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { categoryFilterOptions } from '@/data/categories';
import { useI18n } from '@/i18n';
import { useCart } from '@/store/CartContext';
import { useToast, Button, EmptyState, LoadingState, PageHeader, Select, SegmentedControl } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

type Sort = 'name' | 'price-asc' | 'price-desc' | 'stock';

export function MerchantCatalogPage() {
  const { locale } = useI18n();
  const cart = useCart();
  const toast = useToast();
  const { data: products, loading } = useAsync(() => productService.list(), []);

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [origin, setOrigin] = useState('all');
  const [grade, setGrade] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState<Sort>('name');

  const origins = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.origin))).sort(),
    [products],
  );
  const grades = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.grade))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...(products ?? [])];
    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter((p) =>
        [p.nameEn, p.nameAr, p.code, p.origin, p.category].join(' ').toLowerCase().includes(term),
      );
    }
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (origin !== 'all') list = list.filter((p) => p.origin === origin);
    if (grade !== 'all') list = list.filter((p) => p.grade === grade);
    if (availability === 'in') list = list.filter((p) => p.stockStatus === STOCK_STATUS.IN_STOCK);
    if (availability === 'low')
      list = list.filter(
        (p) => p.stockStatus === STOCK_STATUS.LOW_STOCK || p.stockStatus === STOCK_STATUS.CRITICAL,
      );
    list.sort((a, b) => {
      if (sort === 'price-asc') return a.basePrice - b.basePrice;
      if (sort === 'price-desc') return b.basePrice - a.basePrice;
      if (sort === 'stock') return b.availableKg - b.reservedKg - (a.availableKg - a.reservedKg);
      return (locale === 'ar' ? a.nameAr : a.nameEn).localeCompare(locale === 'ar' ? b.nameAr : b.nameEn);
    });
    return list;
  }, [products, q, cat, origin, grade, availability, sort, locale]);

  const addToCart = (p: Product) => {
    cart.add({ productId: p.id, quantityKg: p.moqKg, displayUnit: p.moqKg >= 1000 ? 'TON' : 'KG' });
    toast.success(`${p.nameEn} added to cart (${p.moqKg.toLocaleString()} KG). Adjust quantity in the cart.`);
  };

  const resetFilters = () => {
    setQ(''); setCat('all'); setOrigin('all'); setGrade('all'); setAvailability('all'); setSort('name');
  };
  const anyFilter = q || cat !== 'all' || origin !== 'all' || grade !== 'all' || availability !== 'all';

  return (
    <div>
      <PageHeader
        title="Wholesale Catalogue"
        subtitle="Full catalogue with live pricing. Prices shown in your selected currency, always per KG."
      />

      <div className="mb-5 space-y-3 rounded-xl border border-ink-200 bg-white p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fish name, code, origin…"
            className="input-base ps-9"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={cat} onChange={(e) => setCat(e.target.value)} options={categoryFilterOptions(locale)} />
          <Select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            options={[{ value: 'all', label: 'All origins' }, ...origins.map((o) => ({ value: o, label: o }))]}
          />
          <Select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            options={[{ value: 'all', label: 'All grades' }, ...grades.map((g) => ({ value: g, label: g }))]}
          />
          <Select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            options={[
              { value: 'all', label: 'Any availability' },
              { value: 'in', label: 'In stock' },
              { value: 'low', label: 'Low / critical' },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl
            value={sort}
            onChange={(s) => setSort(s as Sort)}
            size="sm"
            options={[
              { value: 'name', label: 'Name' },
              { value: 'price-asc', label: 'Price ↑' },
              { value: 'price-desc', label: 'Price ↓' },
              { value: 'stock', label: 'Availability' },
            ]}
          />
          <div className="flex items-center gap-3 text-sm text-ink-500">
            <span>{filtered.length} products</span>
            {anyFilter && (
              <button onClick={resetFilters} className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match your filters"
          body="Try widening your search or clearing filters."
          action={<Button variant="secondary" onClick={resetFilters}>Clear filters</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              to={`/merchant/products/${p.id}`}
              footer={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon={ShoppingCart}
                    className="flex-1"
                    disabled={p.stockStatus === STOCK_STATUS.OUT_OF_STOCK}
                    onClick={() => addToCart(p)}
                  >
                    {cart.has(p.id) ? 'Add more' : 'Add to Cart'}
                  </Button>
                  <Button
                    to={`/merchant/products/${p.id}#negotiate`}
                    size="sm"
                    variant="secondary"
                    icon={Handshake}
                  >
                    Negotiate
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
