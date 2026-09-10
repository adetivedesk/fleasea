/** productService (spec §48, §76) — mock now, swap body for API later. */
import { STORAGE_KEYS, MAX_PUBLIC_PRODUCTS } from '@/constants';
import { DEFAULT_PRODUCTS } from '@/data/products';
import { readCollection, writeCollection, delay } from './mock/db';
import type { Product } from '@/types';

const KEY = STORAGE_KEYS.PRODUCTS;
const all = () => readCollection<Product>(KEY, () => DEFAULT_PRODUCTS);

export const productService = {
  list(): Promise<Product[]> {
    return delay(all().filter((p) => p.active));
  },
  listAll(): Promise<Product[]> {
    return delay(all());
  },
  get(id: string): Promise<Product | undefined> {
    return delay(all().find((p) => p.id === id));
  },
  /** Public catalogue — only admin-flagged products, hard-capped (spec §11, §31). */
  publicList(): Promise<Product[]> {
    return delay(all().filter((p) => p.active && p.publicVisible).slice(0, MAX_PUBLIC_PRODUCTS));
  },
  save(next: Product): Promise<Product[]> {
    const rows = all();
    const i = rows.findIndex((p) => p.id === next.id);
    if (i >= 0) rows[i] = next;
    else rows.push(next);
    return delay(writeCollection(KEY, rows));
  },
};
