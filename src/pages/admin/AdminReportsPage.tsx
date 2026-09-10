import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { productService } from '@/services/productService';
import { merchantService } from '@/services/merchantService';
import { categoryName, CATEGORIES } from '@/data/categories';
import { formatDate, humanizeStatus } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import { toCsv, downloadCsv, type CsvColumn } from '@/utils/csv';
import {
  Button, Card, CardBody, EmptyState, Field, Input, LoadingState, PageHeader, SegmentedControl, Select,
} from '@/components/ui';

type ReportId = 'sales' | 'orders' | 'inventory' | 'merchants' | 'payments';

const REPORTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'orders', label: 'Orders' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'merchants', label: 'Merchants' },
  { value: 'payments', label: 'Payments' },
];

export function AdminReportsPage() {
  const { data, loading } = useAsync(async () => {
    const [orders, payments, products, merchants] = await Promise.all([
      orderService.list(),
      paymentService.list(),
      productService.listAll(),
      merchantService.list(),
    ]);
    return { orders, payments, products, merchants };
  }, []);

  const [report, setReport] = useState<ReportId>('sales');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const merchantName = (id: string) => data?.merchants.find((m) => m.id === id)?.companyName ?? id;

  const { columns, rows, filename } = useMemo(() => {
    if (!data) return { columns: [] as CsvColumn<unknown>[], rows: [] as unknown[], filename: '' };
    const inRange = (iso: string) => (!from || iso >= from) && (!to || iso <= `${to}T23:59:59Z`);

    if (report === 'sales' || report === 'orders') {
      let list = data.orders.filter((o) => inRange(o.createdAt));
      if (status !== 'all') list = list.filter((o) => o.status === status);
      if (category !== 'all') list = list.filter((o) => o.items.some((i) => data.products.find((p) => p.id === i.productId)?.category === category));
      const cols: CsvColumn<(typeof list)[number]>[] = [
        { header: 'Order', value: (o) => o.number },
        { header: 'Merchant', value: (o) => merchantName(o.merchantId) },
        { header: 'Date', value: (o) => formatDate(o.createdAt) },
        { header: 'Items', value: (o) => o.items.length },
        { header: 'Quantity (KG)', value: (o) => o.items.reduce((s, i) => s + i.quantityKg, 0) },
        { header: 'Currency', value: (o) => o.currency },
        { header: 'Total', value: (o) => o.total },
        { header: 'Payment status', value: (o) => humanizeStatus(o.paymentStatus) },
        { header: 'Order status', value: (o) => humanizeStatus(o.status) },
      ];
      return { columns: cols as CsvColumn<unknown>[], rows: list as unknown[], filename: `fleasea-${report}` };
    }

    if (report === 'payments') {
      let list = data.payments.filter((p) => inRange(p.createdAt));
      if (status !== 'all') list = list.filter((p) => p.status === status);
      const cols: CsvColumn<(typeof list)[number]>[] = [
        { header: 'Payment ID', value: (p) => p.id },
        { header: 'Order', value: (p) => p.orderNumber },
        { header: 'Merchant', value: (p) => merchantName(p.merchantId) },
        { header: 'Portion', value: (p) => p.portion },
        { header: 'Method', value: (p) => p.method },
        { header: 'Amount', value: (p) => p.amount },
        { header: 'Currency', value: (p) => p.currency },
        { header: 'Status', value: (p) => humanizeStatus(p.status) },
        { header: 'Date', value: (p) => formatDate(p.createdAt) },
      ];
      return { columns: cols as CsvColumn<unknown>[], rows: list as unknown[], filename: 'fleasea-payments' };
    }

    if (report === 'inventory') {
      let list = data.products;
      if (category !== 'all') list = list.filter((p) => p.category === category);
      const cols: CsvColumn<(typeof list)[number]>[] = [
        { header: 'Code', value: (p) => p.code },
        { header: 'Product', value: (p) => p.nameEn },
        { header: 'Category', value: (p) => categoryName(p.category, 'en') },
        { header: 'Available KG', value: (p) => p.availableKg },
        { header: 'Reserved KG', value: (p) => p.reservedKg },
        { header: 'After reservations', value: (p) => p.availableKg - p.reservedKg },
        { header: 'MOQ KG', value: (p) => p.moqKg },
        { header: 'Base price', value: (p) => p.basePrice },
        { header: 'Stock status', value: (p) => humanizeStatus(p.stockStatus) },
      ];
      return { columns: cols as CsvColumn<unknown>[], rows: list as unknown[], filename: 'fleasea-inventory' };
    }

    // merchants
    let list = data.merchants;
    if (status !== 'all') list = list.filter((m) => m.status === status);
    const cols: CsvColumn<(typeof list)[number]>[] = [
      { header: 'Company', value: (m) => m.companyName },
      { header: 'Country', value: (m) => m.address.country },
      { header: 'Contact', value: (m) => m.contact.fullName },
      { header: 'Email', value: (m) => m.contact.email },
      { header: 'Est. monthly KG', value: (m) => m.estimatedMonthlyVolumeKg },
      { header: 'Documents', value: (m) => m.documents.length },
      { header: 'Registered', value: (m) => formatDate(m.registeredAt) },
      { header: 'Status', value: (m) => humanizeStatus(m.status) },
    ];
    return { columns: cols as CsvColumn<unknown>[], rows: list as unknown[], filename: 'fleasea-merchants' };
  }, [data, report, from, to, category, status]);

  if (loading || !data) return <LoadingState />;

  const statusOptions =
    report === 'merchants'
      ? ['all', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']
      : report === 'payments'
        ? ['all', 'PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED']
        : ['all', 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const exportCsv = () => downloadCsv(`${filename}-${new Date().toISOString().slice(0, 10)}`, toCsv(rows, columns));

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Filter and export mock trading data as CSV."
        actions={<Button icon={Download} onClick={exportCsv} disabled={rows.length === 0}>Export CSV</Button>}
      />

      <div className="mb-4"><SegmentedControl value={report} onChange={(r) => setReport(r as ReportId)} options={REPORTS} /></div>

      <Card className="mb-4">
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="From"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
          <Field label="To"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
          {report !== 'merchants' && report !== 'payments' && (
            <Field label="Category">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.nameEn }))]}
              />
            </Field>
          )}
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All' : humanizeStatus(s) }))}
            />
          </Field>
        </CardBody>
      </Card>

      <p className="mb-2 text-sm text-ink-500">{rows.length} rows</p>
      {rows.length === 0 ? (
        <EmptyState title="No data for these filters" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                {columns.map((c) => <th key={c.header} className="px-3 py-2.5 font-medium">{c.header}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r, i) => (
                <tr key={i} className="border-b border-ink-100 last:border-0">
                  {columns.map((c) => {
                    const v = c.value(r);
                    return <td key={c.header} className="px-3 py-2 text-ink-700">{typeof v === 'number' && /total|amount|price/i.test(c.header) ? formatMoney(v, 'SAR') : String(v)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 50 && <p className="p-3 text-center text-xs text-ink-400">Showing 50 of {rows.length}. Export CSV for the full set.</p>}
        </div>
      )}
    </div>
  );
}
