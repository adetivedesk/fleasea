/** merchantService (spec §48, §76) — mock now, swap body for API later. */
import { MERCHANT_STATUS, STORAGE_KEYS } from '@/constants';
import { DEFAULT_MERCHANTS } from '@/data/merchants';
import { readCollection, writeCollection, delay } from './mock/db';
import { uid } from '@/utils/id';
import type { Merchant, MerchantNote } from '@/types';
import type { MerchantStatus } from '@/constants/status';

const KEY = STORAGE_KEYS.MERCHANTS;
const all = () => readCollection<Merchant>(KEY, () => DEFAULT_MERCHANTS);

export type ApplicationInput = Omit<
  Merchant,
  'id' | 'status' | 'registeredAt' | 'internalNotes'
>;

export const merchantService = {
  list(): Promise<Merchant[]> {
    return delay(all());
  },
  get(id: string): Promise<Merchant | undefined> {
    return delay(all().find((m) => m.id === id));
  },
  getByEmail(email: string): Promise<Merchant | undefined> {
    return delay(all().find((m) => m.contact.email.toLowerCase() === email.toLowerCase()));
  },
  submitApplication(input: ApplicationInput): Promise<Merchant> {
    const merchant: Merchant = {
      ...input,
      id: uid('m'),
      status: MERCHANT_STATUS.PENDING,
      registeredAt: new Date().toISOString(),
      internalNotes: [],
    };
    const rows = all();
    rows.unshift(merchant);
    writeCollection(KEY, rows);
    return delay(merchant);
  },
  update(id: string, patch: Partial<Merchant>): Promise<Merchant> {
    const rows = all().map((m) => (m.id === id ? { ...m, ...patch } : m));
    writeCollection(KEY, rows);
    return delay(rows.find((m) => m.id === id)!);
  },
  setStatus(id: string, status: MerchantStatus): Promise<Merchant[]> {
    const rows = all().map((m) => (m.id === id ? { ...m, status } : m));
    return delay(writeCollection(KEY, rows));
  },
  addNote(id: string, author: string, text: string): Promise<Merchant[]> {
    const note: MerchantNote = { id: uid('n'), author, text, createdAt: new Date().toISOString() };
    const rows = all().map((m) =>
      m.id === id ? { ...m, internalNotes: [...m.internalNotes, note] } : m,
    );
    return delay(writeCollection(KEY, rows));
  },
};
