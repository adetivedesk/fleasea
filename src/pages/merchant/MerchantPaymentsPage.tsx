import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { PAYMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { paymentService } from '@/services/paymentService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { paymentTermLabel } from '@/data/settings';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import {
  Button, EmptyState, LoadingState, PageHeader, SegmentedControl, StatCard, StatusBadge,
} from '@/components/ui';
import { PaymentSimulator } from '@/components/payment/PaymentSimulator';
import type { Payment } from '@/types';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: PAYMENT_STATUS.PENDING, label: 'Pending' },
  { value: PAYMENT_STATUS.PROCESSING, label: 'Processing' },
  { value: PAYMENT_STATUS.PAID, label: 'Paid' },
  { value: PAYMENT_STATUS.FAILED, label: 'Failed' },
];

export function MerchantPaymentsPage() {
  const { data: payments, loading, reload } = useAsync(
    () => paymentService.listForMerchant(CURRENT_MERCHANT_ID),
    [],
  );
  const [filter, setFilter] = useState('all');
  const [payTarget, setPayTarget] = useState<Payment | null>(null);

  const rows = useMemo(
    () => (payments ?? []).filter((p) => filter === 'all' || p.status === filter),
    [payments, filter],
  );

  if (loading) return <LoadingState />;

  const outstanding = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING)
    .filter((p) => p.currency === 'SAR')
    .reduce((s, p) => s + p.amount, 0);
  const paid = (payments ?? [])
    .filter((p) => p.status === PAYMENT_STATUS.PAID && p.currency === 'SAR')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Instalments across your orders. Prototype payments are simulated." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding (SAR)" value={formatMoney(outstanding, 'SAR')} icon={CreditCard} tone="warning" />
        <StatCard label="Paid (SAR)" value={formatMoney(paid, 'SAR')} icon={CreditCard} tone="success" />
        <StatCard label="Records" value={payments?.length ?? 0} icon={CreditCard} />
      </div>

      <div className="mb-4 overflow-x-auto">
        <SegmentedControl value={filter} onChange={setFilter} options={FILTERS} size="sm" />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No payments to show" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Portion</th>
                <th className="px-4 py-2.5 font-medium">Term</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/merchant/orders/${p.orderId}`} className="font-medium text-brand-700 hover:underline">
                      {p.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{p.portion}</td>
                  <td className="px-4 py-3 text-ink-500">{paymentTermLabel(p.term)}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(p.amount, p.currency)}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {(p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.FAILED) && (
                      <Button size="sm" onClick={() => setPayTarget(p)}>Pay</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaymentSimulator payment={payTarget} open={payTarget != null} onClose={() => setPayTarget(null)} onDone={reload} />
    </div>
  );
}
