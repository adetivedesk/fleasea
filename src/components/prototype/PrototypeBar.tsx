/**
 * PROTOTYPE-ONLY (spec §52).
 * A dev role switcher + demo controls. This whole folder can be deleted once
 * real authentication lands — nothing in the app imports from it except App.tsx.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, RotateCcw } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useI18n } from '@/i18n';
import type { DemoRole } from '@/types';
import { LanguageSelector, CurrencySelector } from '@/components/layout/Selectors';
import { cn } from '@/utils/cn';

const ROLE_ORDER: DemoRole[] = ['visitor', 'pending', 'merchant', 'admin'];

const ROLE_HOME: Record<DemoRole, string> = {
  visitor: '/',
  pending: '/merchant/application-status',
  merchant: '/merchant',
  admin: '/admin',
};

export function PrototypeBar() {
  const { demoRole, setDemoRole, resetDemoData } = useApp();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const pickRole = (role: DemoRole) => {
    setDemoRole(role);
    navigate(ROLE_HOME[role]);
  };

  const ROLE_LABEL: Record<DemoRole, string> = {
    visitor: t('preview.visitor'),
    pending: t('preview.pending'),
    merchant: t('preview.merchant'),
    admin: t('preview.admin'),
  };

  return (
    <div className="sticky top-0 z-50 border-b border-brand-800 bg-brand-950 text-white">
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 py-2 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide text-brand-200">
          <FlaskConical className="h-3.5 w-3.5" />
          {t('preview.label')}
        </span>

        <div className="flex items-center rounded-lg bg-brand-900/80 p-0.5">
          {ROLE_ORDER.map((role) => (
            <button
              key={role}
              onClick={() => pickRole(role)}
              className={cn(
                'rounded-md px-2.5 py-1 font-medium transition-colors',
                demoRole === role
                  ? 'bg-white text-brand-900'
                  : 'text-brand-100 hover:bg-brand-800',
              )}
            >
              {ROLE_LABEL[role]}
            </button>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-2">
          <LanguageSelector />
          <CurrencySelector />
          {confirming ? (
            <span className="flex items-center gap-1.5">
              <button
                onClick={resetDemoData}
                className="rounded-md bg-red-500 px-2 py-1 font-medium hover:bg-red-600"
              >
                Confirm reset
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-md bg-brand-800 px-2 py-1 hover:bg-brand-700"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              title={t('preview.reset.confirm')}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-2 py-1 font-medium hover:bg-brand-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t('preview.reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
