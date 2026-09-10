import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { KG_PER_TON } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { toKg, formatKg } from '@/utils/quantity';
import type { Product, QuantityUnit } from '@/types';
import {
  Button, Field, Input, LoadingState, Modal, PageHeader, SegmentedControl, Select, StatusBadge, useToast,
} from '@/components/ui';

export function AdminInventoryPage() {
  const toast = useToast();
  const { data: products, loading, reload } = useAsync(() => productService.listAll(), []);
  const [target, setTarget] = useState<Product | null>(null);
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState<QuantityUnit>('KG');
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');
  const [reason, setReason] = useState('');

  if (loading || !products) return <LoadingState />;

  const openAdjust = (p: Product) => {
    setTarget(p);
    setQty(''); setUnit('KG'); setDirection('increase'); setReason('');
  };

  const submit = async () => {
    if (!target) return;
    const kg = toKg(Number(qty) || 0, unit);
    if (kg <= 0) return toast.error('Enter a quantity greater than zero.');
    if (!reason.trim()) return toast.error('A reason is required for stock adjustments.');
    await productService.adjustInventory(target.id, kg, direction);
    toast.success(`${direction === 'increase' ? 'Added' : 'Removed'} ${formatKg(kg)} — ${target.nameEn}.`);
    setTarget(null);
    reload();
  };

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Available stock, reservations and stock-status thresholds. Prototype: reservations are illustrative only." />

      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Available KG</th>
              <th className="px-4 py-2.5 font-medium">Available TON</th>
              <th className="px-4 py-2.5 font-medium">Reserved KG</th>
              <th className="px-4 py-2.5 font-medium">After reservations</th>
              <th className="px-4 py-2.5 font-medium">MOQ</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const free = p.availableKg - p.reservedKg;
              return (
                <tr key={p.id} className={`border-b border-ink-100 last:border-0 ${!p.active ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-800">{p.nameEn}</p>
                    <p className="text-xs text-ink-400">{p.code}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{p.availableKg.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-500">{(p.availableKg / KG_PER_TON).toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-500">{p.reservedKg.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{free.toLocaleString()} KG</td>
                  <td className="px-4 py-3 text-ink-500">{p.moqKg.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.stockStatus} /></td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" icon={SlidersHorizontal} onClick={() => openAdjust(p)}>Adjust</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={target != null}
        onClose={() => setTarget(null)}
        title={`Adjust stock — ${target?.nameEn ?? ''}`}
        footer={<><Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button><Button onClick={submit}>Apply adjustment</Button></>}
      >
        {target && (
          <div className="space-y-4">
            <div className="rounded-lg bg-ink-50 p-3 text-sm">
              Current available: <strong>{formatKg(target.availableKg)}</strong> · reserved {formatKg(target.reservedKg)}
            </div>
            <Field label="Direction">
              <SegmentedControl
                value={direction}
                onChange={(d) => setDirection(d as 'increase' | 'decrease')}
                options={[{ value: 'increase', label: 'Increase' }, { value: 'decrease', label: 'Decrease' }]}
                size="sm"
              />
            </Field>
            <Field label="Quantity">
              <div className="flex gap-2">
                <Input type="number" min={0} step={unit === 'TON' ? 0.1 : 50} value={qty} onChange={(e) => setQty(e.target.value)} className="w-32" />
                <Select value={unit} onChange={(e) => setUnit(e.target.value as QuantityUnit)} options={[{ value: 'KG', label: 'KG' }, { value: 'TON', label: 'TON' }]} className="w-24" />
              </div>
            </Field>
            <Field label="Reason" required>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. New landing, damage write-off, stock count" />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
