import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { ORDER_STATUS, PAYMENT_STATUS, SHIPMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { merchantService } from '@/services/merchantService';
import { paymentTermLabel } from '@/data/settings';
import { formatDate, humanizeStatus } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import {
  Button, EmptyState, Field, LoadingState, Modal, PageHeader, SegmentedControl, Select, StatusBadge, useToast,
} from '@/components/ui';
import type { Order } from '@/types';
import type { OrderStatus, PaymentStatus, ShipmentStatus } from '@/constants/status';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: ORDER_STATUS.PENDING_PAYMENT, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
];

const opts = (values: string[]) => values.map((v) => ({ value: v, label: humanizeStatus(v) }));

export function AdminOrdersPage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const [orders, merchants] = await Promise.all([orderService.list(), merchantService.list()]);
    return { orders, merchants };
  }, []);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<{ status: OrderStatus; paymentStatus: PaymentStatus; shipmentStatus: ShipmentStatus | '' }>({
    status: ORDER_STATUS.CONFIRMED, paymentStatus: PAYMENT_STATUS.PENDING, shipmentStatus: '',
  });

  const rows = useMemo(
    () => (data?.orders ?? []).filter((o) => filter === 'all' || o.status === filter),
    [data, filter],
  );

  if (loading || !data) return <LoadingState />;
  const merchantName = (id: string) => data.merchants.find((m) => m.id === id)?.companyName ?? id;

  const openEdit = (o: Order) => {
    setEditing(o);
    setForm({ status: o.status, paymentStatus: o.paymentStatus, shipmentStatus: o.shipmentStatus ?? '' });
  };
  const save = async () => {
    if (!editing) return;
    await orderService.setStatus(editing.id, {
      status: form.status,
      paymentStatus: form.paymentStatus,
      shipmentStatus: form.shipmentStatus || undefined,
      note: 'Updated by admin.',
    });
    toast.success(`${editing.number} updated.`);
    setEditing(null);
    reload();
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="All wholesale orders. Update order, payment and shipment status." />
      <div className="mb-4 overflow-x-auto"><SegmentedControl value={filter} onChange={setFilter} options={FILTERS} size="sm" /></div>

      {rows.length === 0 ? (
        <EmptyState title="No orders in this view" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Merchant</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Qty</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Term</th>
                <th className="px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5 font-medium">Shipment</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${o.id}`} className="font-medium text-brand-700 hover:underline">{o.number}</Link>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{merchantName(o.merchantId)}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-ink-600">{formatKg(o.items.reduce((s, i) => s + i.quantityKg, 0))}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(o.total, o.currency)}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{paymentTermLabel(o.paymentTerm)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3">{o.shipmentStatus ? <StatusBadge status={o.shipmentStatus} /> : <span className="text-xs text-ink-400">—</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" icon={SlidersHorizontal} onClick={() => openEdit(o)}>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={editing != null}
        onClose={() => setEditing(null)}
        title={`Update ${editing?.number ?? ''}`}
        footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>}
      >
        <div className="space-y-4">
          <Field label="Order status">
            <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as OrderStatus }))} options={opts(Object.values(ORDER_STATUS))} />
          </Field>
          <Field label="Payment status">
            <Select value={form.paymentStatus} onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value as PaymentStatus }))} options={opts(Object.values(PAYMENT_STATUS))} />
          </Field>
          <Field label="Shipment status">
            <Select
              value={form.shipmentStatus}
              onChange={(e) => setForm((f) => ({ ...f, shipmentStatus: e.target.value as ShipmentStatus | '' }))}
              options={[{ value: '', label: '— none —' }, ...opts(Object.values(SHIPMENT_STATUS))]}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
