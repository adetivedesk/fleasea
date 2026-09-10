/**
 * currencyService (spec §48, §76).
 * Swap the body of these functions for real API calls in V2 — signatures stay.
 */
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_CURRENCIES } from '@/data/currencies';
import { readCollection, writeCollection, delay } from './mock/db';
import type { Currency, CurrencyCode } from '@/types';

const KEY = STORAGE_KEYS.CURRENCY + '.list';

export const currencyService = {
  list(): Promise<Currency[]> {
    return delay(readCollection<Currency>(KEY, () => DEFAULT_CURRENCIES));
  },
  updateRate(code: CurrencyCode, rateFromSar: number): Promise<Currency[]> {
    const rows = readCollection<Currency>(KEY, () => DEFAULT_CURRENCIES).map((c) =>
      c.code === code ? { ...c, rateFromSar, updatedAt: new Date().toISOString() } : c,
    );
    return delay(writeCollection(KEY, rows));
  },
  setActive(code: CurrencyCode, active: boolean): Promise<Currency[]> {
    const rows = readCollection<Currency>(KEY, () => DEFAULT_CURRENCIES).map((c) =>
      c.code === code ? { ...c, active } : c,
    );
    return delay(writeCollection(KEY, rows));
  },
  add(currency: Currency): Promise<Currency[]> {
    const rows = readCollection<Currency>(KEY, () => DEFAULT_CURRENCIES);
    if (rows.some((c) => c.code === currency.code)) return delay(rows);
    return delay(writeCollection(KEY, [...rows, currency]));
  },
};
