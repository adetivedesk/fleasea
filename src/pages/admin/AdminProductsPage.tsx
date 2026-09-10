import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Copy, Archive, ArchiveRestore } from 'lucide-react';
import { MAX_PUBLIC_PRODUCTS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { categoryFilterOptions, categoryName } from '@/data/categories';
import { useI18n } from '@/i18n';
import { formatMoney } from '@/utils/currency';
import { formatKg } from '@/utils/quantity';
import {
  Button, EmptyState, LoadingState, PageHeader, Select, StatusBadge, Toggle, useToast,
} from '@/components/ui';

export function AdminProductsPage() {
  const { locale } = useI18n();
  const toast = useToast();
  const { data: products, loading, reload } = useAsync(() => productService.listAll(), []);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [status, setStatus] = useState('all');

  const publicCount = useMemo(() => (products ?? []).filter((p) => p.publicVisible).length, [products]);

  const rows = useMemo(() => {
    let list = [...(products ?? [])];
    const t = q.trim().toLowerCase();
    if (t) list = list.filter((p) => `${p.nameEn} ${p.nameAr} ${p.code} ${p.origin}`.toLowerCase().includes(t));
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (status === 'active') list = list.filter((p) => p.active);
    if (status === 'archived') list = list.filter((p) => !p.active);
    if (status === 'public') list = list.filter((p) => p.publicVisible);
    return list;
  }, [products, q, cat, status]);

  if (loading) return <LoadingState />;

  const togglePublic = (id: string, next: boolean) => {
    const res = productService.setPublicVisible(id, next);
    if (!res.ok) return toast.error(res.error!);
    res.rows!.then(reload);
    toast.success(next ? 'Added to public preview.' : 'Removed from public preview.');
  };
  const toggleActive = async (id: string, active: boolean) => {
    await productService.setActive(id, active);
    toast.info(active ? 'Product activated.' : 'Product archived.');
    reload();
  };
  const duplicate = async (id: string) => {
    await productService.duplicate(id);
    toast.success('Product duplicated (as inactive draft).');
    reload();
  };

  return (
    <div>
      <PageHeader
        title="Fish Products"
        subtitle={`Manage catalogue, pricing visibility and stock. Public products: ${publicCount} / ${MAX_PUBLIC_PRODUCTS}`}
        actions={<Button to="/admin/products/new" icon={Plus}>New product</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="input-base ps-9" />
        </div>
        <Select value={cat} onChange={(e) => setCat(e.target.value)} options={categoryFilterOptions(locale)} />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
            { value: 'public', label: 'Public preview' },
          ]}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No products match" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Product</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Price</th>
                <th className="px-4 py-2.5 font-medium">Available</th>
                <th className="px-4 py-2.5 font-medium">Stock</th>
                <th className="px-4 py-2.5 font-medium">Public</th>
                <th className="px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={`border-b border-ink-100 last:border-0 hover:bg-ink-50 ${!p.active ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <Link to={`/admin/products/${p.id}`} className="font-medium text-brand-700 hover:underline">{p.nameEn}</Link>
                    <span className="block text-xs text-ink-400">{p.code}{!p.active && ' · archived'}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{categoryName(p.category, locale)}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(p.basePrice, p.baseCurrency, { unit: 'KG' })}</td>
                  <td className="px-4 py-3 text-ink-600">{formatKg(p.availableKg - p.reservedKg)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.stockStatus} /></td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={p.publicVisible}
                      disabled={!p.active}
                      onChange={(next) => togglePublic(p.id, next)}
                      label="Public preview"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="ghost" icon={Pencil} to={`/admin/products/${p.id}`}>Edit</Button>
                      <Button size="sm" variant="ghost" icon={Copy} onClick={() => duplicate(p.id)}>Duplicate</Button>
                      {p.active ? (
                        <Button size="sm" variant="ghost" icon={Archive} onClick={() => toggleActive(p.id, false)}>Archive</Button>
                      ) : (
                        <Button size="sm" variant="ghost" icon={ArchiveRestore} onClick={() => toggleActive(p.id, true)}>Activate</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
