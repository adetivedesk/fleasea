import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { shipmentService } from '@/services/shipmentService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { formatDate } from '@/utils/format';
import { formatKg } from '@/utils/quantity';
import { Button, Card, CardBody, EmptyState, LoadingState, PageHeader, StatusBadge } from '@/components/ui';

export function MerchantShipmentsPage() {
  const { data: shipments, loading } = useAsync(
    () => shipmentService.listForMerchant(CURRENT_MERCHANT_ID),
    [],
  );

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Shipments" subtitle="Track dispatch, transit and delivery of your orders." />
      {!shipments || shipments.length === 0 ? (
        <EmptyState icon={Truck} title="No active shipments." body="Shipments appear here once your confirmed orders are dispatched." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {shipments.map((s) => (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/merchant/shipments/${s.id}`} className="font-semibold text-brand-700 hover:underline">
                      {s.number}
                    </Link>
                    <p className="text-xs text-ink-400">Order {s.orderNumber}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Cell label="Destination" value={s.destination} />
                  <Cell label="Carrier" value={s.carrier} />
                  <Cell label="Dispatched" value={formatDate(s.dispatchedAt)} />
                  <Cell label="ETA" value={formatDate(s.etaAt)} />
                  <Cell label="Dispatched qty" value={formatKg(s.dispatchedKg)} />
                  {s.deliveredKg != null && <Cell label="Delivered qty" value={formatKg(s.deliveredKg)} />}
                </dl>
                <Button to={`/merchant/shipments/${s.id}`} size="sm" variant="secondary" className="mt-3">
                  View tracking
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
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
