/**
 * Central status definitions (spec §58).
 * Every workflow status in the app must reference these — never inline string literals.
 */

export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const MERCHANT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;
export type MerchantStatus = (typeof MERCHANT_STATUS)[keyof typeof MERCHANT_STATUS];

export const NEGOTIATION_STATUS = {
  PENDING: 'PENDING',
  COUNTER_OFFER: 'COUNTER_OFFER',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
} as const;
export type NegotiationStatus = (typeof NEGOTIATION_STATUS)[keyof typeof NEGOTIATION_STATUS];

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const SHIPMENT_STATUS = {
  PREPARING: 'PREPARING',
  PACKED: 'PACKED',
  DISPATCHED: 'DISPATCHED',
  IN_TRANSIT: 'IN_TRANSIT',
  AT_DESTINATION: 'AT_DESTINATION',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
} as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const PAYMENT_TERM = {
  FULL: 'FULL',
  SPLIT_30_70: 'SPLIT_30_70',
  AGAINST_DELIVERY: 'AGAINST_DELIVERY',
} as const;
export type PaymentTerm = (typeof PAYMENT_TERM)[keyof typeof PAYMENT_TERM];

export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  CRITICAL: 'CRITICAL',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;
export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];

export const PRODUCT_CATEGORY = {
  FRESH_ICE: 'FRESH_ICE',
  LIVE: 'LIVE',
  FROZEN: 'FROZEN',
} as const;
export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];

/** Semantic colour tone used by <StatusBadge>. */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export const STATUS_TONE: Record<string, StatusTone> = {
  // order
  DRAFT: 'neutral',
  PENDING_PAYMENT: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  PACKED: 'info',
  SHIPPED: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  // merchant
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  // negotiation
  COUNTER_OFFER: 'info',
  ACCEPTED: 'success',
  EXPIRED: 'neutral',
  // payment
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'neutral',
  // shipment
  PREPARING: 'neutral',
  DISPATCHED: 'info',
  IN_TRANSIT: 'info',
  AT_DESTINATION: 'info',
  // stock
  IN_STOCK: 'success',
  LOW_STOCK: 'warning',
  CRITICAL: 'danger',
  OUT_OF_STOCK: 'danger',
};

export const ORDER_TIMELINE: OrderStatus[] = [
  ORDER_STATUS.DRAFT,
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const SHIPMENT_TIMELINE: ShipmentStatus[] = [
  SHIPMENT_STATUS.PREPARING,
  SHIPMENT_STATUS.PACKED,
  SHIPMENT_STATUS.DISPATCHED,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.AT_DESTINATION,
  SHIPMENT_STATUS.OUT_FOR_DELIVERY,
  SHIPMENT_STATUS.DELIVERED,
];
