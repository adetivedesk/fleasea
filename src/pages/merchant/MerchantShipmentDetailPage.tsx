import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { shipmentService } from '@/services/shipmentService';
import { formatDateTime, formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, CardHeader, EmptyState, LoadingState, PageHeader, StatusBadge,
} from '@/components/ui';
import { ShipmentTimeline } from '@/components/shipment/ShipmentTimeline';

export function MerchantShipmentDetailPage() {
  const { id = '' } = useParams();
  const { data: shipment, loading } = useAsync(() => shipmentService.get(id), [id]);

  if (loading) return <LoadingState />;
  if (!shipment) {
    return <EmptyState title="Shipment not found" action={<Button to="/merchant/shipments">Back to shipments</Button>} />;
  }

  const variance = shipment.deliveredKg != null ? shipment.deliveredKg - shipment.dispatchedKg : null;

  return (
    <div>
      <Link to="/merchant/shipments" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Shipments
      </Link>
      <PageHeader
        title={shipment.number}
        subtitle={<>Order <Link to={`/merchant/orders/${shipment.orderId}`} className="text-brand-700 hover:underline">{shipment.orderNumber}</Link></>}
        actions={<StatusBadge status={shipment.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tracking" />
          <CardBody><ShipmentTimeline shipment={shipment} /></CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Shipment details" />
            <CardBody className="grid grid-cols-2 gap-3 text-sm">
              <Cell label="Destination" value={shipment.destination} />
              <Cell label="Carrier" value={shipment.carrier} />
              <Cell label="Vehicle" value={shipment.vehicle} />
              <Cell label="Driver" value={shipment.driver} />
              <Cell label="Dispatched" value={formatDateTime(shipment.dispatchedAt)} />
              <Cell label="ETA" value={formatDateTime(shipment.etaAt)} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><Package className="h-4 w-4" /> Delivery</span>} />
            <CardBody className="space-y-2 text-sm">
              <Row label="Dispatched quantity" value={formatKg(shipment.dispatchedKg)} />
              <Row label="Delivered quantity" value={shipment.deliveredKg != null ? formatKg(shipment.deliveredKg) : 'Pending'} />
              {variance != null && (
                <Row
                  label="Variance"
                  value={`${variance > 0 ? '+' : ''}${variance.toLocaleString()} KG`}
                  tone={variance < 0 ? 'neg' : variance > 0 ? 'pos' : undefined}
                />
              )}
              <Row label="Delivered on" value={shipment.deliveredAt ? formatDate(shipment.deliveredAt) : '—'} />
              <Row label="Proof of delivery" value={shipment.proofOfDelivery ?? 'Not yet uploaded'} />
              {shipment.notes && <p className="pt-1 text-xs text-ink-500">{shipment.notes}</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  );
}
function Row({ label, value, tone }: { label: string; value: string; tone?: 'pos' | 'neg' }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={tone === 'neg' ? 'font-medium text-red-600' : tone === 'pos' ? 'font-medium text-emerald-600' : 'font-medium text-ink-800'}>
        {value}
      </span>
    </div>
  );
}
