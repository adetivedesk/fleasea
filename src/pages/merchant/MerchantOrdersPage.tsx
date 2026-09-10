import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ORDER_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import {
  Button, EmptyState, LoadingState, PageHeader, SegmentedControl, StatusBadge,
} from '@/components/ui';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: ORDER_STATUS.PENDING_PAYMENT, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
];

export function MerchantOrdersPage() {
  const { data: orders, loading } = useAsync(() => orderService.listForMerchant(CURRENT_MERCHANT_ID), []);
  const [filter, setFilter] = useState('all');

  const rows = useMemo(() => {
    const list = orders ?? [];
    if (filter === 'all') return list;
    if (filter === ORDER_STATUS.SHIPPED)
      return list.filter((o) =>
        [ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY].includes(o.status as never),
      );
    return list.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Your wholesale orders and their payment, shipment and order status."
        actions={<Button to="/merchant/products">New order</Button>}
      />
      <div className="mb-4 overflow-x-auto">
        <SegmentedControl value={filter} onChange={setFilter} options={FILTERS} size="sm" />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="You haven't placed any wholesale orders yet."
          body="Browse the catalogue and build a wholesale order."
          action={<Button to="/merchant/products">Browse Fish</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Qty</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5 font-medium">Shipment</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const qty = o.items.reduce((s, i) => s + i.quantityKg, 0);
                return (
                  <tr key={o.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50">
                    <td className="px-4 py-3">
                      <Link to={`/merchant/orders/${o.id}`} className="font-medium text-brand-700 hover:underline">
                        {o.number}
                      </Link>
                      <span className="block text-xs text-ink-400">{o.items.length} item(s)</span>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-ink-600">{formatKg(qty)}</td>
                    <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(o.total, o.currency)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.paymentStatus} /></td>
                    <td className="px-4 py-3">{o.shipmentStatus ? <StatusBadge status={o.shipmentStatus} /> : <span className="text-xs text-ink-400">—</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
