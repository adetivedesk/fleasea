import type { Currency, CurrencyCode } from '@/types';

/**
 * Convert a price expressed in `from` currency into `to` currency.
 * Base rates are stored as "value of 1 SAR in X" (spec §9 — base price never mutates).
 */
export const convertPrice = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  currencies: Currency[],
): number => {
  if (from === to) return amount;
  const fromC = currencies.find((c) => c.code === from);
  const toC = currencies.find((c) => c.code === to);
  if (!fromC || !toC) return amount;
  const inSar = amount / fromC.rateFromSar;
  return inSar * toC.rateFromSar;
};

export const currencySymbol = (code: CurrencyCode, currencies: Currency[]): string =>
  currencies.find((c) => c.code === code)?.symbol ?? code;

/** "SAR 28.00 / KG" — always with unit (spec §55, §64). */
export const formatMoney = (
  amount: number,
  code: CurrencyCode,
  opts: { unit?: string; decimals?: number } = {},
): string => {
  const { unit, decimals = 2 } = opts;
  const n = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return unit ? `${code} ${n} / ${unit}` : `${code} ${n}`;
};
