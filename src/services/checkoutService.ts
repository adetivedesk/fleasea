/**
 * checkoutService — orchestrates order placement and the payment-term workflow
 * (spec §20–§23, §28). Frontend simulation only.
 */
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TERM } from '@/constants';
import { MOCK_SETTINGS } from '@/data/settings';
import { buildCartTotals } from '@/utils/orderCalc';
import { makeOrderNumber, uid } from '@/utils/id';
import { orderService } from './orderService';
import { paymentService } from './paymentService';
import { documentService } from './documentService';
import { notificationService } from './notificationService';
import type {
  Address,
  CartItem,
  Currency,
  CurrencyCode,
  FleaseaDocument,
  Order,
  Payment,
  Product,
} from '@/types';
import type { PaymentTerm } from '@/constants/status';

const round2 = (n: number) => Math.round(n * 100) / 100;
const LOCK_MESSAGE = 'Complete the remaining 70% payment to access this document.';

export interface PlaceOrderInput {
  merchantId: string;
  items: CartItem[];
  products: Product[];
  currency: CurrencyCode;
  currencies: Currency[];
  paymentTerm: PaymentTerm;
  deliveryAddress: Address;
  expectedDeliveryAt: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const totals = buildCartTotals(input.items, input.products, input.currency, input.currencies);
  const existing = await orderService.list();
  const seq = MOCK_SETTINGS.orderNumberSeqStart + existing.length;
  const number = makeOrderNumber(seq);
  const now = new Date().toISOString();

  const order: Order = {
    id: number.toLowerCase(),
    number,
    merchantId: input.merchantId,
    createdAt: now,
    items: totals.lines.map((l) => ({
      productId: l.product.id,
      productNameEn: l.product.nameEn,
      quantityKg: l.quantityKg,
      pricePerKg: l.pricePerKg,
      currency: input.currency,
      subtotal: l.subtotal,
    })),
    currency: input.currency,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    total: totals.total,
    paymentTerm: input.paymentTerm,
    status: ORDER_STATUS.PENDING_PAYMENT,
    paymentStatus: PAYMENT_STATUS.PENDING,
    deliveryAddress: input.deliveryAddress,
    expectedDeliveryAt: input.expectedDeliveryAt,
    timeline: [
      { status: ORDER_STATUS.DRAFT, at: now },
      { status: ORDER_STATUS.PENDING_PAYMENT, at: now },
    ],
  };
  await orderService.create(order);

  // First payment instalment
  const firstFraction = input.paymentTerm === PAYMENT_TERM.SPLIT_30_70 ? 0.3 : 1;
  const portion =
    input.paymentTerm === PAYMENT_TERM.SPLIT_30_70
      ? '30% initial'
      : input.paymentTerm === PAYMENT_TERM.AGAINST_DELIVERY
        ? 'Full (on delivery)'
        : 'Full';
  const firstPayment: Payment = {
    id: uid('pay'),
    orderId: order.id,
    orderNumber: order.number,
    merchantId: input.merchantId,
    amount: round2(order.total * firstFraction),
    currency: order.currency,
    method: 'bank_transfer',
    term: input.paymentTerm,
    portion,
    status: PAYMENT_STATUS.PENDING,
    createdAt: now,
  };
  await paymentService.create(firstPayment);

  // Documents
  const split = input.paymentTerm === PAYMENT_TERM.SPLIT_30_70;
  const docs: FleaseaDocument[] = [
    { id: `${order.id}-conf`, orderId: order.id, orderNumber: order.number, type: 'order_confirmation', title: 'Order confirmation', issuedAt: now, locked: false },
    { id: `${order.id}-inv`, orderId: order.id, orderNumber: order.number, type: 'invoice', title: 'Commercial invoice', issuedAt: now, locked: false },
    {
      id: `${order.id}-ship`, orderId: order.id, orderNumber: order.number, type: 'shipment_document',
      title: 'Shipment document (B/L)', issuedAt: now, locked: split,
      lockReason: split ? LOCK_MESSAGE : undefined,
    },
  ];
  await documentService.add(docs);

  notificationService.push('merchant', 'order_submitted', 'Order submitted', `Order ${order.number} has been submitted and is awaiting payment.`);
  notificationService.push('admin', 'order', 'New order', `New order ${order.number} from a wholesale merchant.`);

  return order;
}

export type PaymentOutcome = 'success' | 'pending' | 'failed';

/** Simulate a payment attempt and advance the order/payment/document workflow. */
export async function recordPayment(
  paymentId: string,
  method: Payment['method'],
  outcome: PaymentOutcome,
): Promise<void> {
  const payments = await paymentService.list();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return;

  const status =
    outcome === 'success'
      ? PAYMENT_STATUS.PAID
      : outcome === 'pending'
        ? PAYMENT_STATUS.PROCESSING
        : PAYMENT_STATUS.FAILED;

  await paymentService.update(paymentId, { status, method });

  if (outcome !== 'success') {
    if (outcome === 'failed') {
      notificationService.push('merchant', 'payment_pending', 'Payment failed', `Payment for ${payment.orderNumber} could not be completed. Please try again.`);
    }
    return;
  }

  const order = await orderService.get(payment.orderId);
  if (!order) return;

  notificationService.push('merchant', 'payment_received', 'Payment received', `Payment received for ${order.number} — ${order.currency} ${payment.amount.toLocaleString()}.`);
  await documentService.add([
    { id: `${order.id}-rcpt-${paymentId}`, orderId: order.id, orderNumber: order.number, type: 'payment_receipt', title: `Payment receipt — ${payment.portion}`, issuedAt: new Date().toISOString(), locked: false },
  ]);

  if (payment.term === PAYMENT_TERM.SPLIT_30_70) {
    if (payment.portion.startsWith('30%')) {
      await orderService.setStatus(order.id, {
        status: ORDER_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.PROCESSING,
        note: '30% initial payment received.',
      });
      const balance: Payment = {
        id: uid('pay'),
        orderId: order.id,
        orderNumber: order.number,
        merchantId: order.merchantId,
        amount: round2(order.total * 0.7),
        currency: order.currency,
        method,
        term: payment.term,
        portion: '70% balance',
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      };
      await paymentService.create(balance);
    } else {
      // 70% balance settled -> unlock shipment documents
      await orderService.setStatus(order.id, {
        paymentStatus: PAYMENT_STATUS.PAID,
        note: '70% balance received — shipment documents released.',
      });
      await documentService.unlockShipmentDocsForOrder(order.id);
      notificationService.push('merchant', 'document_unlocked', 'Document unlocked', `Shipment document for ${order.number} is now available.`);
    }
  } else if (payment.term === PAYMENT_TERM.FULL) {
    await orderService.setStatus(order.id, {
      status: ORDER_STATUS.PROCESSING,
      paymentStatus: PAYMENT_STATUS.PAID,
      note: 'Full payment received. Order confirmed and processing.',
    });
  } else {
    // against delivery
    await orderService.setStatus(order.id, {
      paymentStatus: PAYMENT_STATUS.PAID,
      note: 'Payment received on delivery.',
    });
  }
}
