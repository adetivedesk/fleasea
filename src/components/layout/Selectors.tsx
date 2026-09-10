import { Globe, Wallet } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import type { CurrencyCode, Locale } from '@/types';
import { cn } from '@/utils/cn';

const baseCls =
  'inline-flex items-center gap-1.5 rounded-lg border border-ink-300 bg-white px-2.5 h-9 text-sm text-ink-700 focus-ring';

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale } = useApp();
  return (
    <div className={cn('relative', className)}>
      <Globe className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={cn(baseCls, 'appearance-none ps-8 pe-2')}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}

const CURRENCIES: CurrencyCode[] = ['SAR', 'USD', 'EUR', 'AED', 'GBP'];

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency, currencies } = useApp();
  const active = currencies.filter((c) => c.active).map((c) => c.code);
  const list = CURRENCIES.filter((c) => active.includes(c));
  return (
    <div className={cn('relative', className)}>
      <Wallet className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <select
        aria-label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className={cn(baseCls, 'appearance-none ps-8 pe-2')}
      >
        {list.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
