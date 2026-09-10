import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ORDER_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { shipmentService } from '@/services/shipmentService';
import { orderService } from '@/services/orderService';
import { merchantService } from '@/services/merchantService';
import { createShipment } from '@/services/fulfillmentService';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import {
  Button, EmptyState, Field, Input, LoadingState, Modal, PageHeader, Select, StatusBadge, Textarea, useToast,
} from '@/components/ui';
import type { Order } from '@/types';

export function AdminShipmentsPage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const [shipments, orders, merchants] = await Promise.all([
      shipmentService.list(),
      orderService.list(),
      merchantService.list(),
    ]);
    return { shipments, orders, merchants };
  }, []);
  const [creating, setCreating] = useState(false);
  const [f, setF] = useState({
    orderId: '', carrier: 'Gulf Cold Logistics', vehicle: '', driver: '',
    dispatchedAt: '', etaAt: '', notes: '',
  });

  const shippableOrders = useMemo(() => {
    const withShipment = new Set((data?.shipments ?? []).map((s) => s.orderId));
    return (data?.orders ?? []).filter(
      (o) => !withShipment.has(o.id) && [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.PACKED].includes(o.status as never),
    );
  }, [data]);

  if (loading || !data) return <LoadingState />;
  const merchantName = (id: string) => data.merchants.find((m) => m.id === id)?.companyName ?? id;

  const submit = async () => {
    const order = data.orders.find((o) => o.id === f.orderId);
    if (!order) return toast.error('Select an order.');
    if (!f.vehicle || !f.driver) return toast.error('Assign a vehicle and driver.');
    await createShipment({
      order,
      carrier: f.carrier,
      vehicle: f.vehicle,
      driver: f.driver,
      dispatchedAt: f.dispatchedAt ? new Date(f.dispatchedAt).toISOString() : new Date().toISOString(),
      etaAt: f.etaAt ? new Date(f.etaAt).toISOString() : new Date(Date.now() + 4 * 864e5).toISOString(),
      destination: `${order.deliveryAddress.city}, ${order.deliveryAddress.country}`,
      dispatchedKg: order.items.reduce((s, i) => s + i.quantityKg, 0),
      notes: f.notes || undefined,
    });
    toast.success('Shipment created.');
    setCreating(false);
    setF({ orderId: '', carrier: 'Gulf Cold Logistics', vehicle: '', driver: '', dispatchedAt: '', etaAt: '', notes: '' });
    reload();
  };

  return (
    <div>
      <PageHeader
        title="Shipments"
        subtitle="Create shipments for confirmed orders and track them to delivery."
        actions={<Button icon={Plus} onClick={() => setCreating(true)} disabled={shippableOrders.length === 0}>Create shipment</Button>}
      />

      {data.shipments.length === 0 ? (
        <EmptyState title="No shipments yet" body="Create a shipment from a confirmed order." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Shipment</th>
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Merchant</th>
                <th className="px-4 py-2.5 font-medium">Destination</th>
                <th className="px-4 py-2.5 font-medium">Driver</th>
                <th className="px-4 py-2.5 font-medium">ETA</th>
                <th className="px-4 py-2.5 font-medium">Qty</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.shipments.map((s) => (
                <tr key={s.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
                  <td className="px-4 py-3"><Link to={`/admin/shipments/${s.id}`} className="font-medium text-brand-700 hover:underline">{s.number}</Link></td>
                  <td className="px-4 py-3 text-ink-600">{s.orderNumber}</td>
                  <td className="px-4 py-3 text-ink-600">{merchantName(s.merchantId)}</td>
                  <td className="px-4 py-3 text-ink-600">{s.destination}</td>
                  <td className="px-4 py-3 text-ink-600">{s.driver}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(s.etaAt)}</td>
                  <td className="px-4 py-3 text-ink-600">{formatKg(s.dispatchedKg)}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create shipment"
        footer={<><Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button><Button onClick={submit}>Create</Button></>}
      >
        <div className="space-y-4">
          <Field label="Order" required>
            <Select
              value={f.orderId}
              onChange={(e) => setF((s) => ({ ...s, orderId: e.target.value }))}
              placeholder="Select a confirmed order"
              options={shippableOrders.map((o: Order) => ({ value: o.id, label: `${o.number} · ${merchantName(o.merchantId)}` }))}
            />
          </Field>
          <Field label="Carrier"><Input value={f.carrier} onChange={(e) => setF((s) => ({ ...s, carrier: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle" required><Input value={f.vehicle} onChange={(e) => setF((s) => ({ ...s, vehicle: e.target.value }))} placeholder="Reefer truck · plate" /></Field>
            <Field label="Driver" required><Input value={f.driver} onChange={(e) => setF((s) => ({ ...s, driver: e.target.value }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dispatch date"><Input type="date" value={f.dispatchedAt} onChange={(e) => setF((s) => ({ ...s, dispatchedAt: e.target.value }))} /></Field>
            <Field label="ETA"><Input type="date" value={f.etaAt} onChange={(e) => setF((s) => ({ ...s, etaAt: e.target.value }))} /></Field>
          </div>
          <Field label="Notes"><Textarea value={f.notes} onChange={(e) => setF((s) => ({ ...s, notes: e.target.value }))} /></Field>
        </div>
      </Modal>
    </div>
  );
}
