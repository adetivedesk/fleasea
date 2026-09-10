import { PAYMENT_TERM, STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage';
import type { PaymentTerm } from '@/constants/status';

/** Mock, configurable commercial settings (spec §20, §57). */
export interface FleaseaSettings {
  /** VAT rate applied to the goods subtotal. */
  taxRate: number;
  /** Flat indicative delivery fee, in SAR, per order. */
  deliveryFeeSar: number;
  orderNumberSeqStart: number;
  orderNumberPrefix: string;
  companyName: string;
  supportEmail: string;
}

export const DEFAULT_SETTINGS: FleaseaSettings = {
  taxRate: 0.15,
  deliveryFeeSar: 850,
  orderNumberSeqStart: 126,
  orderNumberPrefix: 'FL',
  companyName: 'Fleasea Trading Co.',
  supportEmail: 'trade@fleasea.demo',
};

const KEY = STORAGE_KEYS.SETTINGS;

export const getSettings = (): FleaseaSettings => ({
  ...DEFAULT_SETTINGS,
  ...storage.get<Partial<FleaseaSettings>>(KEY, {}),
});

export const saveSettings = (patch: Partial<FleaseaSettings>): FleaseaSettings => {
  const next = { ...getSettings(), ...patch };
  storage.set(KEY, next);
  return next;
};

/** Back-compat alias — prefer getSettings(). */
export const MOCK_SETTINGS = DEFAULT_SETTINGS;

export interface PaymentTermDef {
  id: PaymentTerm;
  label: string;
  description: string;
  schedule: Array<{ portion: string; fraction: number; trigger: string }>;
}

export const PAYMENT_TERMS: PaymentTermDef[] = [
  {
    id: PAYMENT_TERM.FULL,
    label: 'Full Payment — 100%',
    description: 'Pay the full amount up front. Order is confirmed once payment clears.',
    schedule: [{ portion: 'Full', fraction: 1, trigger: 'On order' }],
  },
  {
    id: PAYMENT_TERM.SPLIT_30_70,
    label: '30% / 70%',
    description:
      '30% initial payment to confirm; remaining 70% before shipment documents are released.',
    schedule: [
      { portion: '30% initial', fraction: 0.3, trigger: 'On order' },
      { portion: '70% balance', fraction: 0.7, trigger: 'Before document release' },
    ],
  },
  {
    id: PAYMENT_TERM.AGAINST_DELIVERY,
    label: '100% Against Delivery',
    description: 'Pay the full amount once goods are delivered and accepted.',
    schedule: [{ portion: 'Full', fraction: 1, trigger: 'On delivery' }],
  },
];

export const paymentTermLabel = (id: PaymentTerm): string =>
  PAYMENT_TERMS.find((t) => t.id === id)?.label ?? id;

