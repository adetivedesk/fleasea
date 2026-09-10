import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { merchantService } from '@/services/merchantService';
import { placeOrder } from '@/services/checkoutService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { useCart } from '@/store/CartContext';
import { useApp } from '@/store/AppContext';
import { PAYMENT_TERMS } from '@/data/settings';
import { PAYMENT_TERM } from '@/constants';
import { buildCartTotals } from '@/utils/orderCalc';
import { formatMoney } from '@/utils/currency';
import { formatKg } from '@/utils/quantity';
import type { PaymentTerm } from '@/constants/status';
import {
  Button, Card, CardBody, CardHeader, EmptyState, Field, Input, LoadingState, PageHeader, useToast,
} from '@/components/ui';

export function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const cart = useCart();
  const { currency, currencies } = useApp();

  const { data, loading } = useAsync(async () => {
    const [products, merchant] = await Promise.all([
      productService.list(),
      merchantService.get(CURRENT_MERCHANT_ID),
    ]);
    return { products, merchant };
  }, []);

  const [term, setTerm] = useState<PaymentTerm>(PAYMENT_TERM.SPLIT_30_70);
  const [city, setCity] = useState('');
  const [line1, setLine1] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading || !data) return <LoadingState />;
  const { products, merchant } = data;

  if (cart.items.length === 0) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <EmptyState title="Your cart is empty" action={<Button to="/merchant/products">Browse Fish</Button>} />
      </div>
    );
  }

  const totals = buildCartTotals(cart.items, products, currency, currencies);
  const addr = {
    country: merchant?.address.country ?? 'Saudi Arabia',
    city: city || merchant?.address.city || '',
    line1: line1 || merchant?.address.line1 || '',
  };

  const submit = async () => {
    if (!addr.city || !addr.line1) return toast.error('Enter a delivery address.');
    setBusy(true);
    try {
      const order = await placeOrder({
        merchantId: CURRENT_MERCHANT_ID,
        items: cart.items,
        products,
        currency,
        currencies,
        paymentTerm: term,
        deliveryAddress: addr,
        expectedDeliveryAt: date
          ? new Date(date).toISOString()
          : new Date(Date.now() + 10 * 864e5).toISOString(),
      });
      cart.clear();
      toast.success('Order submitted.');
      navigate(`/merchant/orders/${order.id}`, { state: { justPlaced: true } });
    } catch {
      toast.error('Could not place the order.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/merchant/cart')} className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Back to cart
      </button>
      <PageHeader title="Checkout" subtitle="Review your order, delivery details and payment terms." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Order summary" />
            <CardBody className="divide-y divide-ink-100">
              {totals.lines.map((l) => (
                <div key={l.product.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-ink-800">{l.product.nameEn}</p>
                    <p className="text-xs text-ink-400">
                      {formatKg(l.quantityKg)} × {formatMoney(l.pricePerKg, currency, { unit: 'KG' })}
                    </p>
                  </div>
                  <p className="font-medium text-ink-800">{formatMoney(l.subtotal, currency)}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Buyer information" />
            <CardBody className="grid gap-2 text-sm sm:grid-cols-2">
              <Info label="Company" value={merchant?.companyName ?? '—'} />
              <Info label="Contact" value={merchant?.contact.fullName ?? '—'} />
              <Info label="Email" value={merchant?.contact.email ?? '—'} />
              <Info label="Mobile" value={merchant?.contact.mobile ?? '—'} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Delivery information" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="City" required>
                <Input value={addr.city} onChange={(e) => setCity(e.target.value)} />
              </Field>
              <Field label="Requested delivery date">
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              <Field label="Delivery address" required className="sm:col-span-2">
                <Input value={addr.line1} onChange={(e) => setLine1(e.target.value)} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Payment terms" />
            <CardBody className="space-y-2">
              {PAYMENT_TERMS.map((pt) => (
                <label
                  key={pt.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${
                    term === pt.id ? 'border-brand-400 bg-brand-50/50' : 'border-ink-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="term"
                    checked={term === pt.id}
                    onChange={() => setTerm(pt.id)}
                    className="mt-1 h-4 w-4 text-brand-700"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink-900">{pt.label}</span>
                    <span className="block text-xs text-ink-500">{pt.description}</span>
                  </span>
                </label>
              ))}
            </CardBody>
          </Card>
        </div>

        <Card className="h-fit">
          <CardBody>
            <h3 className="font-semibold text-ink-900">Totals</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label={`Goods (${formatKg(totals.totalKg)})`} value={formatMoney(totals.subtotal, currency)} />
              <Row label="Delivery (indicative)" value={formatMoney(totals.deliveryFee, currency)} />
              <Row label="VAT 15%" value={formatMoney(totals.tax, currency)} />
              <div className="border-t border-ink-200 pt-2">
                <Row label="Order total" value={formatMoney(totals.total, currency)} strong />
              </div>
              {term === PAYMENT_TERM.SPLIT_30_70 && (
                <p className="pt-1 text-xs text-ink-500">
                  Due now (30%): <strong>{formatMoney(totals.total * 0.3, currency)}</strong>
                </p>
              )}
            </dl>
            <Button icon={CheckCircle2} fullWidth className="mt-4" onClick={submit} disabled={busy}>
              {busy ? 'Placing order…' : 'Place Order'}
            </Button>
            <p className="mt-2 text-xs text-ink-400">
              Prototype — no real payment is taken. You simulate payment on the order page.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="font-medium text-ink-800">{value}</p>
    </div>
  );
}
function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={strong ? 'font-semibold text-ink-900' : 'text-ink-500'}>{label}</dt>
      <dd className={strong ? 'text-base font-bold text-ink-900' : 'font-medium text-ink-800'}>{value}</dd>
    </div>
  );
}
