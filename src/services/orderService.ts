/** orderService (spec §48, §76). */
import { ORDER_STATUS, PAYMENT_STATUS, STORAGE_KEYS } from '@/constants';
import { DEFAULT_ORDERS } from '@/data/orders';
import { readCollection, writeCollection, delay } from './mock/db';
import type { Order } from '@/types';
import type { OrderStatus, PaymentStatus, ShipmentStatus } from '@/constants/status';

const KEY = STORAGE_KEYS.ORDERS;
const all = () => readCollection<Order>(KEY, () => DEFAULT_ORDERS);

export const orderService = {
  list(): Promise<Order[]> {
    return delay([...all()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
  listForMerchant(merchantId: string): Promise<Order[]> {
    return delay(
      all()
        .filter((o) => o.merchantId === merchantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },
  get(id: string): Promise<Order | undefined> {
    return delay(all().find((o) => o.id === id || o.number === id));
  },
  create(order: Order): Promise<Order> {
    const rows = all();
    rows.unshift(order);
    writeCollection(KEY, rows);
    return delay(order);
  },
  update(id: string, patch: Partial<Order>): Promise<Order[]> {
    const rows = all().map((o) => (o.id === id ? { ...o, ...patch } : o));
    return delay(writeCollection(KEY, rows));
  },
  setStatus(
    id: string,
    fields: { status?: OrderStatus; paymentStatus?: PaymentStatus; shipmentStatus?: ShipmentStatus; note?: string },
  ): Promise<Order[]> {
    const rows = all().map((o) => {
      if (o.id !== id) return o;
      const timeline = fields.status
        ? [...o.timeline, { status: fields.status, at: new Date().toISOString(), note: fields.note }]
        : o.timeline;
      return {
        ...o,
        status: fields.status ?? o.status,
        paymentStatus: fields.paymentStatus ?? o.paymentStatus,
        shipmentStatus: fields.shipmentStatus ?? o.shipmentStatus,
        timeline,
      };
    });
    return delay(writeCollection(KEY, rows));
  },
};

export { ORDER_STATUS, PAYMENT_STATUS };
