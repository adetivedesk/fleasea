import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import type { Product } from '@/types';
import { useI18n } from '@/i18n';
import { categoryName } from '@/data/categories';
import { fishImage } from '@/data/images';
import { formatDualQuantity, formatKg } from '@/utils/quantity';
import { relativeDay } from '@/utils/format';
import { Card, StatusBadge } from '@/components/ui';
import { PriceDisplay } from './PriceDisplay';

interface Props {
  product: Product;
  to?: string;
  /** Hide price + stock for the locked public preview. */
  locked?: boolean;
  footer?: React.ReactNode;
}

export function ProductCard({ product: p, to, locked = false, footer }: Props) {
  const { locale, t } = useI18n();
  const name = locale === 'ar' ? p.nameAr : p.nameEn;
  const freeKg = p.availableKg - p.reservedKg;

  const media = (
    <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
      <img
        src={fishImage(p.images[0])}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute start-2 top-2">
        <StatusBadge status={p.stockStatus} />
      </span>
    </div>
  );

  return (
    <Card className="group flex flex-col overflow-hidden">
      {to ? <Link to={to}>{media}</Link> : media}

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-sea-700">
          {categoryName(p.category, locale)}
        </p>
        <h3 className="mt-1 font-semibold text-ink-900">
          {to ? (
            <Link to={to} className="hover:text-brand-700">
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
          <MapPin className="h-3 w-3" /> {p.origin} · {p.size} · {p.grade}
        </p>

        {locked ? (
          <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
            {t('access.merchantRequired.body')}
          </div>
        ) : (
          <div className="mt-3 space-y-1">
            <PriceDisplay basePrice={p.basePrice} baseCurrency={p.baseCurrency} unit="KG" size="md" />
            <p className="text-xs text-ink-500">
              Available: <span className="font-medium text-ink-700">{formatDualQuantity(freeKg)}</span>
              {' · '}MOQ: {formatKg(p.moqKg)}
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <Clock className="h-3 w-3" /> Price updated {relativeDay(p.priceEffectiveAt)}
            </p>
          </div>
        )}

        <div className="mt-4 flex-1" />
        {footer && <div className="pt-1">{footer}</div>}
      </div>
    </Card>
  );
}
