import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PRODUCT_CATEGORY } from '@/constants';
import { CATEGORIES } from '@/data/categories';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';
import type { CurrencyCode, Product } from '@/types';
import type { ProductCategory } from '@/constants/status';
import {
  Button, Card, CardBody, CardHeader, Checkbox, Field, Input, LoadingState, PageHeader, Select, Textarea, useToast,
} from '@/components/ui';

const CURRENCIES: CurrencyCode[] = ['SAR', 'USD', 'EUR', 'AED', 'GBP'];
const IMG_KEYS = ['hamour', 'kingfish', 'sardine', 'mackerel', 'seabream', 'grouper', 'tilapia', 'shrimp', 'generic'];

type FormShape = Omit<Product, 'id' | 'stockStatus' | 'priceHistory'>;

const BLANK: FormShape = {
  code: '', nameEn: '', nameAr: '', category: PRODUCT_CATEGORY.FRESH_ICE, origin: '', grade: '',
  size: '', weightRange: '', packaging: '', descriptionEn: '', descriptionAr: '', images: ['generic'],
  availableKg: 0, reservedKg: 0, moqKg: 500, basePrice: 0, baseCurrency: 'SAR',
  priceEffectiveAt: new Date().toISOString(), publicVisible: false, active: true,
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: existing, loading } = useAsync(() => (id ? productService.get(id) : Promise.resolve(undefined)), [id]);
  const [f, setF] = useState<FormShape>(BLANK);

  useEffect(() => {
    if (existing) {
      const { id: _id, stockStatus: _s, priceHistory: _p, ...rest } = existing;
      setF(rest);
    }
  }, [existing]);

  if (isEdit && loading) return <LoadingState />;

  const set = <K extends keyof FormShape>(k: K, v: FormShape[K]) => setF((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!f.nameEn || !f.code) return toast.error('Name and product code are required.');
    if (!(f.basePrice > 0)) return toast.error('Base price must be greater than zero.');
    if (isEdit && existing) {
      await productService.save({ ...existing, ...f });
      toast.success('Product updated.');
    } else {
      await productService.create(f);
      toast.success('Product created.');
    }
    navigate('/admin/products');
  };

  return (
    <div>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4 flip-x" /> Products
      </Link>
      <PageHeader title={isEdit ? `Edit — ${f.nameEn || 'product'}` : 'New product'} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Details" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Product code" required><Input value={f.code} onChange={(e) => set('code', e.target.value)} /></Field>
              <Field label="Category" required>
                <Select value={f.category} onChange={(e) => set('category', e.target.value as ProductCategory)}
                  options={CATEGORIES.map((c) => ({ value: c.id, label: c.nameEn }))} />
              </Field>
              <Field label="English name" required><Input value={f.nameEn} onChange={(e) => set('nameEn', e.target.value)} /></Field>
              <Field label="Arabic name"><Input dir="rtl" value={f.nameAr} onChange={(e) => set('nameAr', e.target.value)} /></Field>
              <Field label="Origin"><Input value={f.origin} onChange={(e) => set('origin', e.target.value)} /></Field>
              <Field label="Grade"><Input value={f.grade} onChange={(e) => set('grade', e.target.value)} /></Field>
              <Field label="Size"><Input value={f.size} onChange={(e) => set('size', e.target.value)} /></Field>
              <Field label="Weight range"><Input value={f.weightRange} onChange={(e) => set('weightRange', e.target.value)} /></Field>
              <Field label="Packaging" className="sm:col-span-2"><Input value={f.packaging} onChange={(e) => set('packaging', e.target.value)} /></Field>
              <Field label="Description (EN)" className="sm:col-span-2"><Textarea value={f.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} /></Field>
              <Field label="Description (AR)" className="sm:col-span-2"><Textarea dir="rtl" value={f.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} /></Field>
              <Field label="Image" className="sm:col-span-2">
                <Select value={f.images[0]} onChange={(e) => set('images', [e.target.value])}
                  options={IMG_KEYS.map((k) => ({ value: k, label: k }))} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Pricing & stock" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Base price (per KG)" required>
                <Input type="number" min={0} step={0.5} value={f.basePrice} onChange={(e) => set('basePrice', Number(e.target.value))} />
              </Field>
              <Field label="Base currency">
                <Select value={f.baseCurrency} onChange={(e) => set('baseCurrency', e.target.value as CurrencyCode)}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
              </Field>
              <Field label="Available (KG)"><Input type="number" min={0} value={f.availableKg} onChange={(e) => set('availableKg', Number(e.target.value))} /></Field>
              <Field label="Reserved (KG)"><Input type="number" min={0} value={f.reservedKg} onChange={(e) => set('reservedKg', Number(e.target.value))} /></Field>
              <Field label="Minimum order quantity (KG)"><Input type="number" min={0} value={f.moqKg} onChange={(e) => set('moqKg', Number(e.target.value))} /></Field>
            </CardBody>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Visibility" />
          <CardBody className="space-y-3">
            <Checkbox label="Product active" checked={f.active} onChange={(e) => set('active', e.target.checked)} />
            <Checkbox label="Show in public preview" checked={f.publicVisible} onChange={(e) => set('publicVisible', e.target.checked)} />
            <p className="text-xs text-ink-400">
              Public preview is capped at 5 products. The cap is enforced from the product list toggle.
            </p>
            <Button icon={Save} fullWidth onClick={save}>{isEdit ? 'Save changes' : 'Create product'}</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
