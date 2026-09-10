import { Info } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useI18n } from '@/i18n';
import { formatMoney } from '@/utils/currency';
import type { CurrencyCode } from '@/types';
import { cn } from '@/utils/cn';

interface Props {
  basePrice: number;
  baseCurrency: CurrencyCode;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  showBase?: boolean;
  showDisclaimer?: boolean;
  className?: string;
}

const SIZE: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

/** Spec §55 / §64 — never render a price without its unit. */
export function PriceDisplay({
  basePrice,
  baseCurrency,
  unit = 'KG',
  size = 'md',
  showBase = true,
  showDisclaimer = false,
  className,
}: Props) {
  const { currency, displayPrice } = useApp();
  const { t } = useI18n();

  const converted = displayPrice(basePrice, baseCurrency);
  const isConverted = currency !== baseCurrency;

  return (
    <div className={className}>
      <span className={cn('font-semibold text-ink-900', SIZE[size])}>
        {formatMoney(converted, currency, { unit })}
      </span>
      {isConverted && showBase && (
        <span className="ms-2 text-xs text-ink-400">
          (base {formatMoney(basePrice, baseCurrency, { unit })})
        </span>
      )}
      {isConverted && showDisclaimer && (
        <span className="mt-1 flex items-start gap-1 text-xs text-ink-400">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          {t('currency.disclaimer')}
        </span>
      )}
    </div>
  );
}
