/** documentService (spec §28, §48). */
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_DOCUMENTS } from '@/data/documents';
import { readCollection, writeCollection, delay } from './mock/db';
import type { FleaseaDocument } from '@/types';

const KEY = STORAGE_KEYS.DOCUMENTS;
const all = () => readCollection<FleaseaDocument>(KEY, () => DEFAULT_DOCUMENTS);

export const documentService = {
  list(): Promise<FleaseaDocument[]> {
    return delay(all());
  },
  listForOrder(orderId: string): Promise<FleaseaDocument[]> {
    return delay(all().filter((d) => d.orderId === orderId));
  },
  listForOrders(orderIds: string[]): Promise<FleaseaDocument[]> {
    return delay(all().filter((d) => orderIds.includes(d.orderId)));
  },
  add(docs: FleaseaDocument[]): Promise<FleaseaDocument[]> {
    const rows = all();
    for (const d of docs) if (!rows.some((r) => r.id === d.id)) rows.push(d);
    return delay(writeCollection(KEY, rows));
  },
  setLocked(id: string, locked: boolean, lockReason?: string): Promise<FleaseaDocument[]> {
    const rows = all().map((d) => (d.id === id ? { ...d, locked, lockReason: locked ? lockReason : undefined } : d));
    return delay(writeCollection(KEY, rows));
  },
  /** Unlock every shipment document tied to an order (after 70% payment). */
  unlockShipmentDocsForOrder(orderId: string): Promise<FleaseaDocument[]> {
    const rows = all().map((d) =>
      d.orderId === orderId && d.type === 'shipment_document'
        ? { ...d, locked: false, lockReason: undefined }
        : d,
    );
    return delay(writeCollection(KEY, rows));
  },
};
