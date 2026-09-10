import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Ban, RotateCw, Plus } from 'lucide-react';
import { MERCHANT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { merchantService } from '@/services/merchantService';
import { orderService } from '@/services/orderService';
import { negotiationService } from '@/services/negotiationService';
import { paymentService } from '@/services/paymentService';
import { notificationService } from '@/services/notificationService';
import { categoryName } from '@/data/categories';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import {
  Button, Card, CardBody, ConfirmDialog, Field, LoadingState, PageHeader,
  StatusBadge, Textarea, EmptyState, useToast,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import type { MerchantStatus } from '@/constants/status';

const TABS = ['Overview', 'Contacts', 'Documents', 'Orders', 'Negotiations', 'Payments', 'Notes', 'Status'] as const;
type Tab = (typeof TABS)[number];

export function AdminMerchantDetailPage() {
  const { id = '' } = useParams();
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const merchant = await merchantService.get(id);
    if (!merchant) return { merchant: undefined };
    const [orders, negotiations, payments] = await Promise.all([
      orderService.list(),
      negotiationService.listForMerchant(merchant.id),
      paymentService.listForMerchant(merchant.id),
    ]);
    return { merchant, orders: orders.filter((o) => o.merchantId === merchant.id), negotiations, payments };
  }, [id]);

  const [tab, setTab] = useState<Tab>('Overview');
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState<{ status: MerchantStatus; label: string; tone: 'primary' | 'danger' } | null>(null);

  if (loading) return <LoadingState />;
  if (!data?.merchant) return <EmptyState title="Merchant not found" action={<Button to="/admin/merchants">Back</Button>} />;

  const { merchant: m, orders = [], negotiations = [], payments = [] } = data;

  const addNote = async () => {
    if (!note.trim()) return;
    await merchantService.addNote(m.id, 'Admin', note.trim());
    setNote('');
    toast.success('Note added.');
    reload();
  };

  const runStatus = async () => {
    if (!confirm) return;
    await merchantService.setStatus(m.id, confirm.status);
    notificationService.push('merchant', 'merchant_status', 'Account status changed', `${m.companyName}: status is now ${confirm.status}.`);
    toast.success(`Status updated to ${confirm.status}.`);
    reload();
  };

  return (
    <div>
      <Link to="/admin/merchants" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Merchants
      </Link>
      <PageHeader
        title={m.companyName}
        subtitle={<span className="inline-flex items-center gap-2">{m.businessType} <StatusBadge status={m.status} /></span>}
      />

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-ink-200">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              'whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium',
              tab === tb ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-800',
            )}
          >
            {tb}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Info label="Company (Arabic)" value={m.companyNameAr} rtl />
          <Info label="Commercial registration" value={m.crNumber} />
          <Info label="VAT / Tax number" value={m.vatNumber} />
          <Info label="Country / City" value={`${m.address.country} · ${m.address.city}`} />
          <Info label="Address" value={m.address.line1} />
          <Info label="Estimated monthly volume" value={`${m.estimatedMonthlyVolumeKg.toLocaleString()} KG`} />
          <Info label="Preferred currency" value={m.preferredCurrency} />
          <Info label="Preferred categories" value={m.preferredCategories.map((c) => categoryName(c, 'en')).join(', ')} />
          <Info label="Business activity" value={m.businessActivity} className="sm:col-span-2" />
          <Info label="Registered" value={formatDate(m.registeredAt)} />
        </div>
      )}

      {tab === 'Contacts' && (
        <Card><CardBody className="grid gap-3 sm:grid-cols-2 text-sm">
          <Info label="Full name" value={m.contact.fullName} />
          <Info label="Position" value={m.contact.position} />
          <Info label="Email" value={m.contact.email} />
          <Info label="Mobile" value={m.contact.mobile} />
          <Info label="WhatsApp" value={m.contact.whatsapp ?? '—'} />
        </CardBody></Card>
      )}

      {tab === 'Documents' && (
        <Card><CardBody>
          {m.documents.length === 0 ? <p className="text-sm text-ink-500">No documents on file.</p> : (
            <ul className="space-y-2 text-sm">
              {m.documents.map((d) => (
                <li key={d.fileName} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2">
                  <span className="text-ink-700">{d.fileName} <span className="text-xs text-ink-400">({d.sizeKb} KB)</span></span>
                  <span className="text-xs text-ink-400">{formatDate(d.uploadedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody></Card>
      )}

      {tab === 'Orders' && (
        <MiniTable
          empty="No orders."
          head={['Order', 'Date', 'Amount', 'Status']}
          rows={orders.map((o) => [
            <Link key="l" to={`/admin/orders/${o.id}`} className="text-brand-700 hover:underline">{o.number}</Link>,
            formatDate(o.createdAt), formatMoney(o.total, o.currency), <StatusBadge key="s" status={o.status} />,
          ])}
        />
      )}

      {tab === 'Negotiations' && (
        <MiniTable
          empty="No negotiations."
          head={['Ref', 'Qty (KG)', 'Proposed', 'Status']}
          rows={negotiations.map((n) => [
            n.number, n.quantityKg.toLocaleString(),
            formatMoney(n.proposedPrice, n.currency, { unit: 'KG' }), <StatusBadge key="s" status={n.status} />,
          ])}
        />
      )}

      {tab === 'Payments' && (
        <MiniTable
          empty="No payments."
          head={['Order', 'Portion', 'Amount', 'Status']}
          rows={payments.map((p) => [
            p.orderNumber, p.portion, formatMoney(p.amount, p.currency), <StatusBadge key="s" status={p.status} />,
          ])}
        />
      )}

      {tab === 'Notes' && (
        <Card><CardBody>
          <div className="space-y-3">
            {m.internalNotes.length === 0 && <p className="text-sm text-ink-500">No internal notes yet.</p>}
            {m.internalNotes.map((n) => (
              <div key={n.id} className="rounded-lg border border-ink-200 p-3 text-sm">
                <p className="text-ink-700">{n.text}</p>
                <p className="mt-1 text-xs text-ink-400">{n.author} · {formatDate(n.createdAt)}</p>
              </div>
            ))}
          </div>
          <Field label="Add internal note" className="mt-4">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Visible to Fleasea staff only" />
          </Field>
          <Button icon={Plus} className="mt-2" onClick={addNote}>Add note</Button>
        </CardBody></Card>
      )}

      {tab === 'Status' && (
        <Card><CardBody className="space-y-3">
          <p className="text-sm text-ink-600">Current status: <StatusBadge status={m.status} /></p>
          <div className="flex flex-wrap gap-2">
            {m.status === MERCHANT_STATUS.PENDING && (
              <>
                <Button icon={Check} onClick={() => setConfirm({ status: MERCHANT_STATUS.APPROVED, label: 'Approve merchant', tone: 'primary' })}>Approve</Button>
                <Button variant="danger" icon={X} onClick={() => setConfirm({ status: MERCHANT_STATUS.REJECTED, label: 'Reject application', tone: 'danger' })}>Reject</Button>
              </>
            )}
            {m.status === MERCHANT_STATUS.APPROVED && (
              <Button variant="danger" icon={Ban} onClick={() => setConfirm({ status: MERCHANT_STATUS.SUSPENDED, label: 'Suspend merchant', tone: 'danger' })}>Suspend</Button>
            )}
            {(m.status === MERCHANT_STATUS.SUSPENDED || m.status === MERCHANT_STATUS.REJECTED) && (
              <Button icon={RotateCw} onClick={() => setConfirm({ status: MERCHANT_STATUS.APPROVED, label: 'Reactivate merchant', tone: 'primary' })}>Reactivate</Button>
            )}
          </div>
        </CardBody></Card>
      )}

      <ConfirmDialog
        open={confirm != null}
        onClose={() => setConfirm(null)}
        onConfirm={runStatus}
        title={confirm?.label ?? ''}
        confirmLabel={confirm?.label.split(' ')[0]}
        tone={confirm?.tone}
        message={confirm ? `${confirm.label} "${m.companyName}"? The merchant will be notified.` : ''}
      />
    </div>
  );
}

function Info({ label, value, className, rtl }: { label: string; value: string; className?: string; rtl?: boolean }) {
  return (
    <div className={cn('rounded-lg border border-ink-200 bg-white p-3', className)}>
      <p className="text-xs text-ink-400">{label}</p>
      <p dir={rtl ? 'rtl' : undefined} className="mt-0.5 text-sm font-medium text-ink-800">{value}</p>
    </div>
  );
}

function MiniTable({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) return <EmptyState title={empty} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
            {head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-ink-100 last:border-0">
              {r.map((c, j) => <td key={j} className="px-4 py-3 text-ink-700">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
