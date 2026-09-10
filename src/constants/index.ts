export * from './status';

/** localStorage keys — single source of truth (spec §53). */
export const STORAGE_KEYS = {
  LANGUAGE: 'fleasea.language',
  CURRENCY: 'fleasea.currency',
  ROLE: 'fleasea.demoRole',
  CART: 'fleasea.cart',
  MERCHANTS: 'fleasea.merchants',
  PRODUCTS: 'fleasea.products',
  PRICES: 'fleasea.priceHistory',
  INVENTORY: 'fleasea.inventory',
  NEGOTIATIONS: 'fleasea.negotiations',
  ORDERS: 'fleasea.orders',
  PAYMENTS: 'fleasea.payments',
  SHIPMENTS: 'fleasea.shipments',
  DOCUMENTS: 'fleasea.documents',
  NOTIFICATIONS: 'fleasea.notifications',
  SETTINGS: 'fleasea.settings',
  USERS: 'fleasea.users',
  ADMIN_ROLE: 'fleasea.adminRole',
  SEED_VERSION: 'fleasea.seedVersion',
} as const;

/** Bump to force a re-seed of demo data on next load. */
export const SEED_VERSION = '1';

export const KG_PER_TON = 1000;

/** Public price visibility is capped (spec §11, §31). */
export const MAX_PUBLIC_PRODUCTS = 5;

export const APP_NAME = 'Fleasea';
export const ORDER_NUMBER_PREFIX = 'FL';

export const DEMO_ACCOUNTS = {
  admin: 'admin@fleasea.demo',
  merchant: 'merchant@fleasea.demo',
  pending: 'pending@fleasea.demo',
} as const;
