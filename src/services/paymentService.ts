/** paymentService (spec §48, §76). */
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_PAYMENTS } from '@/data/payments';
import { readCollection, writeCollection, delay } from './mock/db';
import type { Payment } from '@/types';
import type { PaymentStatus } from '@/constants/status';

const KEY = STORAGE_KEYS.PAYMENTS;
const all = () => readCollection<Payment>(KEY, () => DEFAULT_PAYMENTS);

export const paymentService = {
  list(): Promise<Payment[]> {
    return delay([...all()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
  listForMerchant(merchantId: string): Promise<Payment[]> {
    return delay(all().filter((p) => p.merchantId === merchantId));
  },
  listForOrder(orderId: string): Promise<Payment[]> {
    return delay(all().filter((p) => p.orderId === orderId));
  },
  create(payment: Payment): Promise<Payment> {
    const rows = all();
    rows.unshift(payment);
    writeCollection(KEY, rows);
    return delay(payment);
  },
  setStatus(id: string, status: PaymentStatus): Promise<Payment[]> {
    const rows = all().map((p) => (p.id === id ? { ...p, status } : p));
    return delay(writeCollection(KEY, rows));
  },
  update(id: string, patch: Partial<Payment>): Promise<Payment[]> {
    const rows = all().map((p) => (p.id === id ? { ...p, ...patch } : p));
    return delay(writeCollection(KEY, rows));
  },
};
