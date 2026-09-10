/** productService (spec §30–§34, §48, §76) — mock now, swap body for API later. */
import { STORAGE_KEYS, MAX_PUBLIC_PRODUCTS, STOCK_STATUS } from '@/constants';
import { DEFAULT_PRODUCTS } from '@/data/products';
import { readCollection, writeCollection, delay } from './mock/db';
import { uid } from '@/utils/id';
import { notificationService } from './notificationService';
import type { Product } from '@/types';

const KEY = STORAGE_KEYS.PRODUCTS;
const all = () => readCollection<Product>(KEY, () => DEFAULT_PRODUCTS);

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeStockStatus(p: Pick<Product, 'availableKg' | 'reservedKg' | 'moqKg'>): Product['stockStatus'] {
  const free = p.availableKg - p.reservedKg;
  if (free <= 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (free < p.moqKg * 2) return STOCK_STATUS.CRITICAL;
  if (free < p.moqKg * 6) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
}

const persist = (rows: Product[]) => writeCollection(KEY, rows.map((p) => ({ ...p, stockStatus: computeStockStatus(p) })));

export const productService = {
  list: (): Promise<Product[]> => delay(all().filter((p) => p.active)),
  listAll: (): Promise<Product[]> => delay(all()),
  get: (id: string): Promise<Product | undefined> => delay(all().find((p) => p.id === id)),

  publicList: (): Promise<Product[]> =>
    delay(all().filter((p) => p.active && p.publicVisible).slice(0, MAX_PUBLIC_PRODUCTS)),

  publicCount: (): number => all().filter((p) => p.publicVisible).length,

  save: (next: Product): Promise<Product[]> => {
    const rows = all();
    const i = rows.findIndex((p) => p.id === next.id);
    if (i >= 0) rows[i] = next;
    else rows.push(next);
    return delay(persist(rows));
  },

  create: (draft: Omit<Product, 'id' | 'stockStatus' | 'priceHistory'>): Promise<Product> => {
    const product: Product = {
      ...draft,
      id: uid('p'),
      stockStatus: computeStockStatus(draft),
      priceHistory: [
        {
          date: new Date().toISOString(),
          price: draft.basePrice,
          currency: draft.baseCurrency,
          changePct: 0,
          updatedBy: 'Admin',
        },
      ],
    };
    const rows = all();
    rows.push(product);
    persist(rows);
    return delay(product);
  },

  duplicate: (id: string): Promise<Product[]> => {
    const rows = all();
    const src = rows.find((p) => p.id === id);
    if (src) {
      rows.push({
        ...src,
        id: uid('p'),
        code: `${src.code}-COPY`,
        nameEn: `${src.nameEn} (copy)`,
        publicVisible: false,
        priceHistory: src.priceHistory.slice(0, 1),
      });
    }
    return delay(persist(rows));
  },

  setActive: (id: string, active: boolean): Promise<Product[]> =>
    delay(persist(all().map((p) => (p.id === id ? { ...p, active, publicVisible: active && p.publicVisible } : p)))),

  /** Toggle public visibility, enforcing the hard cap of 5 (spec §31). */
  setPublicVisible: (id: string, publicVisible: boolean): { ok: boolean; error?: string; rows?: Promise<Product[]> } => {
    const rows = all();
    if (publicVisible && rows.filter((p) => p.publicVisible && p.id !== id).length >= MAX_PUBLIC_PRODUCTS) {
      return {
        ok: false,
        error: `Public preview is limited to ${MAX_PUBLIC_PRODUCTS} products. Remove another product from public preview first.`,
      };
    }
    return { ok: true, rows: delay(persist(rows.map((p) => (p.id === id ? { ...p, publicVisible } : p)))) };
  },

  /** Publish a new market price (spec §32, §67). Appends to price history. */
  updatePrice: (id: string, newPrice: number, updatedBy = 'Admin — Sales'): Promise<Product[]> => {
    const now = new Date().toISOString();
    const rows = all().map((p) => {
      if (p.id !== id) return p;
      const changePct = p.basePrice === 0 ? 0 : round2(((newPrice - p.basePrice) / p.basePrice) * 100);
      return {
        ...p,
        basePrice: newPrice,
        priceEffectiveAt: now,
        priceHistory: [
          { date: now, price: newPrice, currency: p.baseCurrency, changePct, updatedBy },
          ...p.priceHistory,
        ],
      };
    });
    notificationService.push('merchant', 'price_change', 'Price updated', `Price updated: see today's market prices.`);
    return delay(persist(rows));
  },

  /** Adjust available inventory (spec §34). */
  adjustInventory: (
    id: string,
    quantityKg: number,
    direction: 'increase' | 'decrease',
  ): Promise<Product[]> => {
    const rows = all().map((p) => {
      if (p.id !== id) return p;
      const delta = direction === 'increase' ? quantityKg : -quantityKg;
      return { ...p, availableKg: Math.max(0, p.availableKg + delta) };
    });
    return delay(persist(rows));
  },
};
