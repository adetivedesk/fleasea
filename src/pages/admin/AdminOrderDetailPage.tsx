import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';
import { PAYMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { shipmentService } from '@/services/shipmentService';
import { merchantService } from '@/services/merchantService';
import { paymentTermLabel } from '@/data/settings';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import {
  Button, Card, CardBody, CardHeader, EmptyState, LoadingState, PageHeader, StatusBadge, useToast,
} from '@/components/ui';
import { OrderTimeline } from '@/components/order/OrderTimeline';

export function AdminOrderDetailPage() {
  const { id = '' } = useParams();
  const toast = useToast();
  const { data, loading, reload } = useAsync(async () => {
    const order = await orderService.get(id);
    if (!order) return { order: undefined };
    const [payments, shipments, merchant] = await Promise.all([
      paymentService.listForOrder(order.id),
      shipmentService.list(),
      merchantService.get(order.merchantId),
    ]);
    return { order, payments, shipment: shipments.find((s) => s.orderId === order.id), merchant };
  }, [id]);

  if (loading) return <LoadingState />;
  if (!data?.order) return <EmptyState title="Order not found" action={<Button to="/admin/orders">Back</Button>} />;

  const { order, payments = [], shipment, merchant } = data;

  const markPaid = async (pid: string) => {
    await paymentService.setStatus(pid, PAYMENT_STATUS.PAID);
    toast.success('Payment marked as paid.');
    reload();
  };

  return (
    <div>
      <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Orders
      </Link>
      <PageHeader
        title={order.number}
        subtitle={<>{merchant?.companyName} · placed {formatDate(order.createdAt)}</>}
        actions={
          <>
            <StatusBadge status={order.status} />
            <Button to="/admin/shipments" size="sm" variant="secondary" icon={Truck}>
              {shipment ? 'Manage shipment' : 'Create shipment'}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Products" />
            <CardBody className="divide-y divide-ink-100">
              {order.items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-ink-800">{it.productNameEn}</p>
                    <p className="text-xs text-ink-400">{formatKg(it.quantityKg)} × {formatMoney(it.pricePerKg, it.currency, { unit: 'KG' })}</p>
                  </div>
                  <p className="font-medium text-ink-800">{formatMoney(it.subtotal, it.currency)}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Payments" />
            <CardBody className="space-y-2">
              {payments.length === 0 && <p className="text-sm text-ink-500">No payments recorded.</p>}
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-200 p-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-800">{p.portion} — {formatMoney(p.amount, p.currency)}</p>
                    <p className="text-xs text-ink-400">{p.method.replace('_', ' ')} · {formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    {p.status !== PAYMENT_STATUS.PAID && (
                      <Button size="sm" onClick={() => markPaid(p.id)}>Mark paid</Button>
                    )}
                  </div>
                </div>
              ))}
              <p className="text-xs text-ink-400">Term: {paymentTermLabel(order.paymentTerm)}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Timeline" />
            <CardBody><OrderTimeline order={order} /></CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Financial summary" />
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Goods" value={formatMoney(order.subtotal, order.currency)} />
                <Row label="Delivery" value={formatMoney(order.deliveryFee, order.currency)} />
                <Row label="VAT" value={formatMoney(order.tax, order.currency)} />
                <div className="border-t border-ink-200 pt-2"><Row label="Total" value={formatMoney(order.total, order.currency)} strong /></div>
              </dl>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Delivery" />
            <CardBody className="text-sm">
              <p className="font-medium text-ink-800">{order.deliveryAddress.line1}</p>
              <p className="text-ink-500">{order.deliveryAddress.city}, {order.deliveryAddress.country}</p>
              <p className="mt-2 text-xs text-ink-400">Expected {formatDate(order.expectedDeliveryAt)}</p>
              {shipment && (
                <Link to={`/admin/shipments/${shipment.id}`} className="mt-2 inline-block text-xs font-medium text-brand-700 hover:underline">
                  {shipment.number} →
                </Link>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
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
