import {
  ArrowRight,
  Snowflake,
  Fish,
  Waves,
  ShieldCheck,
  Handshake,
  Truck,
  BadgeCheck,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import { Button, Card } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { HERO_IMAGE } from '@/data/images';

const CATEGORIES = [
  { icon: Fish, en: 'Fresh / Ice Fish', ar: 'أسماك طازجة / مثلجة', note: 'Daily-landed, iced to spec' },
  { icon: Waves, en: 'Live Fish', ar: 'أسماك حية', note: 'Oxygenated transport, graded' },
  { icon: Snowflake, en: 'Frozen Fish', ar: 'أسماك مجمدة', note: 'IQF & block, export-ready' },
];

const STEPS = [
  { icon: BadgeCheck, title: 'Apply & get approved', body: 'Submit your trade licence and business details. Our team verifies and activates your account.' },
  { icon: Fish, title: 'Browse live wholesale prices', body: 'See daily-updated prices, available tonnage and grades across all three fish categories.' },
  { icon: Handshake, title: 'Negotiate & order in bulk', body: 'Request quotes, counter-offer, and place orders in KG or TON with flexible payment terms.' },
  { icon: Truck, title: 'Track shipment to delivery', body: 'Follow dispatch, transit and delivery with documents released against your payment schedule.' },
];

const TRUST = [
  { stat: '3', label: 'Fish categories traded' },
  { stat: 'KG / TON', label: 'Bulk quantities' },
  { stat: '5', label: 'Settlement currencies' },
  { stat: '24h', label: 'Price refresh cycle' },
];

export function HomePage() {
  const { t, locale } = useI18n();
  const { data: featured } = useAsync(() => productService.publicList(), []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="container-page relative grid gap-8 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Approved wholesale buyers only
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Bulk fish trading, priced and settled with confidence.
            </h1>
            <p className="mt-4 max-w-lg text-brand-100">
              Fleasea connects approved distributors and wholesalers with a managed supply of
              fresh, live and frozen fish — with daily pricing, bulk quantities and structured
              payment terms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/register" size="lg" iconRight={ArrowRight}>
                {t('nav.register')}
              </Button>
              <Button
                to="/products"
                size="lg"
                variant="secondary"
                className="bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20"
              >
                {t('nav.products')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Primary fish categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Card key={c.en} className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-ink-900">{locale === 'ar' ? c.ar : c.en}</h3>
              <p className="mt-1 text-sm text-ink-500">{c.note}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured wholesale products — admin-selected, max 5 (spec §10) */}
      <section className="bg-white py-14">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Featured wholesale products</h2>
            <Button to="/products" variant="ghost" size="sm" iconRight={ArrowRight}>
              {t('common.viewAll')}
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(featured ?? []).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                to={`/products/${p.id}`}
                footer={
                  <Button to={`/products/${p.id}`} variant="secondary" size="sm" fullWidth>
                    View details
                  </Button>
                }
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-400">
            {t('currency.disclaimer')} Full catalogue and live prices unlock after merchant approval.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-14">
        <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">How Fleasea works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="p-5">
              <div className="flex items-center gap-2 text-brand-600">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-ink-400">STEP {i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-brand-900 py-12 text-white">
        <div className="container-page grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST.map((x) => (
            <div key={x.label}>
              <p className="text-2xl font-extrabold sm:text-3xl">{x.stat}</p>
              <p className="mt-1 text-sm text-brand-200">{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <Card className="flex flex-col items-center gap-4 bg-ink-950 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to trade fish at wholesale scale?</h2>
          <p className="max-w-xl text-ink-300">
            Register your business, get approved, and access the full catalogue with live pricing,
            negotiation and structured settlement.
          </p>
          <Button to="/register" size="lg" iconRight={ArrowRight}>
            {t('nav.register')}
          </Button>
        </Card>
      </section>
    </div>
  );
}
