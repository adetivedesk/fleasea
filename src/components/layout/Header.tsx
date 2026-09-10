import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { PUBLIC_NAV } from '@/routes/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { LanguageSelector, CurrencySelector } from './Selectors';

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'text-brand-800' : 'text-ink-600 hover:text-ink-900',
    );

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkCls}>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto hidden items-center gap-2 md:flex">
          <LanguageSelector />
          <CurrencySelector />
          <Button to="/login" variant="ghost" size="sm">
            {t('nav.login')}
          </Button>
          <Button to="/register" size="sm">
            {t('nav.register')}
          </Button>
        </div>

        <button
          className="ms-auto grid h-10 w-10 place-items-center rounded-lg border border-ink-200 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {PUBLIC_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-50',
                  )
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <LanguageSelector className="flex-1" />
              <CurrencySelector className="flex-1" />
            </div>
            <div className="mt-2 flex gap-2">
              <Button to="/login" variant="secondary" size="sm" fullWidth>
                {t('nav.login')}
              </Button>
              <Button to="/register" size="sm" fullWidth>
                {t('nav.register')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
