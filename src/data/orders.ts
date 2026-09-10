import { ORDER_STATUS, ORDER_TIMELINE, PAYMENT_STATUS, PAYMENT_TERM, SHIPMENT_STATUS } from '@/constants';
import { MOCK_SETTINGS } from './settings';
import type { Order, OrderItem } from '@/types';
import type { OrderStatus, PaymentStatus, PaymentTerm, ShipmentStatus } from '@/constants/status';

const round2 = (n: number) => Math.round(n * 100) / 100;

interface Cfg {
  number: string;
  merchantId: string;
  createdAt: string;
  items: Array<{ productId: string; name: string; qtyKg: number; priceKg: number }>;
  paymentTerm: PaymentTerm;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shipmentStatus?: ShipmentStatus;
  city: string;
  expectedDeliveryAt: string;
}

function build(c: Cfg): Order {
  const items: OrderItem[] = c.items.map((i) => ({
    productId: i.productId,
    productNameEn: i.name,
    quantityKg: i.qtyKg,
    pricePerKg: i.priceKg,
    currency: 'SAR',
    subtotal: round2(i.qtyKg * i.priceKg),
  }));
  const subtotal = round2(items.reduce((s, i) => s + i.subtotal, 0));
  const deliveryFee = MOCK_SETTINGS.deliveryFeeSar;
  const tax = round2(subtotal * MOCK_SETTINGS.taxRate);
  const total = round2(subtotal + deliveryFee + tax);

  const reached = ORDER_TIMELINE.slice(0, ORDER_TIMELINE.indexOf(c.status) + 1);
  const start = new Date(c.createdAt).getTime();
  const timeline = reached.map((status, idx) => ({
    status,
    at: new Date(start + idx * 20 * 3600 * 1000).toISOString(),
  }));
  if (c.status === ORDER_STATUS.CANCELLED) {
    timeline.push({ status: ORDER_STATUS.CANCELLED, at: new Date(start + 24 * 3600 * 1000).toISOString() });
  }

  return {
    id: c.number.toLowerCase(),
    number: c.number,
    merchantId: c.merchantId,
    createdAt: c.createdAt,
    items,
    currency: 'SAR',
    subtotal,
    deliveryFee,
    tax,
    total,
    paymentTerm: c.paymentTerm,
    status: c.status,
    paymentStatus: c.paymentStatus,
    shipmentStatus: c.shipmentStatus,
    deliveryAddress: { country: 'Saudi Arabia', city: c.city, line1: 'Cold store receiving dock' },
    expectedDeliveryAt: c.expectedDeliveryAt,
    timeline,
  };
}

