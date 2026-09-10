import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SHIPMENT_STATUS, SHIPMENT_TIMELINE } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { shipmentService } from '@/services/shipmentService';
import { updateShipmentStatus } from '@/services/fulfillmentService';
import { humanizeStatus, formatDateTime } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import {
  Button, Card, CardBody, CardHeader, EmptyState, Field, Input, LoadingState, PageHeader, Select, StatusBadge, useToast,
} from '@/components/ui';
import { ShipmentTimeline } from '@/components/shipment/ShipmentTimeline';
import type { ShipmentStatus } from '@/constants/status';

export function AdminShipmentDetailPage() {
  const { id = '' } = useParams();
  const toast = useToast();
  const { data: shipment, loading, reload } = useAsync(() => shipmentService.get(id), [id]);
  const [status, setStatus] = useState<ShipmentStatus>(SHIPMENT_STATUS.PACKED);
  const [driver, setDriver] = useState('');
  const [vehicle, setVehicle] = useState('');

  useEffect(() => {
    if (shipment) { setStatus(shipment.status); setDriver(shipment.driver); setVehicle(shipment.vehicle); }
  }, [shipment]);

  if (loading) return <LoadingState />;
  if (!shipment) return <EmptyState title="Shipment not found" action={<Button to="/admin/shipments">Back</Button>} />;

  const saveAssignment = async () => {
    await shipmentService.update(shipment.id, { driver, vehicle });
    toast.success('Driver / vehicle updated.');
    reload();
  };
  const applyStatus = async () => {
    if (status === SHIPMENT_STATUS.DELIVERED) {
      return toast.info('Use the Delivery screen to record delivery details.');
    }
    await updateShipmentStatus(shipment, status);
    toast.success(`Shipment status: ${humanizeStatus(status)}.`);
    reload();
  };

  return (
    <div>
      <Link to="/admin/shipments" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Shipments
      </Link>
      <PageHeader
        title={shipment.number}
        subtitle={<>Order <Link to={`/admin/orders/${shipment.orderId}`} className="text-brand-700 hover:underline">{shipment.orderNumber}</Link></>}
        actions={<StatusBadge status={shipment.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tracking" />
          <CardBody><ShipmentTimeline shipment={shipment} /></CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Update status" />
            <CardBody className="space-y-3">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                options={SHIPMENT_TIMELINE.map((s) => ({ value: s, label: humanizeStatus(s) }))}
              />
              <Button fullWidth onClick={applyStatus}>Apply status</Button>
              {shipment.status !== SHIPMENT_STATUS.DELIVERED && (
                <Button fullWidth variant="secondary" to="/admin/delivery">Record delivery</Button>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Assignment" />
            <CardBody className="space-y-3">
              <Field label="Driver"><Input value={driver} onChange={(e) => setDriver(e.target.value)} /></Field>
              <Field label="Vehicle"><Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} /></Field>
              <Button fullWidth variant="secondary" onClick={saveAssignment}>Save assignment</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Details" />
            <CardBody className="grid grid-cols-2 gap-3 text-sm">
              <Cell label="Carrier" value={shipment.carrier} />
              <Cell label="Destination" value={shipment.destination} />
              <Cell label="Dispatched" value={formatDateTime(shipment.dispatchedAt)} />
              <Cell label="ETA" value={formatDateTime(shipment.etaAt)} />
              <Cell label="Dispatched qty" value={formatKg(shipment.dispatchedKg)} />
              {shipment.deliveredKg != null && <Cell label="Delivered qty" value={formatKg(shipment.deliveredKg)} />}
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
