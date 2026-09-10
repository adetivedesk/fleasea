import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, Check, X, Reply, ShoppingCart } from 'lucide-react';
import { NEGOTIATION_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { negotiationService } from '@/services/negotiationService';
import { productService } from '@/services/productService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { useCart } from '@/store/CartContext';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import { formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, CardHeader, EmptyState, Field, Input, LoadingState,
  PageHeader, SegmentedControl, StatusBadge, useToast,
} from '@/components/ui';
import { NegotiationThread } from '@/components/negotiation/NegotiationThread';
import type { Negotiation, Product } from '@/types';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'closed', label: 'Closed' },
];

export function MerchantNegotiationsPage() {
  const toast = useToast();
  const cart = useCart();
  const navigate = useNavigate();
  const { data, loading, reload } = useAsync(async () => {
    const [negotiations, products] = await Promise.all([
      negotiationService.listForMerchant(CURRENT_MERCHANT_ID),
      productService.listAll(),
    ]);
    return { negotiations, products };
  }, []);

  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [counter, setCounter] = useState('');

  const list = useMemo(() => {
    const all = data?.negotiations ?? [];
    if (filter === 'active')
      return all.filter((n) => n.status === NEGOTIATION_STATUS.PENDING || n.status === NEGOTIATION_STATUS.COUNTER_OFFER);
    if (filter === 'accepted') return all.filter((n) => n.status === NEGOTIATION_STATUS.ACCEPTED);
    if (filter === 'closed')
      return all.filter((n) => n.status === NEGOTIATION_STATUS.REJECTED || n.status === NEGOTIATION_STATUS.EXPIRED);
    return all;
  }, [data, filter]);

  if (loading || !data) return <LoadingState />;

  const products = data.products;
  const productOf = (n: Negotiation): Product | undefined => products.find((p) => p.id === n.productId);
  const selected = data.negotiations.find((n) => n.id === selectedId) ?? list[0];

  const act = async (
    id: string,
    args: Parameters<typeof negotiationService.respond>[1],
  ) => {
    await negotiationService.respond(id, args);
    reload();
  };

  const acceptCounter = (n: Negotiation) => {
    void act(n.id, { author: 'merchant', message: 'Counter offer accepted.', status: NEGOTIATION_STATUS.ACCEPTED });
    toast.success('Counter offer accepted.');
  };
  const reject = (n: Negotiation) => {
    void act(n.id, { author: 'merchant', message: 'Negotiation closed by merchant.', status: NEGOTIATION_STATUS.REJECTED });
    toast.info('Negotiation closed.');
  };
  const submitCounter = (n: Negotiation) => {
    const price = Number(counter);
    if (!(price > 0)) return toast.error('Enter a valid price.');
    void act(n.id, {
      author: 'merchant',
      message: `Counter offer: ${n.currency} ${price}/KG.`,
      proposedPrice: price,
      status: NEGOTIATION_STATUS.PENDING,
    });
    setCounter('');
    toast.success('Counter offer sent.');
  };
  const addNegotiated = (n: Negotiation) => {
    const p = productOf(n);
    if (!p) return;
    const latestOffer = [...n.messages].reverse().find((m) => m.proposedPrice != null)?.proposedPrice ?? n.proposedPrice;
    cart.add({
      productId: p.id,
      quantityKg: n.quantityKg,
      displayUnit: n.quantityKg >= 1000 ? 'TON' : 'KG',
      negotiatedPrice: latestOffer,
    });
    toast.success('Added to cart at the negotiated price.');
    navigate('/merchant/cart');
  };

  return (
    <div>
      <PageHeader
        title="Negotiations"
        subtitle="Product-level price negotiations with the Fleasea team."
        actions={<Button to="/merchant/products" icon={Handshake} variant="secondary">Request new</Button>}
      />

      <div className="mb-4">
        <SegmentedControl value={filter} onChange={setFilter} options={FILTERS} />
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No active negotiations."
          body="Request a quote from any product to start negotiating."
          action={<Button to="/merchant/products">Browse Products</Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* list */}
          <div className="space-y-2 lg:col-span-2">
            {list.map((n) => {
              const p = productOf(n);
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    selected?.id === n.id ? 'border-brand-400 bg-brand-50/50' : 'border-ink-200 bg-white hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-900">{n.number}</span>
                    <StatusBadge status={n.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-600">{p?.nameEn ?? n.productId}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {formatKg(n.quantityKg)} · {formatMoney(n.currentPrice, n.currency, { unit: 'KG' })} →{' '}
                    <span className="font-medium text-ink-700">{formatMoney(n.proposedPrice, n.currency, { unit: 'KG' })}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">Created {formatDate(n.createdAt)}</p>
                </button>
              );
            })}
          </div>

          {/* detail */}
          <div className="lg:col-span-3">
            {selected && (
              <Card>
                <CardHeader
                  title={`${selected.number} · ${productOf(selected)?.nameEn ?? ''}`}
                  action={<StatusBadge status={selected.status} />}
                />
                <CardBody>
                  <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <Stat label="Quantity" value={formatKg(selected.quantityKg)} />
                    <Stat label="Current" value={formatMoney(selected.currentPrice, selected.currency, { unit: 'KG' })} />
                    <Stat label="Latest offer" value={formatMoney(selected.proposedPrice, selected.currency, { unit: 'KG' })} />
                  </div>

                  <NegotiationThread negotiation={selected} viewerSide="merchant" />

                  {selected.status === NEGOTIATION_STATUS.COUNTER_OFFER && (
                    <div className="mt-4 space-y-3 rounded-lg border border-ink-200 p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" icon={Check} onClick={() => acceptCounter(selected)}>Accept counter</Button>
                        <Button size="sm" variant="danger" icon={X} onClick={() => reject(selected)}>Reject</Button>
                      </div>
                      <Field label={`Submit another counter (${selected.currency} / KG)`}>
                        <div className="flex gap-2">
                          <Input type="number" min={0} step={0.5} value={counter} onChange={(e) => setCounter(e.target.value)} className="w-32" />
                          <Button size="sm" variant="secondary" icon={Reply} onClick={() => submitCounter(selected)}>Send</Button>
                        </div>
                      </Field>
                    </div>
                  )}

                  {selected.status === NEGOTIATION_STATUS.PENDING && (
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      <span>Awaiting a response from the Fleasea team.</span>
                      <Button size="sm" variant="ghost" onClick={() => reject(selected)}>Withdraw</Button>
                    </div>
                  )}

                  {selected.status === NEGOTIATION_STATUS.ACCEPTED && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      <span>Price agreed. Add this to your cart at the negotiated price.</span>
                      <Button size="sm" icon={ShoppingCart} onClick={() => addNegotiated(selected)}>Add to cart</Button>
                    </div>
                  )}

                  {(selected.status === NEGOTIATION_STATUS.REJECTED || selected.status === NEGOTIATION_STATUS.EXPIRED) && (
                    <p className="mt-4 rounded-lg bg-ink-100 p-3 text-sm text-ink-500">
                      This negotiation is closed. Start a new request from the product page if needed.
                    </p>
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
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-0.5 font-semibold text-ink-800">{value}</p>
    </div>
  );
}
