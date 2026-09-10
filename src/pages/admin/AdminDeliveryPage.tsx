import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import { SHIPMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { shipmentService } from '@/services/shipmentService';
import { recordDelivery } from '@/services/fulfillmentService';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, EmptyState, Field, Input, LoadingState, Modal, PageHeader, StatusBadge, Textarea, useToast,
} from '@/components/ui';
import type { Shipment } from '@/types';

export function AdminDeliveryPage() {
  const toast = useToast();
  const { data: shipments, loading, reload } = useAsync(() => shipmentService.list(), []);
  const [target, setTarget] = useState<Shipment | null>(null);
  const [f, setF] = useState({ deliveredKg: '', deliveredAt: '', driver: '', vehicle: '', notes: '', pod: '' });

  if (loading || !shipments) return <LoadingState />;

  const pending = shipments.filter((s) => s.status !== SHIPMENT_STATUS.DELIVERED);
  const delivered = shipments.filter((s) => s.status === SHIPMENT_STATUS.DELIVERED);

  const open = (s: Shipment) => {
    setTarget(s);
    setF({
      deliveredKg: String(s.dispatchedKg),
      deliveredAt: new Date().toISOString().slice(0, 10),
      driver: s.driver, vehicle: s.vehicle, notes: s.notes ?? '', pod: '',
    });
  };

  const submit = async () => {
    if (!target) return;
    const deliveredKg = Number(f.deliveredKg);
    if (!(deliveredKg > 0)) return toast.error('Enter the delivered quantity.');
    if (!f.pod.trim()) return toast.error('A proof-of-delivery reference is required.');
    await recordDelivery({
      shipment: target,
      deliveredKg,
      deliveredAt: new Date(f.deliveredAt).toISOString(),
      driver: f.driver,
      vehicle: f.vehicle,
      notes: f.notes || undefined,
      proofOfDelivery: f.pod.trim(),
    });
    const variance = deliveredKg - target.dispatchedKg;
    toast.success(`Delivery recorded.${variance !== 0 ? ` Variance ${variance > 0 ? '+' : ''}${variance} KG.` : ''}`);
    setTarget(null);
    reload();
  };

  return (
    <div>
      <PageHeader title="Delivery" subtitle="Record delivered quantities, proof of delivery and variance against dispatch." />

      <h2 className="mb-2 text-sm font-semibold text-ink-700">Awaiting delivery ({pending.length})</h2>
      {pending.length === 0 ? (
        <EmptyState icon={PackageCheck} title="Nothing awaiting delivery" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pending.map((s) => (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/admin/shipments/${s.id}`} className="font-semibold text-brand-700 hover:underline">{s.number}</Link>
                    <p className="text-xs text-ink-400">{s.orderNumber} · {s.destination}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-2 text-sm text-ink-600">Dispatched {formatKg(s.dispatchedKg)} · ETA {formatDate(s.etaAt)}</p>
                <Button size="sm" className="mt-3" icon={PackageCheck} onClick={() => open(s)}>Record delivery</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-2 mt-8 text-sm font-semibold text-ink-700">Delivered ({delivered.length})</h2>
      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-2.5 font-medium">Shipment</th>
              <th className="px-4 py-2.5 font-medium">Dispatched</th>
              <th className="px-4 py-2.5 font-medium">Delivered</th>
              <th className="px-4 py-2.5 font-medium">Variance</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">POD</th>
            </tr>
          </thead>
          <tbody>
            {delivered.map((s) => {
              const v = (s.deliveredKg ?? 0) - s.dispatchedKg;
              return (
                <tr key={s.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3"><Link to={`/admin/shipments/${s.id}`} className="text-brand-700 hover:underline">{s.number}</Link></td>
                  <td className="px-4 py-3 text-ink-600">{formatKg(s.dispatchedKg)}</td>
                  <td className="px-4 py-3 text-ink-600">{s.deliveredKg != null ? formatKg(s.deliveredKg) : '—'}</td>
                  <td className={`px-4 py-3 font-medium ${v < 0 ? 'text-red-600' : v > 0 ? 'text-emerald-600' : 'text-ink-400'}`}>
                    {v > 0 ? '+' : ''}{v.toLocaleString()} KG
                  </td>
                  <td className="px-4 py-3 text-ink-600">{s.deliveredAt ? formatDate(s.deliveredAt) : '—'}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{s.proofOfDelivery ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={target != null}
        onClose={() => setTarget(null)}
        title={`Record delivery — ${target?.number ?? ''}`}
        footer={<><Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button><Button onClick={submit}>Mark delivered</Button></>}
      >
        {target && (
          <div className="space-y-4">
            <div className="rounded-lg bg-ink-50 p-3 text-sm">Dispatched: <strong>{formatKg(target.dispatchedKg)}</strong></div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Delivered quantity (KG)" required><Input type="number" min={0} value={f.deliveredKg} onChange={(e) => setF((s) => ({ ...s, deliveredKg: e.target.value }))} /></Field>
              <Field label="Delivery date"><Input type="date" value={f.deliveredAt} onChange={(e) => setF((s) => ({ ...s, deliveredAt: e.target.value }))} /></Field>
              <Field label="Driver"><Input value={f.driver} onChange={(e) => setF((s) => ({ ...s, driver: e.target.value }))} /></Field>
              <Field label="Vehicle"><Input value={f.vehicle} onChange={(e) => setF((s) => ({ ...s, vehicle: e.target.value }))} /></Field>
            </div>
            <Field label="Proof of delivery (reference)" required><Input value={f.pod} onChange={(e) => setF((s) => ({ ...s, pod: e.target.value }))} placeholder="e.g. POD-signed-127.jpg" /></Field>
            <Field label="Delivery notes"><Textarea value={f.notes} onChange={(e) => setF((s) => ({ ...s, notes: e.target.value }))} /></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
