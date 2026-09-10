/**
 * fulfillmentService — admin shipment & delivery workflow (spec §37, §38).
 * Keeps shipment status, order status and documents in sync. Frontend simulation.
 */
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TERM, SHIPMENT_STATUS } from '@/constants';
import { orderService } from './orderService';
import { shipmentService } from './shipmentService';
import { documentService } from './documentService';
import { notificationService } from './notificationService';
import { uid } from '@/utils/id';
import type { FleaseaDocument, Order, Shipment } from '@/types';
import type { ShipmentStatus } from '@/constants/status';

const LOCK_MESSAGE = 'Complete the remaining 70% payment to access this document.';

function shipmentNumber(seq: number): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `SHP-${ymd}-${String(seq).padStart(4, '0')}`;
}

export interface CreateShipmentInput {
  order: Order;
  carrier: string;
  vehicle: string;
  driver: string;
  dispatchedAt: string;
  etaAt: string;
  destination: string;
  dispatchedKg: number;
  notes?: string;
}

export async function createShipment(input: CreateShipmentInput): Promise<Shipment> {
  const existing = await shipmentService.list();
  const shipment: Shipment = {
    id: uid('shp'),
    number: shipmentNumber(existing.length + 1),
    orderId: input.order.id,
    orderNumber: input.order.number,
    merchantId: input.order.merchantId,
    destination: input.destination,
    carrier: input.carrier,
    vehicle: input.vehicle,
    driver: input.driver,
    dispatchedAt: input.dispatchedAt,
    etaAt: input.etaAt,
    status: SHIPMENT_STATUS.PACKED,
    dispatchedKg: input.dispatchedKg,
    notes: input.notes,
  };
  await shipmentService.create(shipment);

  await orderService.setStatus(input.order.id, {
    status: ORDER_STATUS.PACKED,
    shipmentStatus: SHIPMENT_STATUS.PACKED,
    note: `Shipment ${shipment.number} created.`,
  });

  // ensure a shipment document exists (locked while 70% is unpaid)
  const lock =
    input.order.paymentTerm === PAYMENT_TERM.SPLIT_30_70 &&
    input.order.paymentStatus !== PAYMENT_STATUS.PAID;
  const doc: FleaseaDocument = {
    id: `${input.order.id}-ship`,
    orderId: input.order.id,
    orderNumber: input.order.number,
    type: 'shipment_document',
    title: 'Shipment document (B/L)',
    issuedAt: new Date().toISOString(),
    locked: lock,
    lockReason: lock ? LOCK_MESSAGE : undefined,
  };
  await documentService.add([doc]);

  notificationService.push('merchant', 'shipment_created', 'Shipment created', `A shipment (${shipment.number}) has been created for order ${input.order.number}.`);
  return shipment;
}

const ORDER_FOR_SHIPMENT: Partial<Record<ShipmentStatus, Order['status']>> = {
  [SHIPMENT_STATUS.DISPATCHED]: ORDER_STATUS.SHIPPED,
  [SHIPMENT_STATUS.IN_TRANSIT]: ORDER_STATUS.SHIPPED,
  [SHIPMENT_STATUS.AT_DESTINATION]: ORDER_STATUS.SHIPPED,
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.OUT_FOR_DELIVERY,
  [SHIPMENT_STATUS.DELIVERED]: ORDER_STATUS.DELIVERED,
};

export async function updateShipmentStatus(shipment: Shipment, status: ShipmentStatus): Promise<void> {
  await shipmentService.update(shipment.id, { status });
  const orderStatus = ORDER_FOR_SHIPMENT[status];
  await orderService.setStatus(shipment.orderId, {
    status: orderStatus,
    shipmentStatus: status,
    note: `Shipment ${shipment.number}: ${status}.`,
  });
  if (status === SHIPMENT_STATUS.DISPATCHED) {
    notificationService.push('merchant', 'shipment_dispatched', 'Shipment dispatched', `Order ${shipment.orderNumber} has been shipped (${shipment.number}).`);
  }
}

export interface RecordDeliveryInput {
  shipment: Shipment;
  deliveredKg: number;
  deliveredAt: string;
  driver: string;
  vehicle: string;
  notes?: string;
  proofOfDelivery: string;
}

export async function recordDelivery(input: RecordDeliveryInput): Promise<void> {
  const { shipment } = input;
  await shipmentService.update(shipment.id, {
    status: SHIPMENT_STATUS.DELIVERED,
    deliveredKg: input.deliveredKg,
    deliveredAt: input.deliveredAt,
    driver: input.driver,
    vehicle: input.vehicle,
    notes: input.notes ?? shipment.notes,
    proofOfDelivery: input.proofOfDelivery,
  });
  await orderService.setStatus(shipment.orderId, {
    status: ORDER_STATUS.DELIVERED,
    shipmentStatus: SHIPMENT_STATUS.DELIVERED,
    note: `Delivered — ${input.deliveredKg.toLocaleString()} KG.`,
  });

  const now = new Date().toISOString();
  await documentService.add([
    { id: `${shipment.orderId}-dn`, orderId: shipment.orderId, orderNumber: shipment.orderNumber, type: 'delivery_note', title: 'Delivery note', issuedAt: now, locked: false },
    { id: `${shipment.orderId}-pod`, orderId: shipment.orderId, orderNumber: shipment.orderNumber, type: 'proof_of_delivery', title: 'Proof of delivery', issuedAt: now, locked: false },
  ]);

  const variance = input.deliveredKg - shipment.dispatchedKg;
  notificationService.push(
    'merchant',
    'shipment_delivered',
    'Shipment delivered',
    `Order ${shipment.orderNumber} has been delivered.${variance !== 0 ? ` Variance ${variance > 0 ? '+' : ''}${variance.toLocaleString()} KG recorded.` : ''}`,
  );
}
