import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { PRODUCT_CATEGORY } from '@/constants';
import type { ProductCategory } from '@/constants/status';
import { CATEGORIES } from '@/data/categories';
import { merchantService, type ApplicationInput } from '@/services/merchantService';
import type { CurrencyCode } from '@/types';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
  useToast,
} from '@/components/ui';
import { MockFileInput, type MockFileMeta } from '@/components/common/MockFileInput';
import { Logo } from '@/components/layout/Logo';

const CURRENCIES: CurrencyCode[] = ['SAR', 'USD', 'EUR', 'AED', 'GBP'];
const BUSINESS_TYPES = [
  'Wholesale distributor',
  'Catering supplier',
  'Retail chain supplier',
  'Importer / re-exporter',
  'Hospitality supplier',
  'Processor / manufacturer',
];

interface FormState {
  companyName: string;
  companyNameAr: string;
  businessType: string;
  crNumber: string;
  vatNumber: string;
  country: string;
  city: string;
  addressLine1: string;
  fullName: string;
  position: string;
  email: string;
  mobile: string;
  whatsapp: string;
  businessActivity: string;
  estimatedMonthlyVolumeKg: string;
  preferredCurrency: CurrencyCode;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormState = {
  companyName: '', companyNameAr: '', businessType: BUSINESS_TYPES[0], crNumber: '', vatNumber: '',
  country: 'Saudi Arabia', city: '', addressLine1: '',
  fullName: '', position: '', email: '', mobile: '', whatsapp: '',
  businessActivity: '', estimatedMonthlyVolumeKg: '', preferredCurrency: 'SAR',
  password: '', confirmPassword: '',
};

export function RegisterPage() {
  const toast = useToast();
  const [f, setF] = useState<FormState>(EMPTY);
  const [cats, setCats] = useState<ProductCategory[]>([PRODUCT_CATEGORY.FRESH_ICE]);
  const [docs, setDocs] = useState<Record<string, MockFileMeta | null>>({});
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<null | { company: string }>(null);

  const set =
    <K extends keyof FormState>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF((s) => ({ ...s, [k]: e.target.value as FormState[K] }));

  const toggleCat = (c: ProductCategory) =>
    setCats((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cats.length === 0) return toast.error('Select at least one preferred fish category.');
    if (f.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (f.password !== f.confirmPassword) return toast.error('Passwords do not match.');
    if (!agree) return toast.error('Please accept the Terms and Privacy Policy.');

    const documents: ApplicationInput['documents'] = Object.entries(docs)
      .filter(([, v]) => v)
      .map(([type, v]) => ({
        type: type as ApplicationInput['documents'][number]['type'],
        fileName: v!.fileName,
        sizeKb: v!.sizeKb,
        uploadedAt: new Date().toISOString(),
      }));

    const input: ApplicationInput = {
      companyName: f.companyName,
      companyNameAr: f.companyNameAr,
      businessType: f.businessType,
      crNumber: f.crNumber,
      vatNumber: f.vatNumber,
      address: { country: f.country, city: f.city, line1: f.addressLine1 },
      contact: {
        fullName: f.fullName,
        position: f.position,
        email: f.email,
        mobile: f.mobile,
        whatsapp: f.whatsapp || undefined,
      },
      businessActivity: f.businessActivity,
      estimatedMonthlyVolumeKg: Number(f.estimatedMonthlyVolumeKg) || 0,
      preferredCategories: cats,
      preferredCurrency: f.preferredCurrency,
      documents,
    };

    setBusy(true);
    try {
      const merchant = await merchantService.submitApplication(input);
      setSubmitted({ company: merchant.companyName });
      window.scrollTo(0, 0);
    } catch {
      toast.error('Could not submit application. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <Card className="w-full max-w-lg p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink-900">Application Submitted</h1>
          <p className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            STATUS: PENDING APPROVAL
          </p>
          <p className="mt-4 text-sm text-ink-600">
            Your merchant application for <strong>{submitted.company}</strong> has been submitted
            successfully. Our team will review your business information and contact you once your
            account is approved.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button to="/login">Go to Login</Button>
            <Button to="/" variant="secondary">
              Back to home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Logo compact />
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Merchant Registration</h1>
            <p className="text-sm text-ink-500">
              Register your business to trade wholesale on Fleasea. All fields marked * are required.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader title="Company details" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" required>
                <Input required value={f.companyName} onChange={set('companyName')} />
              </Field>
              <Field label="Company name (Arabic)" required>
                <Input required dir="rtl" value={f.companyNameAr} onChange={set('companyNameAr')} />
              </Field>
              <Field label="Business type" required>
                <Select
                  value={f.businessType}
                  onChange={set('businessType')}
                  options={BUSINESS_TYPES.map((b) => ({ value: b, label: b }))}
                />
              </Field>
              <Field label="Commercial registration no." required>
                <Input required value={f.crNumber} onChange={set('crNumber')} />
              </Field>
              <Field label="VAT / Tax number" required>
                <Input required value={f.vatNumber} onChange={set('vatNumber')} />
              </Field>
              <Field label="Country" required>
                <Input required value={f.country} onChange={set('country')} />
              </Field>
              <Field label="City" required>
                <Input required value={f.city} onChange={set('city')} />
              </Field>
              <Field label="Address" required className="sm:col-span-2">
                <Input required value={f.addressLine1} onChange={set('addressLine1')} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Primary contact" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input required value={f.fullName} onChange={set('fullName')} />
              </Field>
              <Field label="Position" required>
                <Input required value={f.position} onChange={set('position')} />
              </Field>
              <Field label="Email" required>
                <Input type="email" required value={f.email} onChange={set('email')} />
              </Field>
              <Field label="Mobile" required>
                <Input required value={f.mobile} onChange={set('mobile')} />
              </Field>
              <Field label="WhatsApp" hint="Optional">
                <Input value={f.whatsapp} onChange={set('whatsapp')} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Business profile" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Business activity" required className="sm:col-span-2">
                <Textarea
                  required
                  value={f.businessActivity}
                  onChange={set('businessActivity')}
                  placeholder="Describe what you supply and to whom."
                />
              </Field>
              <Field label="Estimated monthly purchase volume (KG)" required>
                <Input
                  type="number"
                  min={0}
                  required
                  value={f.estimatedMonthlyVolumeKg}
                  onChange={set('estimatedMonthlyVolumeKg')}
                />
              </Field>
              <Field label="Preferred settlement currency" required>
                <Select
                  value={f.preferredCurrency}
                  onChange={set('preferredCurrency')}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                />
              </Field>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-ink-700">
                  Preferred fish categories <span className="text-red-600">*</span>
                </span>
                <div className="flex flex-wrap gap-4">
                  {CATEGORIES.map((c) => (
                    <Checkbox
                      key={c.id}
                      label={c.nameEn}
                      checked={cats.includes(c.id)}
                      onChange={() => toggleCat(c.id)}
                    />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Documents" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <p className="text-xs text-ink-400 sm:col-span-2">
                Prototype: filenames are recorded as metadata only — no file is uploaded or stored.
              </p>
              <MockFileInput label="Commercial registration" onChange={(v) => setDocs((d) => ({ ...d, commercial_registration: v }))} />
              <MockFileInput label="Tax / VAT certificate" onChange={(v) => setDocs((d) => ({ ...d, tax_certificate: v }))} />
              <MockFileInput label="Business license" onChange={(v) => setDocs((d) => ({ ...d, business_license: v }))} />
              <MockFileInput label="Other supporting document" onChange={(v) => setDocs((d) => ({ ...d, other: v }))} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Account" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Password" required hint="At least 6 characters">
                <Input type="password" required value={f.password} onChange={set('password')} />
              </Field>
              <Field label="Confirm password" required>
                <Input
                  type="password"
                  required
                  value={f.confirmPassword}
                  onChange={set('confirmPassword')}
                />
              </Field>
              <div className="sm:col-span-2">
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  label={
                    <span>
                      I agree to the{' '}
                      <Link to="/about" className="text-brand-700 underline">
                        Terms and Privacy Policy
                      </Link>
                      .
                    </span>
                  }
                />
              </div>
            </CardBody>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" icon={ClipboardList} disabled={busy}>
              {busy ? 'Submitting…' : 'Submit Merchant Application'}
            </Button>
            <Link to="/login" className="text-sm text-ink-500 hover:text-ink-800">
              Already registered? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
