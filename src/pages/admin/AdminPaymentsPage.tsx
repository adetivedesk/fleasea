import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAYMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { paymentService } from '@/services/paymentService';
import { merchantService } from '@/services/merchantService';
import { notificationService } from '@/services/notificationService';
import { paymentTermLabel } from '@/data/settings';
import { formatDate, humanizeStatus } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import {
  Button, EmptyState, Field, LoadingState, Modal, PageHeader, SegmentedControl, Select, StatCard, StatusBadge, useToast,
} from '@/components/ui';
import type { Payment } from '@/types';
import type { PaymentStatus } from '@/constants/status';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: PAYMENT_STATUS.PENDING, label: 'Pending' },
  { value: PAYMENT_STATUS.PROCESSING, label: 'Processing' },
  { value: PAYMENT_STATUS.PAID, label: 'Paid' },
  { value: PAYMENT_STATUS.FAILED, label: 'Failed' },
  { value: PAYMENT_STATUS.REFUNDED, label: 'Refunded' },
];

export function AdminPaymentsPage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const [payments, merchants] = await Promise.all([paymentService.list(), merchantService.list()]);
    return { payments, merchants };
  }, []);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Payment | null>(null);
  const [status, setStatus] = useState<PaymentStatus>(PAYMENT_STATUS.PAID);

  const rows = useMemo(
    () => (data?.payments ?? []).filter((p) => filter === 'all' || p.status === filter),
    [data, filter],
  );

  if (loading || !data) return <LoadingState />;
  const merchantName = (id: string) => data.merchants.find((m) => m.id === id)?.companyName ?? id;

  const pendingCount = data.payments.filter((p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING).length;
  const failedCount = data.payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length;
  const paidSar = data.payments.filter((p) => p.status === PAYMENT_STATUS.PAID && p.currency === 'SAR').reduce((s, p) => s + p.amount, 0);

  const save = async () => {
    if (!editing) return;
    await paymentService.setStatus(editing.id, status);
    notificationService.push('merchant', 'payment', `Payment ${humanizeStatus(status)}`, `Payment for ${editing.orderNumber} is now ${humanizeStatus(status)}.`);
    toast.success(`Payment set to ${humanizeStatus(status)}.`);
    setEditing(null);
    reload();
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle="All instalments across merchants. Update payment status where needed." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending / processing" value={pendingCount} tone="warning" />
        <StatCard label="Failed" value={failedCount} tone="danger" />
        <StatCard label="Collected (SAR)" value={formatMoney(paidSar, 'SAR')} tone="success" />
      </div>

      <div className="mb-4 overflow-x-auto"><SegmentedControl value={filter} onChange={setFilter} options={FILTERS} size="sm" /></div>

      {rows.length === 0 ? (
        <EmptyState title="No payments in this view" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Merchant</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Method</th>
                <th className="px-4 py-2.5 font-medium">Term</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3 text-xs text-ink-500">{p.id}<span className="block text-ink-400">{p.portion}</span></td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${p.orderId}`} className="font-medium text-brand-700 hover:underline">{p.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{merchantName(p.merchantId)}</td>
                  <td className="px-4 py-3 font-medium text-ink-800">{formatMoney(p.amount, p.currency)}</td>
                  <td className="px-4 py-3 text-ink-500">{p.method.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{paymentTermLabel(p.term)}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" onClick={() => { setEditing(p); setStatus(p.status); }}>Update</Button>
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
        title={`Update payment — ${editing?.orderNumber ?? ''}`}
        footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>}
      >
        <Field label="Payment status">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            options={Object.values(PAYMENT_STATUS).map((v) => ({ value: v, label: humanizeStatus(v) }))}
          />
        </Field>
      </Modal>
    </div>
  );
}
