import { ShieldAlert } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations';
import { Button } from '@/components/ui';

/** Frontend access messaging only — NOT real authorization (spec §59, §60). */
export function AccessGate({
  titleKey,
  bodyKey,
  ctaLabelKey,
  ctaTo,
}: {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  ctaLabelKey?: TranslationKey;
  ctaTo?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-500">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-ink-900">{t(titleKey)}</h1>
        <p className="mt-2 text-sm text-ink-500">{t(bodyKey)}</p>
        <div className="mt-6 flex justify-center gap-2">
          {ctaLabelKey && ctaTo && <Button to={ctaTo}>{t(ctaLabelKey)}</Button>}
          <Button to="/" variant="secondary">
            {t('common.backHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
