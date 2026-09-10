import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Truck, CreditCard, FileText } from 'lucide-react';
import { PAYMENT_STATUS } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { shipmentService } from '@/services/shipmentService';
import { documentService } from '@/services/documentService';
import { paymentTermLabel } from '@/data/settings';
import { formatDate, formatDateTime } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import {
  Button, Card, CardBody, CardHeader, EmptyState, LoadingState, PageHeader, StatusBadge, useToast,
} from '@/components/ui';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { PaymentSimulator } from '@/components/payment/PaymentSimulator';
import type { Payment } from '@/types';

export function MerchantOrderDetailPage() {
  const { id = '' } = useParams();
  const { state } = useLocation() as { state?: { justPlaced?: boolean } };
  const toast = useToast();
  const [payTarget, setPayTarget] = useState<Payment | null>(null);

  const { data, loading, reload } = useAsync(async () => {
    const order = await orderService.get(id);
    if (!order) return { order: undefined };
    const [payments, shipments, docs] = await Promise.all([
      paymentService.listForOrder(order.id),
      shipmentService.list(),
      documentService.listForOrder(order.id),
    ]);
    return { order, payments, shipment: shipments.find((s) => s.orderId === order.id), docs };
  }, [id]);

  if (loading) return <LoadingState />;
  if (!data?.order) {
    return <EmptyState title="Order not found" action={<Button to="/merchant/orders">Back to orders</Button>} />;
  }

  const { order, payments = [], shipment, docs = [] } = data;
  const nextPayable = payments.find(
    (p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.FAILED,
  );

  return (
    <div>
      <Link to="/merchant/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Orders
      </Link>

      {state?.justPlaced && (
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">Order Successfully Submitted</p>
              <p className="text-sm text-emerald-800">
                {order.number} · {formatMoney(order.total, order.currency)} · {paymentTermLabel(order.paymentTerm)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {nextPayable && (
              <Button size="sm" icon={CreditCard} onClick={() => setPayTarget(nextPayable)}>Pay now</Button>
            )}
            <Button size="sm" variant="secondary" icon={Download} onClick={() => toast.success('Order summary downloaded (demo).')}>
              Summary
            </Button>
          </div>
        </div>
      )}

      <PageHeader
        title={order.number}
        subtitle={`Placed ${formatDate(order.createdAt)} · expected delivery ${formatDate(order.expectedDeliveryAt)}`}
        actions={
          <>
            <StatusBadge status={order.status} />
            {shipment && (
              <Button to={`/merchant/shipments/${shipment.id}`} size="sm" variant="secondary" icon={Truck}>
                Track shipment
              </Button>
            )}
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
                    <Link to={`/merchant/products/${it.productId}`} className="font-medium text-ink-800 hover:text-brand-700">
                      {it.productNameEn}
                    </Link>
                    <p className="text-xs text-ink-400">
                      {formatKg(it.quantityKg)} × {formatMoney(it.pricePerKg, it.currency, { unit: 'KG' })}
                    </p>
                  </div>
                  <p className="font-medium text-ink-800">{formatMoney(it.subtotal, it.currency)}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Payments" />
            <CardBody>
              {payments.length === 0 ? (
                <p className="text-sm text-ink-500">No payments recorded.</p>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-200 p-3 text-sm">
                      <div>
                        <p className="font-medium text-ink-800">{p.portion} — {formatMoney(p.amount, p.currency)}</p>
                        <p className="text-xs text-ink-400">{p.method.replace('_', ' ')} · {formatDate(p.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.status} />
                        {(p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.FAILED) && (
                          <Button size="sm" onClick={() => setPayTarget(p)}>Pay</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-ink-400">Payment term: {paymentTermLabel(order.paymentTerm)}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Order timeline" />
            <CardBody><OrderTimeline order={order} /></CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Financial summary" />
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Goods subtotal" value={formatMoney(order.subtotal, order.currency)} />
                <Row label="Delivery" value={formatMoney(order.deliveryFee, order.currency)} />
                <Row label="VAT" value={formatMoney(order.tax, order.currency)} />
                <div className="border-t border-ink-200 pt-2">
                  <Row label="Total" value={formatMoney(order.total, order.currency)} strong />
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Delivery" />
            <CardBody className="text-sm">
              <p className="font-medium text-ink-800">{order.deliveryAddress.line1}</p>
              <p className="text-ink-500">{order.deliveryAddress.city}, {order.deliveryAddress.country}</p>
              <p className="mt-2 text-xs text-ink-400">Expected {formatDateTime(order.expectedDeliveryAt)}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Documents"
              action={<Link to="/merchant/documents" className="text-xs font-medium text-brand-700 hover:underline">All</Link>}
            />
            <CardBody className="space-y-1.5 text-sm">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-ink-600">
                    <FileText className="h-3.5 w-3.5" /> {d.title}
                  </span>
                  <span className={d.locked ? 'text-xs text-amber-700' : 'text-xs text-emerald-600'}>
                    {d.locked ? 'Locked' : 'Available'}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <PaymentSimulator payment={payTarget} open={payTarget != null} onClose={() => setPayTarget(null)} onDone={reload} />
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
