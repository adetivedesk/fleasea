import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useApp } from '@/store/AppContext';
import { useCart } from '@/store/CartContext';
import type { NavItem } from '@/routes/navigation';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { LanguageSelector, CurrencySelector } from './Selectors';

interface Props {
  nav: NavItem[];
  area: 'merchant' | 'admin';
  children: React.ReactNode;
}

export function DashboardShell({ nav, area, children }: Props) {
  const { t } = useI18n();
  const { setDemoRole } = useApp();
  const cart = useCart();
  const [drawer, setDrawer] = useState(false);

  const itemCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand-50 text-brand-800'
        : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
    );

  const navList = (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setDrawer(false)}
          className={itemCls}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{t(item.labelKey)}</span>
          {area === 'merchant' && item.to === '/merchant/cart' && cart.count > 0 && (
            <span className="ms-auto rounded-full bg-brand-700 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {cart.count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const areaLabel = area === 'admin' ? 'Admin Console' : 'Merchant Portal';

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-ink-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-ink-200 px-4">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
            {areaLabel}
          </p>
          {navList}
        </div>
        <div className="border-t border-ink-200 p-3">
          <button
            onClick={() => setDemoRole('visitor')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 start-0 flex w-72 flex-col bg-white shadow-panel">
            <div className="flex h-16 items-center justify-between border-b border-ink-200 px-4">
              <Logo />
              <button onClick={() => setDrawer(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{navList}</div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-200 lg:hidden"
            aria-label="Menu"
            onClick={() => setDrawer(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to={area === 'admin' ? '/admin' : '/merchant'} className="font-semibold text-ink-800">
            {areaLabel}
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <LanguageSelector />
            <CurrencySelector />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
