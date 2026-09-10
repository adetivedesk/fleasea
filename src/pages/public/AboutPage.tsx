import { Anchor, Handshake, LineChart, ShieldCheck, Truck, Waves } from 'lucide-react';
import { Card, PageHeader } from '@/components/ui';

const VALUES = [
  { icon: ShieldCheck, title: 'Verified trade only', body: 'Every buyer is a vetted business with a valid commercial registration and tax record.' },
  { icon: LineChart, title: 'Transparent daily pricing', body: 'Market prices are published every day with full change history — no hidden markups.' },
  { icon: Handshake, title: 'Structured negotiation', body: 'Product- and order-level negotiation with a clear offer / counter-offer trail.' },
  { icon: Truck, title: 'Traceable fulfilment', body: 'Dispatch, transit, delivery and quantity variance are tracked end to end.' },
];

export function AboutPage() {
  return (
    <div className="container-page py-10">
      <PageHeader
        title="About Fleasea"
        subtitle="A managed B2B marketplace for wholesale fish trading across the Gulf and beyond."
      />

      <Card className="overflow-hidden">
        <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
          <div className="sm:col-span-2">
            <h2 className="text-lg font-semibold text-ink-900">What we do</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Fleasea connects approved wholesale buyers — distributors, caterers, retail chains and
              re-exporters — with a managed supply of fresh / ice, live and frozen fish. We handle
              catalogue, daily pricing, negotiation, payment terms, shipment and delivery
              documentation in one place, so bulk trading is predictable and auditable.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Quantities are wholesale — priced per kilogram, ordered in KG or TON. Buyers choose
              settlement currency and payment terms suited to their cash cycle.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span className="grid h-24 w-24 place-items-center rounded-2xl bg-sea-50 text-sea-600">
              <Waves className="h-10 w-10" />
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {VALUES.map((v) => (
          <Card key={v.title} className="p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-semibold text-ink-900">{v.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{v.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 flex items-start gap-4 p-6">
        <Anchor className="mt-1 h-6 w-6 shrink-0 text-sea-600" />
        <div>
          <h3 className="font-semibold text-ink-900">Categories we trade</h3>
          <p className="mt-1 text-sm text-ink-600">
            Fresh / Ice Fish · Live Fish · Frozen Fish — sourced from Saudi Arabia, Oman, the UAE and
            selected international suppliers, with grade and origin stated on every line.
          </p>
        </div>
      </Card>
    </div>
  );
}
