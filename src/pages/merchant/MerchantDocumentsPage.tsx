import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { documentService } from '@/services/documentService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { formatDate } from '@/utils/format';
import { Card, CardBody, CardHeader, EmptyState, LoadingState, PageHeader } from '@/components/ui';
import { DocumentCard } from '@/components/document/DocumentCard';

export function MerchantDocumentsPage() {
  const { data, loading } = useAsync(async () => {
    const orders = await orderService.listForMerchant(CURRENT_MERCHANT_ID);
    const docs = await documentService.listForOrders(orders.map((o) => o.id));
    return { orders, docs };
  }, []);

  const grouped = useMemo(() => {
    if (!data) return [];
    return data.orders
      .map((o) => ({ order: o, docs: data.docs.filter((d) => d.orderId === o.id) }))
      .filter((g) => g.docs.length > 0);
  }, [data]);

  if (loading) return <LoadingState />;

  const lockedCount = data?.docs.filter((d) => d.locked).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Document Center"
        subtitle="Order confirmations, invoices, shipment and delivery documents, and receipts."
      />

      {lockedCount > 0 && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {lockedCount} document{lockedCount > 1 ? 's are' : ' is'} locked. Complete the remaining
          70% payment on the related order to release shipment documents.
        </div>
      )}

      {grouped.length === 0 ? (
        <EmptyState icon={FileText} title="No documents yet" body="Documents are generated as your orders progress." />
      ) : (
        <div className="space-y-5">
          {grouped.map(({ order, docs }) => (
            <Card key={order.id}>
              <CardHeader
                title={
                  <span>
                    <Link to={`/merchant/orders/${order.id}`} className="text-brand-700 hover:underline">
                      {order.number}
                    </Link>
                    <span className="ms-2 text-xs font-normal text-ink-400">{formatDate(order.createdAt)}</span>
                  </span>
                }
              />
              <CardBody className="grid gap-2 sm:grid-cols-2">
                {docs.map((d) => (
                  <DocumentCard key={d.id} doc={d} />
                ))}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
