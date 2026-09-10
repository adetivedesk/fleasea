import { useMemo, useState } from 'react';
import { Check, X, Reply } from 'lucide-react';
import { NEGOTIATION_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { negotiationService } from '@/services/negotiationService';
import { productService } from '@/services/productService';
import { merchantService } from '@/services/merchantService';
import { notificationService } from '@/services/notificationService';
import { formatMoney } from '@/utils/currency';
import { formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, CardHeader, EmptyState, Field, Input, LoadingState, PageHeader,
  SegmentedControl, StatusBadge, useToast,
} from '@/components/ui';
import { NegotiationThread } from '@/components/negotiation/NegotiationThread';
import type { Negotiation } from '@/types';

const FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'all', label: 'All' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'closed', label: 'Closed' },
];

export function AdminNegotiationsPage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const [negotiations, products, merchants] = await Promise.all([
      negotiationService.list(),
      productService.listAll(),
      merchantService.list(),
    ]);
    return { negotiations, products, merchants };
  }, []);
  const [filter, setFilter] = useState('open');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [counter, setCounter] = useState('');

  const list = useMemo(() => {
    const all = data?.negotiations ?? [];
    if (filter === 'open') return all.filter((n) => n.status === NEGOTIATION_STATUS.PENDING || n.status === NEGOTIATION_STATUS.COUNTER_OFFER);
    if (filter === 'accepted') return all.filter((n) => n.status === NEGOTIATION_STATUS.ACCEPTED);
    if (filter === 'closed') return all.filter((n) => n.status === NEGOTIATION_STATUS.REJECTED || n.status === NEGOTIATION_STATUS.EXPIRED);
    return all;
  }, [data, filter]);

  if (loading || !data) return <LoadingState />;

  const productName = (id: string) => data.products.find((p) => p.id === id)?.nameEn ?? id;
  const merchantName = (id: string) => data.merchants.find((m) => m.id === id)?.companyName ?? id;
  const selected = data.negotiations.find((n) => n.id === selectedId) ?? list[0];

  const act = async (n: Negotiation, args: Parameters<typeof negotiationService.respond>[1], toastMsg: string) => {
    await negotiationService.respond(n.id, args);
    notificationService.push('merchant', 'negotiation', 'Negotiation update', `${n.number} (${productName(n.productId)}): ${toastMsg}`);
    toast.success(toastMsg);
    reload();
  };

  const accept = (n: Negotiation) => act(n, { author: 'admin', message: 'Offer accepted.', status: NEGOTIATION_STATUS.ACCEPTED }, 'Negotiation accepted.');
  const reject = (n: Negotiation) => act(n, { author: 'admin', message: 'Offer declined.', status: NEGOTIATION_STATUS.REJECTED }, 'Negotiation rejected.');
  const sendCounter = (n: Negotiation) => {
    const price = Number(counter);
    if (!(price > 0)) return toast.error('Enter a valid counter price.');
    void act(n, { author: 'admin', message: `Counter offer: ${n.currency} ${price}/KG.`, proposedPrice: price, status: NEGOTIATION_STATUS.COUNTER_OFFER }, 'Counter offer sent.');
    setCounter('');
  };

  return (
    <div>
      <PageHeader title="Negotiations" subtitle="Review, counter, accept or reject merchant price requests." />
      <div className="mb-4"><SegmentedControl value={filter} onChange={setFilter} options={FILTERS} /></div>

      {list.length === 0 ? (
        <EmptyState title="Nothing here" body="No negotiations match this filter." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            {list.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${selected?.id === n.id ? 'border-brand-400 bg-brand-50/50' : 'border-ink-200 bg-white hover:bg-ink-50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-900">{n.number}</span>
                  <StatusBadge status={n.status} />
                </div>
                <p className="text-sm text-ink-600">{merchantName(n.merchantId)}</p>
                <p className="text-xs text-ink-500">{productName(n.productId)} · {formatKg(n.quantityKg)}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {formatMoney(n.currentPrice, n.currency, { unit: 'KG' })} →{' '}
                  <span className="font-medium text-ink-700">{formatMoney(n.proposedPrice, n.currency, { unit: 'KG' })}</span>
                  <span className={`ms-2 ${n.proposedPrice < n.currentPrice ? 'text-red-600' : 'text-emerald-600'}`}>
                    ({(((n.proposedPrice - n.currentPrice) / n.currentPrice) * 100).toFixed(1)}%)
                  </span>
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selected && (
              <Card>
                <CardHeader
                  title={`${selected.number} · ${merchantName(selected.merchantId)}`}
                  action={<StatusBadge status={selected.status} />}
                />
                <CardBody>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
                    <Stat label="Product" value={productName(selected.productId)} />
                    <Stat label="Quantity" value={formatKg(selected.quantityKg)} />
                    <Stat label="Current" value={formatMoney(selected.currentPrice, selected.currency)} />
                    <Stat label="Proposed" value={formatMoney(selected.proposedPrice, selected.currency)} />
                  </div>

                  <NegotiationThread negotiation={selected} viewerSide="admin" />

                  {(selected.status === NEGOTIATION_STATUS.PENDING || selected.status === NEGOTIATION_STATUS.COUNTER_OFFER) && (
                    <div className="mt-4 space-y-3 rounded-lg border border-ink-200 p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" icon={Check} onClick={() => accept(selected)}>Accept offer</Button>
                        <Button size="sm" variant="danger" icon={X} onClick={() => reject(selected)}>Reject</Button>
                      </div>
                      <Field label={`Counter offer (${selected.currency} / KG)`}>
                        <div className="flex gap-2">
                          <Input type="number" min={0} step={0.5} value={counter} onChange={(e) => setCounter(e.target.value)} className="w-32" />
                          <Button size="sm" variant="secondary" icon={Reply} onClick={() => sendCounter(selected)}>Send counter</Button>
                        </div>
                      </Field>
                    </div>
                  )}
                  {selected.status === NEGOTIATION_STATUS.ACCEPTED && (
                    <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      Accepted. The merchant can add this to their cart at the agreed price.
                    </p>
                  )}
                  {(selected.status === NEGOTIATION_STATUS.REJECTED || selected.status === NEGOTIATION_STATUS.EXPIRED) && (
                    <p className="mt-4 rounded-lg bg-ink-100 p-3 text-sm text-ink-500">This negotiation is closed.</p>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 p-2">
      <p className="text-ink-400">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-ink-800" title={value}>{value}</p>
    </div>
  );
}
