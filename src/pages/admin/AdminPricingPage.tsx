import { useEffect, useMemo, useState } from 'react';
import { History, UploadCloud } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { formatDateTime, formatPercent } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import {
  Button, ConfirmDialog, Field, Input, LoadingState, Modal, PageHeader, useToast,
} from '@/components/ui';
import { PriceHistory } from '@/components/product/PriceHistory';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';

export function AdminPricingPage() {
  const toast = useToast();
  const { data: products, loading, reload } = useAsync(() => productService.list(), []);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState<Product | null>(null);
  const [historyOf, setHistoryOf] = useState<Product | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkPct, setBulkPct] = useState('0');

  useEffect(() => {
    if (products) setDraft(Object.fromEntries(products.map((p) => [p.id, String(p.basePrice)])));
  }, [products]);

  const dirty = useMemo(
    () => (products ?? []).filter((p) => Number(draft[p.id]) > 0 && Number(draft[p.id]) !== p.basePrice),
    [products, draft],
  );

  if (loading || !products) return <LoadingState />;

  const publish = async () => {
    if (!publishing) return;
    const next = Number(draft[publishing.id]);
    await productService.updatePrice(publishing.id, next);
    toast.success('Market price updated successfully.');
    reload();
  };

  const runBulk = async () => {
    const pct = Number(bulkPct);
    if (!pct) return;
    for (const p of dirty.length ? dirty : products) {
      const base = dirty.length ? Number(draft[p.id]) : p.basePrice;
      await productService.updatePrice(p.id, Math.round(base * (1 + pct / 100) * 100) / 100);
    }
    toast.success(`Applied ${formatPercent(pct)} to ${(dirty.length ? dirty : products).length} products.`);
    setBulkOpen(false);
    reload();
  };

  return (
    <div>
      <PageHeader
        title="Daily Pricing"
        subtitle="Update and publish today's market prices. Base price is the master value shown to merchants."
        actions={<Button variant="secondary" icon={UploadCloud} onClick={() => setBulkOpen(true)}>Bulk update</Button>}
      />

      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Previous</th>
              <th className="px-4 py-2.5 font-medium">Current</th>
              <th className="px-4 py-2.5 font-medium">New price</th>
              <th className="px-4 py-2.5 font-medium">Change</th>
              <th className="px-4 py-2.5 font-medium">Effective</th>
              <th className="px-4 py-2.5 font-medium">Updated by</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const prev = p.priceHistory[1]?.price;
              const next = Number(draft[p.id] ?? p.basePrice);
              const changePct = p.basePrice ? ((next - p.basePrice) / p.basePrice) * 100 : 0;
              return (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-800">{p.nameEn}</p>
                    <p className="text-xs text-ink-400">{p.code} · {p.baseCurrency} / KG</p>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{prev != null ? formatMoney(prev, p.baseCurrency) : '—'}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(p.basePrice, p.baseCurrency)}</td>
                  <td className="px-4 py-3">
                    <Input
                      type="number" min={0} step={0.5}
                      value={draft[p.id] ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                      className="w-24"
                    />
                  </td>
                  <td className={cn('px-4 py-3 font-medium', changePct > 0 ? 'text-emerald-600' : changePct < 0 ? 'text-red-600' : 'text-ink-400')}>
                    {formatPercent(changePct)}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{formatDateTime(p.priceEffectiveAt)}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{p.priceHistory[0]?.updatedBy ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" icon={History} onClick={() => setHistoryOf(p)}>History</Button>
                      <Button
                        size="sm"
                        disabled={!(next > 0) || next === p.basePrice}
                        onClick={() => setPublishing(p)}
                      >
                        Publish
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={publishing != null}
        onClose={() => setPublishing(null)}
        onConfirm={publish}
        title="Publish new market price?"
        confirmLabel="Publish"
        message={
          publishing ? (
            <span>
              {publishing.nameEn}: <strong>{formatMoney(publishing.basePrice, publishing.baseCurrency, { unit: 'KG' })}</strong>
              {' → '}
              <strong>{formatMoney(Number(draft[publishing.id]), publishing.baseCurrency, { unit: 'KG' })}</strong>.
              <br />Effective immediately; merchants are notified.
            </span>
          ) : ''
        }
      />

      <Modal open={historyOf != null} onClose={() => setHistoryOf(null)} title={`Price history — ${historyOf?.nameEn ?? ''}`}>
        {historyOf && <PriceHistory history={historyOf.priceHistory} />}
      </Modal>

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk price update"
        footer={<><Button variant="ghost" onClick={() => setBulkOpen(false)}>Cancel</Button><Button onClick={runBulk}>Apply & publish</Button></>}
      >
        <p className="text-sm text-ink-600">
          Apply a percentage change to {dirty.length ? `${dirty.length} edited product(s)` : 'all listed products'} and publish.
        </p>
        <Field label="Percentage change (%)" className="mt-3">
          <Input type="number" step={0.5} value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
