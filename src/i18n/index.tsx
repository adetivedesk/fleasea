import { createContext, useCallback, useContext } from 'react';
import type { Locale } from '@/types';
import { dictionaries, type TranslationKey } from './translations';

interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback<I18nValue['t']>(
    (key, vars) => {
      const dict = dictionaries[locale] as Record<string, string>;
      let str = dict[key] ?? dictionaries.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.split('{' + k + '}').join(String(v));
        }
      }
      return str;
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, dir, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
