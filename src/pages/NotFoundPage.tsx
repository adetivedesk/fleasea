import { useI18n } from '@/i18n';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-2 text-xl font-bold text-ink-900">{t('notfound.title')}</h1>
      <p className="mt-2 text-sm text-ink-500">{t('notfound.body')}</p>
      <Button to="/" className="mt-6">
        {t('common.backHome')}
      </Button>
    </div>
  );
}
