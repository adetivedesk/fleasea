import { useEffect, useState } from 'react';
import { Building2, FileText, Pencil, Save, X } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { merchantService } from '@/services/merchantService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { categoryName } from '@/data/categories';
import { formatDate } from '@/utils/format';
import {
  Button, Card, CardBody, CardHeader, Field, Input, LoadingState, PageHeader, StatusBadge, Textarea, useToast,
} from '@/components/ui';
import type { Merchant } from '@/types';

export function MerchantProfilePage() {
  const toast = useToast();
  const { data, loading, reload } = useAsync(() => merchantService.get(CURRENT_MERCHANT_ID), []);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Merchant | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (loading || !data || !form) return <LoadingState />;

  const set = (path: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setForm((f) => {
      if (!f) return f;
      const next = structuredClone(f);
      if (path === 'companyName') next.companyName = v;
      else if (path === 'companyNameAr') next.companyNameAr = v;
      else if (path === 'businessActivity') next.businessActivity = v;
      else if (path === 'volume') next.estimatedMonthlyVolumeKg = Number(v) || 0;
      else if (path === 'city') next.address.city = v;
      else if (path === 'line1') next.address.line1 = v;
      else if (path === 'contactName') next.contact.fullName = v;
      else if (path === 'position') next.contact.position = v;
      else if (path === 'mobile') next.contact.mobile = v;
      else if (path === 'whatsapp') next.contact.whatsapp = v;
      return next;
    });
  };

  const save = async () => {
    await merchantService.update(CURRENT_MERCHANT_ID, form);
    toast.success('Company profile updated.');
    setEdit(false);
    reload();
  };
  const cancel = () => {
    setForm(data);
    setEdit(false);
  };

  return (
    <div>
      <PageHeader
        title="Company Profile"
        subtitle={<span className="inline-flex items-center gap-2">Account status <StatusBadge status={data.status} /></span>}
        actions={
          edit ? (
            <>
              <Button variant="ghost" icon={X} onClick={cancel}>Cancel</Button>
              <Button icon={Save} onClick={save}>Save changes</Button>
            </>
          ) : (
            <Button icon={Pencil} variant="secondary" onClick={() => setEdit(true)}>Edit</Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={<span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Company</span>} />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <Input value={form.companyName} onChange={set('companyName')} disabled={!edit} />
            </Field>
            <Field label="Company name (Arabic)">
              <Input dir="rtl" value={form.companyNameAr} onChange={set('companyNameAr')} disabled={!edit} />
            </Field>
            <ReadOnly label="Business type" value={data.businessType} />
            <ReadOnly label="Preferred currency" value={data.preferredCurrency} />
            <ReadOnly label="Commercial registration" value={data.crNumber} />
            <ReadOnly label="VAT / Tax number" value={data.vatNumber} />
            <Field label="City">
              <Input value={form.address.city} onChange={set('city')} disabled={!edit} />
            </Field>
            <Field label="Country">
              <Input value={form.address.country} disabled />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input value={form.address.line1} onChange={set('line1')} disabled={!edit} />
            </Field>
            <Field label="Business activity" className="sm:col-span-2">
              <Textarea value={form.businessActivity} onChange={set('businessActivity')} disabled={!edit} />
            </Field>
            <Field label="Estimated monthly volume (KG)">
              <Input type="number" value={form.estimatedMonthlyVolumeKg} onChange={set('volume')} disabled={!edit} />
            </Field>
            <div>
              <span className="mb-1 block text-sm font-medium text-ink-700">Preferred categories</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.preferredCategories.map((c) => (
                  <span key={c} className="rounded-full bg-sea-50 px-2 py-0.5 text-xs text-sea-700">
                    {categoryName(c, 'en')}
                  </span>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Primary contact" />
            <CardBody className="grid gap-4">
              <Field label="Full name">
                <Input value={form.contact.fullName} onChange={set('contactName')} disabled={!edit} />
              </Field>
              <Field label="Position">
                <Input value={form.contact.position} onChange={set('position')} disabled={!edit} />
              </Field>
              <ReadOnly label="Email" value={data.contact.email} />
              <Field label="Mobile">
                <Input value={form.contact.mobile} onChange={set('mobile')} disabled={!edit} />
              </Field>
              <Field label="WhatsApp">
                <Input value={form.contact.whatsapp ?? ''} onChange={set('whatsapp')} disabled={!edit} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Documents</span>} />
            <CardBody>
              {data.documents.length === 0 ? (
                <p className="text-sm text-ink-500">No documents on file.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.documents.map((d) => (
                    <li key={d.fileName} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2">
                      <span className="truncate text-ink-700">{d.fileName}</span>
                      <span className="text-xs text-ink-400">{formatDate(d.uploadedAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-ink-400">Document management is handled by the Fleasea team.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      <p className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-600">{value}</p>
    </div>
  );
}
