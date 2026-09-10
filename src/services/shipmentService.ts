/** shipmentService (spec §48, §76). */
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_SHIPMENTS } from '@/data/shipments';
import { readCollection, writeCollection, delay } from './mock/db';
import type { Shipment } from '@/types';

const KEY = STORAGE_KEYS.SHIPMENTS;
const all = () => readCollection<Shipment>(KEY, () => DEFAULT_SHIPMENTS);

export const shipmentService = {
  list(): Promise<Shipment[]> {
    return delay([...all()].sort((a, b) => b.dispatchedAt.localeCompare(a.dispatchedAt)));
  },
  listForMerchant(merchantId: string): Promise<Shipment[]> {
    return delay(all().filter((s) => s.merchantId === merchantId));
  },
  get(id: string): Promise<Shipment | undefined> {
    return delay(all().find((s) => s.id === id || s.number === id));
  },
  create(shipment: Shipment): Promise<Shipment> {
    const rows = all();
    rows.unshift(shipment);
    writeCollection(KEY, rows);
    return delay(shipment);
  },
  update(id: string, patch: Partial<Shipment>): Promise<Shipment[]> {
    const rows = all().map((s) => (s.id === id ? { ...s, ...patch } : s));
    return delay(writeCollection(KEY, rows));
  },
};
