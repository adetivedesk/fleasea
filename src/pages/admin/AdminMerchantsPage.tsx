import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Ban, RotateCw } from 'lucide-react';
import { MERCHANT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { merchantService } from '@/services/merchantService';
import { notificationService } from '@/services/notificationService';
import { formatDate } from '@/utils/format';
import {
  Button, ConfirmDialog, EmptyState, LoadingState, PageHeader, SegmentedControl, StatusBadge, useToast,
} from '@/components/ui';
import type { Merchant } from '@/types';
import type { MerchantStatus } from '@/constants/status';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: MERCHANT_STATUS.PENDING, label: 'Pending' },
  { value: MERCHANT_STATUS.APPROVED, label: 'Approved' },
  { value: MERCHANT_STATUS.REJECTED, label: 'Rejected' },
  { value: MERCHANT_STATUS.SUSPENDED, label: 'Suspended' },
];

interface PendingAction {
  merchant: Merchant;
  status: MerchantStatus;
  label: string;
  tone: 'primary' | 'danger';
}

export function AdminMerchantsPage() {
  const toast = useToast();
  const { data: merchants, loading, reload } = useAsync(() => merchantService.list(), []);
  const [filter, setFilter] = useState('all');
  const [action, setAction] = useState<PendingAction | null>(null);

  const rows = useMemo(
    () => (merchants ?? []).filter((m) => filter === 'all' || m.status === filter),
    [merchants, filter],
  );

  if (loading) return <LoadingState />;

  const run = async () => {
    if (!action) return;
    await merchantService.setStatus(action.merchant.id, action.status);
    const verb =
      action.status === MERCHANT_STATUS.APPROVED ? 'approved'
      : action.status === MERCHANT_STATUS.REJECTED ? 'rejected'
      : action.status === MERCHANT_STATUS.SUSPENDED ? 'suspended' : 'reactivated';
    notificationService.push('merchant', `merchant_${verb}`, `Merchant ${verb}`, `${action.merchant.companyName} has been ${verb}.`);
    toast.success(`${action.merchant.companyName} ${verb}.`);
    reload();
  };

  return (
    <div>
      <PageHeader title="Merchant Applications" subtitle="Approve, reject, suspend or reactivate wholesale merchant accounts." />
      <div className="mb-4 overflow-x-auto"><SegmentedControl value={filter} onChange={setFilter} options={FILTERS} size="sm" /></div>

      {rows.length === 0 ? (
        <EmptyState title="No merchants in this view" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-4 py-2.5 font-medium">Contact</th>
                <th className="px-4 py-2.5 font-medium">Country</th>
                <th className="px-4 py-2.5 font-medium">Registered</th>
                <th className="px-4 py-2.5 font-medium">Docs</th>
                <th className="px-4 py-2.5 font-medium">Est. volume</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-b border-ink-100 last:border-0 align-top hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/merchants/${m.id}`} className="font-medium text-brand-700 hover:underline">{m.companyName}</Link>
                    <span className="block text-xs text-ink-400">{m.businessType}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {m.contact.fullName}
                    <span className="block text-xs text-ink-400">{m.contact.email}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{m.address.country}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(m.registeredAt)}</td>
                  <td className="px-4 py-3 text-ink-600">{m.documents.length}</td>
                  <td className="px-4 py-3 text-ink-600">{m.estimatedMonthlyVolumeKg.toLocaleString()} KG</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="ghost" icon={Eye} to={`/admin/merchants/${m.id}`}>View</Button>
                      {m.status === MERCHANT_STATUS.PENDING && (
                        <>
                          <Button size="sm" icon={Check} onClick={() => setAction({ merchant: m, status: MERCHANT_STATUS.APPROVED, label: 'Approve merchant', tone: 'primary' })}>Approve</Button>
                          <Button size="sm" variant="danger" icon={X} onClick={() => setAction({ merchant: m, status: MERCHANT_STATUS.REJECTED, label: 'Reject application', tone: 'danger' })}>Reject</Button>
                        </>
                      )}
                      {m.status === MERCHANT_STATUS.APPROVED && (
                        <Button size="sm" variant="danger" icon={Ban} onClick={() => setAction({ merchant: m, status: MERCHANT_STATUS.SUSPENDED, label: 'Suspend merchant', tone: 'danger' })}>Suspend</Button>
                      )}
                      {(m.status === MERCHANT_STATUS.SUSPENDED || m.status === MERCHANT_STATUS.REJECTED) && (
                        <Button size="sm" icon={RotateCw} onClick={() => setAction({ merchant: m, status: MERCHANT_STATUS.APPROVED, label: 'Reactivate merchant', tone: 'primary' })}>Reactivate</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={action != null}
        onClose={() => setAction(null)}
        onConfirm={run}
        title={action?.label ?? ''}
        confirmLabel={action?.label.split(' ')[0]}
        tone={action?.tone}
        message={
          action
            ? `${action.label} "${action.merchant.companyName}"? The merchant will be notified.`
            : ''
        }
      />
    </div>
  );
}
