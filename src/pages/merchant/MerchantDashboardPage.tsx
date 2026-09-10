import { Link } from 'react-router-dom';
import {
  Fish,
  Handshake,
  PackageCheck,
  Truck,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ORDER_STATUS, NEGOTIATION_STATUS, PAYMENT_STATUS, SHIPMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { negotiationService } from '@/services/negotiationService';
import { shipmentService } from '@/services/shipmentService';
import { paymentService } from '@/services/paymentService';
import { productService } from '@/services/productService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import { useApp } from '@/store/AppContext';
import { Button, Card, CardHeader, EmptyState, LoadingState, PageHeader, StatCard, StatusBadge } from '@/components/ui';

const ACTIVE_ORDER = [
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
] as string[];

const IN_TRANSIT = [
  SHIPMENT_STATUS.DISPATCHED,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.AT_DESTINATION,
  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
] as string[];

export function MerchantDashboardPage() {
  const { formatDisplayPrice } = useApp();
  const mid = CURRENT_MERCHANT_ID;

  const { data, loading } = useAsync(async () => {
    const [orders, negotiations, shipments, payments, products] = await Promise.all([
      orderService.listForMerchant(mid),
      negotiationService.listForMerchant(mid),
      shipmentService.listForMerchant(mid),
      paymentService.listForMerchant(mid),
      productService.list(),
    ]);
    return { orders, negotiations, shipments, payments, products };
  }, [mid]);

  if (loading || !data) return <LoadingState />;

  const { orders, negotiations, shipments, payments, products } = data;
  const activeOrders = orders.filter((o) => ACTIVE_ORDER.includes(o.status));
  const pendingNegs = negotiations.filter(
    (n) => n.status === NEGOTIATION_STATUS.PENDING || n.status === NEGOTIATION_STATUS.COUNTER_OFFER,
  );
  const transit = shipments.filter((s) => IN_TRANSIT.includes(s.status));
  const outstanding = payments.filter(
    (p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING || p.status === PAYMENT_STATUS.FAILED,
  );
  const outstandingSar = outstanding
    .filter((p) => p.currency === 'SAR')
    .reduce((s, p) => s + p.amount, 0);

  const highlights = products.slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Merchant Dashboard"
        subtitle="Today's trading overview for Gulf Seafood Trading Co."
        actions={<Button to="/merchant/products" icon={Fish}>Browse fish</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active orders" value={activeOrders.length} icon={PackageCheck} hint={`${orders.length} total`} />
        <StatCard label="Pending negotiations" value={pendingNegs.length} icon={Handshake} />
        <StatCard label="Shipments in transit" value={transit.length} icon={Truck} />
        <StatCard
          label="Outstanding payments"
          value={outstanding.length}
          icon={CreditCard}
          hint={outstandingSar > 0 ? `${formatMoney(outstandingSar, 'SAR')} due` : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent orders"
            action={<Link to="/merchant/orders" className="text-xs font-medium text-brand-700 hover:underline">View all</Link>}
          />
          {orders.length === 0 ? (
            <EmptyState title="You haven't placed any wholesale orders yet." action={<Button to="/merchant/products">Browse Fish</Button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-4 py-2 font-medium">Order</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Qty</th>
                    <th className="px-4 py-2 font-medium">Total</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => {
                    const qty = o.items.reduce((s, i) => s + i.quantityKg, 0);
                    return (
                      <tr key={o.id} className="border-b border-ink-100 last:border-0">
                        <td className="px-4 py-2.5">
                          <Link to={`/merchant/orders/${o.id}`} className="font-medium text-brand-700 hover:underline">
                            {o.number}
                          </Link>
                          <span className="block text-xs text-ink-400">{o.items.length} item(s)</span>
                        </td>
                        <td className="px-4 py-2.5 text-ink-600">{formatDate(o.createdAt)}</td>
                        <td className="px-4 py-2.5 text-ink-600">{formatKg(qty)}</td>
                        <td className="px-4 py-2.5 font-medium text-ink-800">{formatMoney(o.total, o.currency)}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={o.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <div className="grid gap-2 p-4">
            <Button to="/merchant/products" variant="secondary" fullWidth icon={Fish}>Browse Fish</Button>
            <Button to="/merchant/products" variant="secondary" fullWidth icon={Handshake}>Request Quote</Button>
            <Button to="/merchant/orders" variant="secondary" fullWidth icon={PackageCheck}>View Orders</Button>
            <Button to="/merchant/shipments" variant="secondary" fullWidth icon={Truck}>Track Shipment</Button>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Active shipments"
            action={<Link to="/merchant/shipments" className="text-xs font-medium text-brand-700 hover:underline">Track</Link>}
          />
          {transit.length === 0 ? (
            <EmptyState title="No active shipments." />
          ) : (
            <div className="divide-y divide-ink-100">
              {transit.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <Link to={`/merchant/shipments/${s.id}`} className="font-medium text-brand-700 hover:underline">
                      {s.number}
                    </Link>
                    <p className="text-xs text-ink-500">
                      {s.orderNumber} · {s.destination} · ETA {formatDate(s.etaAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Market highlights"
            action={<TrendingUp className="h-4 w-4 text-ink-400" />}
          />
          <div className="divide-y divide-ink-100">
            {highlights.map((p) => (
              <Link key={p.id} to={`/merchant/products/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-ink-50">
                <span className="text-sm font-medium text-ink-800">{p.nameEn}</span>
                <span className="text-sm text-brand-700">{formatDisplayPrice(p.basePrice, p.baseCurrency, 'KG')}</span>
              </Link>
            ))}
          </div>
          <div className="p-4">
            <Button to="/merchant/products" variant="ghost" size="sm" iconRight={ArrowRight} fullWidth>
              Full catalogue
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
