import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Coins } from 'lucide-react';
import { getSettings, saveSettings, PAYMENT_TERMS } from '@/data/settings';
import {
  Button, Card, CardBody, CardHeader, Field, Input, PageHeader, useToast,
} from '@/components/ui';

export function AdminSettingsPage() {
  const toast = useToast();
  const [s, setS] = useState(getSettings());

  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => setS((prev) => ({ ...prev, [k]: v }));

  const save = () => {
    saveSettings(s);
    toast.success('Settings saved. New orders will use these values.');
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configurable mock commercial values used across the prototype."
        actions={<Button icon={Save} onClick={save}>Save settings</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Commercial defaults" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="VAT rate" hint="e.g. 0.15 for 15%">
              <Input type="number" step={0.01} min={0} value={s.taxRate} onChange={(e) => set('taxRate', Number(e.target.value))} />
            </Field>
            <Field label="Delivery fee (SAR)">
              <Input type="number" step={50} min={0} value={s.deliveryFeeSar} onChange={(e) => set('deliveryFeeSar', Number(e.target.value))} />
            </Field>
            <Field label="Order number prefix">
              <Input value={s.orderNumberPrefix} onChange={(e) => set('orderNumberPrefix', e.target.value)} />
            </Field>
            <Field label="Next order sequence">
              <Input type="number" min={1} value={s.orderNumberSeqStart} onChange={(e) => set('orderNumberSeqStart', Number(e.target.value))} />
            </Field>
            <Field label="Company name" className="sm:col-span-2">
              <Input value={s.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </Field>
            <Field label="Support email" className="sm:col-span-2">
              <Input type="email" value={s.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} />
            </Field>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Payment terms" />
            <CardBody className="space-y-3">
              {PAYMENT_TERMS.map((t) => (
                <div key={t.id} className="rounded-lg border border-ink-200 p-3">
                  <p className="text-sm font-medium text-ink-900">{t.label}</p>
                  <p className="text-xs text-ink-500">{t.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {t.schedule.map((step, i) => (
                      <span key={i} className="rounded-full bg-ink-100 px-2 py-0.5 text-ink-600">
                        {step.portion} ({Math.round(step.fraction * 100)}%) · {step.trigger}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-ink-400">Payment-term definitions are fixed in this prototype.</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Currencies" />
            <CardBody>
              <p className="text-sm text-ink-600">Manage exchange rates and active currencies.</p>
              <Button to="/admin/settings/currencies" variant="secondary" icon={Coins} className="mt-3">
                Currency settings
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-400">
        Need to start fresh? Use <Link to="/" className="underline">Reset Demo Data</Link> in the Prototype Mode bar.
      </p>
    </div>
  );
}
