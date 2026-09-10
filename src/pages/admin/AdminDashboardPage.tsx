import { Link } from 'react-router-dom';
import {
  Users, UserCheck, Fish, Boxes, PackageCheck, Handshake, CreditCard, Truck, ArrowRight,
} from 'lucide-react';
import {
  MERCHANT_STATUS, ORDER_STATUS, NEGOTIATION_STATUS, PAYMENT_STATUS, SHIPMENT_STATUS, STOCK_STATUS,
} from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { merchantService } from '@/services/merchantService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { negotiationService } from '@/services/negotiationService';
import { paymentService } from '@/services/paymentService';
import { shipmentService } from '@/services/shipmentService';
import { categoryName } from '@/data/categories';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import { formatKg } from '@/utils/quantity';
import {
  Card, CardBody, CardHeader, EmptyState, LoadingState, PageHeader, StatCard, StatusBadge,
} from '@/components/ui';
import { MiniBars, MiniLine, MiniDonut } from '@/components/charts/Charts';

const IN_TRANSIT = [SHIPMENT_STATUS.DISPATCHED, SHIPMENT_STATUS.IN_TRANSIT, SHIPMENT_STATUS.AT_DESTINATION, SHIPMENT_STATUS.OUT_FOR_DELIVERY] as string[];

