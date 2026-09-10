import type { Currency } from '@/types';

/** Indicative demo rates — value of 1 SAR in each currency (spec §9, §40). */
export const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rateFromSar: 1, active: true, updatedAt: '2026-09-10T06:00:00Z' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rateFromSar: 0.2666, active: true, updatedAt: '2026-09-10T06:00:00Z' },
  { code: 'EUR', symbol: '€', name: 'Euro', rateFromSar: 0.2453, active: true, updatedAt: '2026-09-10T06:00:00Z' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateFromSar: 0.9793, active: true, updatedAt: '2026-09-10T06:00:00Z' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateFromSar: 0.2098, active: true, updatedAt: '2026-09-10T06:00:00Z' },
];
