import { Hammer } from 'lucide-react';
import { useI18n } from '@/i18n';
import { PageHeader } from '@/components/ui';

export function Placeholder({ title, phase }: { title: string; phase: number }) {
  const { t } = useI18n();
  return (
    <div>
      <PageHeader title={title} subtitle={`${t('common.comingSoon')} — Phase ${phase}`} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-white/60 px-6 py-20 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sea-50 text-sea-600">
          <Hammer className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-ink-800">{title}</p>
        <p className="max-w-md text-sm text-ink-500">{t('common.comingSoon.body')}</p>
        <p className="text-xs text-ink-400">Scheduled for build Phase {phase}.</p>
      </div>
    </div>
  );
}
