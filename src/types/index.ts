/**
 * Shared domain types (spec §49).
 * These describe the shape the future backend must return — keep them API-friendly.
 */
import type {
  OrderStatus,
  MerchantStatus,
  NegotiationStatus,
  PaymentStatus,
  ShipmentStatus,
  PaymentTerm,
  StockStatus,
  ProductCategory,
} from '@/constants/status';

export type Locale = 'en' | 'ar';
export type CurrencyCode = 'SAR' | 'USD' | 'EUR' | 'AED' | 'GBP';
export type QuantityUnit = 'KG' | 'TON';
export type DemoRole = 'visitor' | 'pending' | 'merchant' | 'admin';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** Value of 1 SAR in this currency. SAR is the base. */
  rateFromSar: number;
  active: boolean;
  updatedAt: string;
}

export interface Address {
  country: string;
  city: string;
  line1: string;
  line2?: string;
}

export interface Category {
  id: ProductCategory;
  nameEn: string;
  nameAr: string;
}

export interface PricePoint {
  date: string;
  price: number;
  currency: CurrencyCode;
  changePct: number;
  updatedBy: string;
}

export interface Product {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  category: ProductCategory;
  origin: string;
  grade: string;
  size: string;
  weightRange: string;
  packaging: string;
  descriptionEn: string;
  descriptionAr: string;
  images: string[];
  availableKg: number;
  reservedKg: number;
  moqKg: number;
  basePrice: number;
  baseCurrency: CurrencyCode;
  priceEffectiveAt: string;
  publicVisible: boolean;
  active: boolean;
  stockStatus: StockStatus;
  priceHistory: PricePoint[];
}

export interface MerchantContact {
  fullName: string;
  position: string;
  email: string;
  mobile: string;
  whatsapp?: string;
}

export interface MerchantDocumentMeta {
  type: 'commercial_registration' | 'tax_certificate' | 'business_license' | 'other';
  fileName: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface Merchant {
  id: string;
  companyName: string;
  companyNameAr: string;
  businessType: string;
  crNumber: string;
  vatNumber: string;
  address: Address;
  contact: MerchantContact;
  businessActivity: string;
  estimatedMonthlyVolumeKg: number;
  preferredCategories: ProductCategory[];
  preferredCurrency: CurrencyCode;
  documents: MerchantDocumentMeta[];
  status: MerchantStatus;
  registeredAt: string;
  internalNotes: MerchantNote[];
}

export interface MerchantNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantityKg: number;
  /** Unit the merchant typed in — for display only; math uses quantityKg. */
  displayUnit: QuantityUnit;
  /** Price locked from an accepted negotiation, if any. */
  negotiatedPrice?: number;
}

export interface OrderItem {
  productId: string;
  productNameEn: string;
  quantityKg: number;
  pricePerKg: number;
  currency: CurrencyCode;
  subtotal: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface Order {
  id: string;
  number: string;
  merchantId: string;
  createdAt: string;
  items: OrderItem[];
  currency: CurrencyCode;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentTerm: PaymentTerm;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shipmentStatus?: ShipmentStatus;
  deliveryAddress: Address;
  expectedDeliveryAt: string;
  timeline: OrderTimelineEntry[];
}

export interface NegotiationMessage {
  id: string;
  author: 'merchant' | 'admin';
  proposedPrice?: number;
  message: string;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  number: string;
  merchantId: string;
  productId: string;
  quantityKg: number;
  currentPrice: number;
  proposedPrice: number;
  currency: CurrencyCode;
  desiredDeliveryDate: string;
  status: NegotiationStatus;
  createdAt: string;
  messages: NegotiationMessage[];
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  merchantId: string;
  amount: number;
  currency: CurrencyCode;
  method: 'bank_transfer' | 'card' | 'online' | 'other';
  term: PaymentTerm;
  /** e.g. "30% initial", "70% balance", "Full". */
  portion: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface Shipment {
  id: string;
  number: string;
  orderId: string;
  orderNumber: string;
  merchantId: string;
  destination: string;
  carrier: string;
  vehicle: string;
  driver: string;
  dispatchedAt: string;
  etaAt: string;
  status: ShipmentStatus;
  dispatchedKg: number;
  deliveredKg?: number;
  deliveredAt?: string;
  proofOfDelivery?: string;
  notes?: string;
}

export interface FleaseaDocument {
  id: string;
  orderId: string;
  orderNumber: string;
  type:
    | 'order_confirmation'
    | 'invoice'
    | 'shipment_document'
    | 'delivery_note'
    | 'proof_of_delivery'
    | 'payment_receipt';
  title: string;
  issuedAt: string;
  locked: boolean;
  lockReason?: string;
}

export interface Notification {
  id: string;
  audience: DemoRole | 'all';
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  quantityKg: number;
  direction: 'increase' | 'decrease';
  reason: string;
  at: string;
  by: string;
}
