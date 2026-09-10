import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TERM } from '@/constants';
import { DEFAULT_ORDERS } from './orders';
import type { FleaseaDocument, Order } from '@/types';

const LOCK_MESSAGE = 'Complete the remaining 70% payment to access this document.';

function docsForOrder(o: Order): FleaseaDocument[] {
  const base = { orderId: o.id, orderNumber: o.number };
  const out: FleaseaDocument[] = [
    { ...base, id: `${o.id}-conf`, type: 'order_confirmation', title: 'Order confirmation', issuedAt: o.createdAt, locked: false },
    { ...base, id: `${o.id}-inv`, type: 'invoice', title: 'Commercial invoice', issuedAt: o.createdAt, locked: false },
  ];

  const shipped =
    o.status === ORDER_STATUS.SHIPPED ||
    o.status === ORDER_STATUS.OUT_FOR_DELIVERY ||
    o.status === ORDER_STATUS.DELIVERED ||
    o.shipmentStatus != null;

  if (shipped) {
    const lock = o.paymentTerm === PAYMENT_TERM.SPLIT_30_70 && o.paymentStatus !== PAYMENT_STATUS.PAID;
    out.push({
      ...base,
      id: `${o.id}-ship`,
      type: 'shipment_document',
      title: 'Shipment document (B/L)',
      issuedAt: o.createdAt,
      locked: lock,
      lockReason: lock ? LOCK_MESSAGE : undefined,
    });
  }

  if (o.status === ORDER_STATUS.DELIVERED) {
    out.push({ ...base, id: `${o.id}-dn`, type: 'delivery_note', title: 'Delivery note', issuedAt: o.expectedDeliveryAt, locked: false });
    out.push({ ...base, id: `${o.id}-pod`, type: 'proof_of_delivery', title: 'Proof of delivery', issuedAt: o.expectedDeliveryAt, locked: false });
  }

  if (o.paymentStatus === PAYMENT_STATUS.PAID) {
    out.push({ ...base, id: `${o.id}-rcpt`, type: 'payment_receipt', title: 'Payment receipt', issuedAt: o.createdAt, locked: false });
  }

  return out;
}

export const DEFAULT_DOCUMENTS: FleaseaDocument[] = DEFAULT_ORDERS.flatMap(docsForOrder);
