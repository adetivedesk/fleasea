/** negotiationService (spec §48, §76). Product-level negotiation (spec §19). */
import { NEGOTIATION_STATUS, STORAGE_KEYS } from '@/constants';
import { DEFAULT_NEGOTIATIONS } from '@/data/negotiations';
import { readCollection, writeCollection, delay } from './mock/db';
import { uid } from '@/utils/id';
import type { Negotiation, NegotiationMessage } from '@/types';
import type { CurrencyCode } from '@/types';

const KEY = STORAGE_KEYS.NEGOTIATIONS;
const all = () => readCollection<Negotiation>(KEY, () => DEFAULT_NEGOTIATIONS);

export interface NewNegotiation {
  merchantId: string;
  productId: string;
  quantityKg: number;
  currentPrice: number;
  proposedPrice: number;
  currency: CurrencyCode;
  desiredDeliveryDate: string;
  message: string;
}

function nextNumber(rows: Negotiation[]): string {
  const n = rows.length + 1;
  return `NG-2026-${String(n).padStart(4, '0')}`;
}

export const negotiationService = {
  list(): Promise<Negotiation[]> {
    return delay([...all()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
  listForMerchant(merchantId: string): Promise<Negotiation[]> {
    return delay(
      all()
        .filter((n) => n.merchantId === merchantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },
  get(id: string): Promise<Negotiation | undefined> {
    return delay(all().find((n) => n.id === id));
  },
  create(input: NewNegotiation): Promise<Negotiation> {
    const rows = all();
    const negotiation: Negotiation = {
      id: uid('ng'),
      number: nextNumber(rows),
      merchantId: input.merchantId,
      productId: input.productId,
      quantityKg: input.quantityKg,
      currentPrice: input.currentPrice,
      proposedPrice: input.proposedPrice,
      currency: input.currency,
      desiredDeliveryDate: input.desiredDeliveryDate,
      status: NEGOTIATION_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: uid('msg'),
          author: 'merchant',
          proposedPrice: input.proposedPrice,
          message: input.message,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    rows.unshift(negotiation);
    writeCollection(KEY, rows);
    return delay(negotiation);
  },
  /** Append a message and optionally move the status + latest proposed price. */
  respond(
    id: string,
    args: {
      author: 'merchant' | 'admin';
      message: string;
      proposedPrice?: number;
      status?: Negotiation['status'];
    },
  ): Promise<Negotiation[]> {
    const msg: NegotiationMessage = {
      id: uid('msg'),
      author: args.author,
      proposedPrice: args.proposedPrice,
      message: args.message,
      createdAt: new Date().toISOString(),
    };
    const rows = all().map((n) =>
      n.id === id
        ? {
            ...n,
            status: args.status ?? n.status,
            proposedPrice: args.proposedPrice ?? n.proposedPrice,
            messages: [...n.messages, msg],
          }
        : n,
    );
    return delay(writeCollection(KEY, rows));
  },
};

export { NEGOTIATION_STATUS };