export function AdminDashboardPage() {
  const { data, loading } = useAsync(async () => {
    const [merchants, products, orders, negotiations, payments, shipments] = await Promise.all([
      merchantService.list(),
      productService.listAll(),
      orderService.list(),
      negotiationService.list(),
      paymentService.list(),
      shipmentService.list(),
    ]);
    return { merchants, products, orders, negotiations, payments, shipments };
  }, []);

  if (loading || !data) return <LoadingState />;
  const { merchants, products, orders, negotiations, payments, shipments } = data;

  const pendingMerchants = merchants.filter((m) => m.status === MERCHANT_STATUS.PENDING);
  const activeProducts = products.filter((p) => p.active);
  const totalAvailableKg = activeProducts.reduce((s, p) => s + (p.availableKg - p.reservedKg), 0);
  const todaysOrders = orders.filter((o) => o.createdAt.slice(0, 10) === '2026-09-10');
  const pendingNegs = negotiations.filter((n) => n.status === NEGOTIATION_STATUS.PENDING || n.status === NEGOTIATION_STATUS.COUNTER_OFFER);
  const pendingPayments = payments.filter((p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING || p.status === PAYMENT_STATUS.FAILED);
  const activeShipments = shipments.filter((s) => IN_TRANSIT.includes(s.status));
  const ordersAwaiting = orders.filter((o) => o.status === ORDER_STATUS.PENDING_PAYMENT || o.status === ORDER_STATUS.CONFIRMED);
  const lowInventory = activeProducts.filter((p) => p.stockStatus === STOCK_STATUS.LOW_STOCK || p.stockStatus === STOCK_STATUS.CRITICAL || p.stockStatus === STOCK_STATUS.OUT_OF_STOCK);

  // charts
  const days = Array.from({ length: 8 }, (_, i) => {
    const d = new Date('2026-09-10T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - (7 - i));
    return d.toISOString().slice(0, 10);
  });
  const ordersByDay = days.map((d) => ({ label: d.slice(8), value: orders.filter((o) => o.createdAt.slice(0, 10) === d).length }));
  const salesByDay = days.map((d) =>
    orders.filter((o) => o.createdAt.slice(0, 10) === d && o.currency === 'SAR').reduce((s, o) => s + o.total, 0),
  );
  const byCategory = ['FRESH_ICE', 'LIVE', 'FROZEN'].map((c) => ({
    label: categoryName(c, 'en'),
    value: activeProducts.filter((p) => p.category === c).length,
  }));
  const topInventory = [...activeProducts]
    .sort((a, b) => b.availableKg - a.availableKg)
    .slice(0, 6)
    .map((p) => ({ label: p.nameEn.split(' ')[0], value: Math.round((p.availableKg - p.reservedKg) / 1000) }));

  return (
    <div>
      <PageHeader title="Today's Trading Overview" subtitle="Operational control center — 10 September 2026" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total merchants" value={merchants.length} icon={Users} />
        <StatCard label="Pending approvals" value={pendingMerchants.length} icon={UserCheck} tone="warning" />
        <StatCard label="Active products" value={activeProducts.length} icon={Fish} />
        <StatCard label="Available inventory" value={formatKg(totalAvailableKg)} icon={Boxes} />
        <StatCard label="Today's orders" value={todaysOrders.length} icon={PackageCheck} />
        <StatCard label="Pending negotiations" value={pendingNegs.length} icon={Handshake} tone="info" />
        <StatCard label="Pending payments" value={pendingPayments.length} icon={CreditCard} tone="warning" />
        <StatCard label="Active shipments" value={activeShipments.length} icon={Truck} tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader title="Orders over time" /><CardBody><MiniBars data={ordersByDay} /></CardBody></Card>
        <Card><CardHeader title="Sales value (SAR)" /><CardBody>
          <MiniLine points={salesByDay} labels={days.map((d) => d.slice(5))} format={(n) => formatMoney(n, 'SAR')} />
        </CardBody></Card>
        <Card><CardHeader title="Products by category" /><CardBody><MiniDonut data={byCategory} /></CardBody></Card>
        <Card><CardHeader title="Inventory (TON available)" /><CardBody><MiniBars data={topInventory} format={(n) => `${n}t`} /></CardBody></Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttentionList
          title="Pending merchant approvals"
          to="/admin/merchants"
          empty="No merchants awaiting approval."
          rows={pendingMerchants.map((m) => ({
            key: m.id, to: `/admin/merchants/${m.id}`,
            main: m.companyName, sub: `${m.address.country} · ${formatDate(m.registeredAt)}`,
            badge: <StatusBadge status={m.status} />,
          }))}
        />
        <AttentionList
          title="New / active negotiations"
          to="/admin/negotiations"
          empty="No open negotiations."
          rows={pendingNegs.map((n) => ({
            key: n.id, to: `/admin/negotiations`,
            main: n.number, sub: `${formatKg(n.quantityKg)} · ${formatMoney(n.proposedPrice, n.currency, { unit: 'KG' })}`,
            badge: <StatusBadge status={n.status} />,
          }))}
        />
        <AttentionList
          title="Orders awaiting confirmation"
          to="/admin/orders"
          empty="No orders awaiting action."
          rows={ordersAwaiting.map((o) => ({
            key: o.id, to: `/admin/orders/${o.id}`,
            main: o.number, sub: `${formatMoney(o.total, o.currency)} · ${formatDate(o.createdAt)}`,
            badge: <StatusBadge status={o.status} />,
          }))}
        />
        <AttentionList
          title="Low inventory"
          to="/admin/inventory"
          empty="All products well stocked."
          rows={lowInventory.map((p) => ({
            key: p.id, to: `/admin/inventory`,
            main: p.nameEn, sub: `Available ${formatKg(p.availableKg - p.reservedKg)}`,
            badge: <StatusBadge status={p.stockStatus} />,
          }))}
        />
      </div>
    </div>
  );
}

function AttentionList({
  title, to, empty, rows,
}: {
  title: string; to: string; empty: string;
  rows: Array<{ key: string; to: string; main: string; sub: string; badge: React.ReactNode }>;
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        action={<Link to={to} className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">All <ArrowRight className="h-3 w-3" /></Link>}
      />
      {rows.length === 0 ? (
        <EmptyState title={empty} className="border-0" />
      ) : (
        <div className="divide-y divide-ink-100">
          {rows.slice(0, 5).map((r) => (
            <Link key={r.key} to={r.to} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-ink-50">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-800">{r.main}</p>
                <p className="truncate text-xs text-ink-400">{r.sub}</p>
              </div>
              {r.badge}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
