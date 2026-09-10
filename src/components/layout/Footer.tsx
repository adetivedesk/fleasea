import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Logo } from './Logo';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-ink-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-500">{t('app.tagline')}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-800">Marketplace</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/products" className="hover:text-ink-900">{t('nav.products')}</Link></li>
            <li><Link to="/register" className="hover:text-ink-900">{t('nav.register')}</Link></li>
            <li><Link to="/login" className="hover:text-ink-900">{t('nav.login')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-800">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/about" className="hover:text-ink-900">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-ink-900">{t('nav.contact')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink-800">Categories</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>Fresh / Ice Fish</li>
            <li>Live Fish</li>
            <li>Frozen Fish</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200">
        <div className="container-page flex flex-col gap-1 py-4 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} Fleasea. {t('footer.rights')}</span>
          <span>{t('footer.prototype')}</span>
        </div>
      </div>
    </footer>
  );
}
