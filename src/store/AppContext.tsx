import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_CURRENCIES } from '@/data/currencies';
import { storage } from '@/utils/storage';
import { convertPrice, formatMoney } from '@/utils/currency';
import type { Currency, CurrencyCode, DemoRole, Locale } from '@/types';
import { I18nProvider } from '@/i18n';
import { ToastProvider } from '@/components/ui/Toast';
import { CartProvider } from './CartContext';

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  currencies: Currency[];
  /** Re-read the currency list from storage (after admin edits). */
  reloadCurrencies: () => void;
  demoRole: DemoRole;
  setDemoRole: (r: DemoRole) => void;
  adminRole: string;
  setAdminRole: (r: string) => void;
  /** Convert a SAR-based price into the active display currency. */
  displayPrice: (basePrice: number, baseCurrency: CurrencyCode) => number;
  /** Formatted price string in the active currency, always with unit. */
  formatDisplayPrice: (
    basePrice: number,
    baseCurrency: CurrencyCode,
    unit?: string,
  ) => string;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const VALID_ROLES: DemoRole[] = ['visitor', 'pending', 'merchant', 'admin'];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    storage.get<Locale>(STORAGE_KEYS.LANGUAGE, 'en'),
  );
  const [currency, setCurrencyState] = useState<CurrencyCode>(() =>
    storage.get<CurrencyCode>(STORAGE_KEYS.CURRENCY, 'SAR'),
  );
  const [demoRole, setDemoRoleState] = useState<DemoRole>(() => {
    const r = storage.get<DemoRole>(STORAGE_KEYS.ROLE, 'visitor');
    return VALID_ROLES.includes(r) ? r : 'visitor';
  });
  const [adminRole, setAdminRoleState] = useState<string>(() =>
    storage.get<string>(STORAGE_KEYS.ADMIN_ROLE, 'super'),
  );

  const [currencies, setCurrencies] = useState<Currency[]>(() =>
    storage.get<Currency[]>(STORAGE_KEYS.CURRENCY + '.list', DEFAULT_CURRENCIES),
  );
  const reloadCurrencies = useCallback(() => {
    setCurrencies(storage.get<Currency[]>(STORAGE_KEYS.CURRENCY + '.list', DEFAULT_CURRENCIES));
  }, []);

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    storage.set(STORAGE_KEYS.LANGUAGE, l);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    storage.set(STORAGE_KEYS.CURRENCY, c);
  }, []);

  const setDemoRole = useCallback((r: DemoRole) => {
    setDemoRoleState(r);
    storage.set(STORAGE_KEYS.ROLE, r);
  }, []);

  const setAdminRole = useCallback((r: string) => {
    setAdminRoleState(r);
    storage.set(STORAGE_KEYS.ADMIN_ROLE, r);
  }, []);

  const displayPrice = useCallback(
    (basePrice: number, baseCurrency: CurrencyCode) =>
      convertPrice(basePrice, baseCurrency, currency, currencies),
    [currency, currencies],
  );

  const formatDisplayPrice = useCallback(
    (basePrice: number, baseCurrency: CurrencyCode, unit?: string) =>
      formatMoney(displayPrice(basePrice, baseCurrency), currency, { unit }),
    [displayPrice, currency],
  );

  const resetDemoData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k === STORAGE_KEYS.LANGUAGE || k === STORAGE_KEYS.CURRENCY || k === STORAGE_KEYS.ROLE) {
        return;
      }
      storage.remove(k);
    });
    storage.remove(STORAGE_KEYS.CURRENCY + '.list');
    window.location.reload();
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      setLocale,
      currency,
      setCurrency,
      currencies,
      reloadCurrencies,
      demoRole,
      setDemoRole,
      adminRole,
      setAdminRole,
      displayPrice,
      formatDisplayPrice,
      resetDemoData,
    }),
    [
      locale,
      setLocale,
      currency,
      setCurrency,
      currencies,
      reloadCurrencies,
      demoRole,
      setDemoRole,
      adminRole,
      setAdminRole,
      displayPrice,
      formatDisplayPrice,
      resetDemoData,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <I18nProvider locale={locale}>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </I18nProvider>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