export const DEFAULT_ORDERS: Order[] = [
  build({
    number: 'FL-20260902-00118', merchantId: 'm-gulf-seafood', createdAt: '2026-09-02T08:15:00Z',
    items: [{ productId: 'p-hamour', name: 'Fresh Hamour (Grouper)', qtyKg: 2000, priceKg: 27 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.DELIVERED,
    paymentStatus: PAYMENT_STATUS.PAID, shipmentStatus: SHIPMENT_STATUS.DELIVERED,
    city: 'Dammam', expectedDeliveryAt: '2026-09-06T00:00:00Z',
  }),
  build({
    number: 'FL-20260904-00120', merchantId: 'm-gulf-seafood', createdAt: '2026-09-04T10:00:00Z',
    items: [
      { productId: 'p-shrimp', name: 'Frozen Shrimp 40/60', qtyKg: 3000, priceKg: 40 },
      { productId: 'p-squid', name: 'Frozen Squid Tubes', qtyKg: 1000, priceKg: 21 },
    ],
    paymentTerm: PAYMENT_TERM.FULL, status: ORDER_STATUS.SHIPPED,
    paymentStatus: PAYMENT_STATUS.PAID, shipmentStatus: SHIPMENT_STATUS.IN_TRANSIT,
    city: 'Dammam', expectedDeliveryAt: '2026-09-12T00:00:00Z',
  }),
  build({
    number: 'FL-20260907-00122', merchantId: 'm-gulf-seafood', createdAt: '2026-09-07T09:30:00Z',
    items: [{ productId: 'p-kingfish', name: 'Kingfish (Kanad)', qtyKg: 1500, priceKg: 33.5 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.PROCESSING,
    paymentStatus: PAYMENT_STATUS.PROCESSING, city: 'Dammam',
    expectedDeliveryAt: '2026-09-15T00:00:00Z',
  }),
  build({
    number: 'FL-20260909-00124', merchantId: 'm-gulf-seafood', createdAt: '2026-09-09T13:00:00Z',
    items: [{ productId: 'p-seabream', name: 'Sea Bream (Sultan Ibrahim)', qtyKg: 1200, priceKg: 22 }],
    paymentTerm: PAYMENT_TERM.AGAINST_DELIVERY, status: ORDER_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PENDING, city: 'Dammam',
    expectedDeliveryAt: '2026-09-16T00:00:00Z',
  }),
  build({
    number: 'FL-20260910-00125', merchantId: 'm-gulf-seafood', createdAt: '2026-09-10T07:45:00Z',
    items: [{ productId: 'p-salmon', name: 'Frozen Atlantic Salmon Fillet', qtyKg: 2000, priceKg: 54 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.PENDING_PAYMENT,
    paymentStatus: PAYMENT_STATUS.PENDING, city: 'Dammam',
    expectedDeliveryAt: '2026-09-20T00:00:00Z',
  }),
  build({
    number: 'FL-20260828-00110', merchantId: 'm-oman-fresh', createdAt: '2026-08-28T08:00:00Z',
    items: [{ productId: 'p-hamour', name: 'Fresh Hamour (Grouper)', qtyKg: 4000, priceKg: 27.5 }],
    paymentTerm: PAYMENT_TERM.FULL, status: ORDER_STATUS.DELIVERED,
    paymentStatus: PAYMENT_STATUS.PAID, shipmentStatus: SHIPMENT_STATUS.DELIVERED,
    city: 'Riyadh', expectedDeliveryAt: '2026-09-01T00:00:00Z',
  }),
  build({
    number: 'FL-20260903-00119', merchantId: 'm-emirates-marine', createdAt: '2026-09-03T11:00:00Z',
    items: [{ productId: 'p-tuna-loin', name: 'Yellowfin Tuna Loin', qtyKg: 800, priceKg: 58 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.DELIVERED,
    paymentStatus: PAYMENT_STATUS.PAID, shipmentStatus: SHIPMENT_STATUS.DELIVERED,
    city: 'Jeddah', expectedDeliveryAt: '2026-09-08T00:00:00Z',
  }),
  build({
    number: 'FL-20260905-00121', merchantId: 'm-coastal-catering', createdAt: '2026-09-05T09:00:00Z',
    items: [{ productId: 'p-pangasius', name: 'Frozen Pangasius Fillet', qtyKg: 6000, priceKg: 15 }],
    paymentTerm: PAYMENT_TERM.FULL, status: ORDER_STATUS.SHIPPED,
    paymentStatus: PAYMENT_STATUS.PAID, shipmentStatus: SHIPMENT_STATUS.DISPATCHED,
    city: 'Yanbu', expectedDeliveryAt: '2026-09-13T00:00:00Z',
  }),
  build({
    number: 'FL-20260908-00123', merchantId: 'm-emirates-marine', createdAt: '2026-09-08T10:30:00Z',
    items: [{ productId: 'p-grouper-frozen', name: 'Frozen Grouper Fillet', qtyKg: 1500, priceKg: 46 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.PROCESSING,
    paymentStatus: PAYMENT_STATUS.PROCESSING, city: 'Jeddah',
    expectedDeliveryAt: '2026-09-17T00:00:00Z',
  }),
  build({
    number: 'FL-20260906-00117', merchantId: 'm-coastal-catering', createdAt: '2026-08-30T09:00:00Z',
    items: [{ productId: 'p-sardine', name: 'Sardine (Oil Fish)', qtyKg: 5000, priceKg: 7.5 }],
    paymentTerm: PAYMENT_TERM.FULL, status: ORDER_STATUS.CANCELLED,
    paymentStatus: PAYMENT_STATUS.REFUNDED, city: 'Yanbu',
    expectedDeliveryAt: '2026-09-04T00:00:00Z',
  }),
  build({
    number: 'FL-20260901-00115', merchantId: 'm-oman-fresh', createdAt: '2026-09-01T08:00:00Z',
    items: [{ productId: 'p-kingfish', name: 'Kingfish (Kanad)', qtyKg: 2500, priceKg: 34 }],
    paymentTerm: PAYMENT_TERM.SPLIT_30_70, status: ORDER_STATUS.SHIPPED,
    paymentStatus: PAYMENT_STATUS.PENDING, shipmentStatus: SHIPMENT_STATUS.AT_DESTINATION,
    city: 'Riyadh', expectedDeliveryAt: '2026-09-11T00:00:00Z',
  }),
  build({
    number: 'FL-20260910-00126', merchantId: 'm-emirates-marine', createdAt: '2026-09-10T06:20:00Z',
    items: [{ productId: 'p-shrimp', name: 'Frozen Shrimp 40/60', qtyKg: 2000, priceKg: 41 }],
    paymentTerm: PAYMENT_TERM.AGAINST_DELIVERY, status: ORDER_STATUS.PENDING_PAYMENT,
    paymentStatus: PAYMENT_STATUS.PENDING, city: 'Jeddah',
    expectedDeliveryAt: '2026-09-21T00:00:00Z',
  }),
];
