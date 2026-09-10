import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button, Card, Field, Input, Textarea, PageHeader, useToast } from '@/components/ui';

export function ContactPage() {
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only: no real message is sent (spec §75).
    toast.success('Thanks — your message has been recorded. Our team will be in touch.');
    setSent(true);
    setForm({ name: '', company: '', email: '', message: '' });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container-page py-10">
      <PageHeader title="Contact Fleasea" subtitle="Questions about wholesale supply, pricing or merchant approval." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required className="sm:col-span-1">
              <Input required value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Company" className="sm:col-span-1">
              <Input value={form.company} onChange={set('company')} />
            </Field>
            <Field label="Work email" required className="sm:col-span-2">
              <Input type="email" required value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Message" required className="sm:col-span-2">
              <Textarea required value={form.message} onChange={set('message')} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit">Send message</Button>
              {sent && <span className="ms-3 text-sm text-emerald-600">Message recorded.</span>}
            </div>
          </form>
        </Card>

        <Card className="h-fit p-6">
          <h3 className="font-semibold text-ink-900">Head office</h3>
          <ul className="mt-3 space-y-3 text-sm text-ink-600">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sea-600" /> Dammam, Saudi Arabia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-sea-600" /> +966 13 000 0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-sea-600" /> trade@fleasea.demo</li>
          </ul>
          <p className="mt-4 text-xs text-ink-400">
            Prototype — contact details are placeholders and no message is actually delivered.
          </p>
        </Card>
      </div>
    </div>
  );
}
