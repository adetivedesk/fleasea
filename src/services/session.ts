/**
 * PROTOTYPE session helper. Maps the demo role to a concrete merchant record.
 * Replace with a real authenticated session in V2.
 */
import type { DemoRole } from '@/types';

/** The approved demo merchant (matches merchant@fleasea.demo / data/merchants.ts). */
export const CURRENT_MERCHANT_ID = 'm-gulf-seafood';

export const merchantIdForRole = (role: DemoRole): string | undefined =>
  role === 'merchant' ? CURRENT_MERCHANT_ID : undefined;
