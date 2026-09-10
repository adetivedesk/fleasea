import { KG_PER_TON } from '@/constants';
import type { QuantityUnit } from '@/types';

export const toKg = (value: number, unit: QuantityUnit): number =>
  unit === 'TON' ? value * KG_PER_TON : value;

export const fromKg = (kg: number, unit: QuantityUnit): number =>
  unit === 'TON' ? kg / KG_PER_TON : kg;

const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** "2,000 KG" */
export const formatKg = (kg: number): string => `${nf.format(kg)} KG`;

/** "8.5 TON" */
export const formatTon = (kg: number): string => `${nf.format(kg / KG_PER_TON)} TON`;

/** "5.5 TON (5,500 KG)" — the dual display required by spec §65. */
export const formatDualQuantity = (kg: number): string => {
  if (kg >= KG_PER_TON) return `${formatTon(kg)} (${formatKg(kg)})`;
  return formatKg(kg);
};
