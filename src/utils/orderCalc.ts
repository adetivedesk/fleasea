/** Reusable order maths (spec §57) — never inline these in JSX. */
import { MOCK_SETTINGS } from '@/data/settings';
import { convertPrice } from '@/utils/currency';
import type { CartItem, Currency, CurrencyCode, Product } from '@/types';

export interface CartLine {
  product: Product;
  quantityKg: number;
  /** price per KG in the given display currency */
  pricePerKg: number;
  subtotal: number;
}

export interface CartTotals {
  lines: CartLine[];
  currency: CurrencyCode;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  totalKg: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function priceForItem(
  item: CartItem,
  product: Product,
  currency: CurrencyCode,
  currencies: Currency[],
): number {
  const base = item.negotiatedPrice ?? product.basePrice;
  return round2(convertPrice(base, product.baseCurrency, currency, currencies));
}

export function buildCartTotals(
  items: CartItem[],
  products: Product[],
  currency: CurrencyCode,
  currencies: Currency[],
): CartTotals {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const pricePerKg = priceForItem(item, product, currency, currencies);
    lines.push({
      product,
      quantityKg: item.quantityKg,
      pricePerKg,
      subtotal: round2(pricePerKg * item.quantityKg),
    });
  }

  const subtotal = round2(lines.reduce((s, l) => s + l.subtotal, 0));
  const deliveryFee =
    lines.length === 0
      ? 0
      : round2(convertPrice(MOCK_SETTINGS.deliveryFeeSar, 'SAR', currency, currencies));
  const tax = round2(subtotal * MOCK_SETTINGS.taxRate);
  const total = round2(subtotal + deliveryFee + tax);
  const totalKg = lines.reduce((s, l) => s + l.quantityKg, 0);

  return { lines, currency, subtotal, deliveryFee, tax, total, totalKg };
}
