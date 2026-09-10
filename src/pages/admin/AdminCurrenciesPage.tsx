import { useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { currencyService } from '@/services/currencyService';
import { useApp } from '@/store/AppContext';
import { formatDate } from '@/utils/format';
import {
  Button, Field, Input, LoadingState, Modal, PageHeader, Toggle, useToast,
} from '@/components/ui';
import type { Currency, CurrencyCode } from '@/types';

export function AdminCurrenciesPage() {
  const toast = useToast();
  const { reloadCurrencies } = useApp();
  const { data, loading, reload } = useAsync(() => currencyService.list(), []);
  const [rates, setRates] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const [nc, setNc] = useState({ code: '', symbol: '', name: '', rate: '' });

  useEffect(() => {
    if (data) setRates(Object.fromEntries(data.map((c) => [c.code, String(c.rateFromSar)])));
  }, [data]);

  if (loading || !data) return <LoadingState />;

  const afterChange = () => { reload(); reloadCurrencies(); };

  const saveRate = async (c: Currency) => {
    const r = Number(rates[c.code]);
    if (!(r > 0)) return toast.error('Enter a valid rate.');
    await currencyService.updateRate(c.code, r);
    toast.success(`${c.code} rate updated.`);
    afterChange();
  };
  const toggle = async (c: Currency) => {
    if (c.code === 'SAR') return toast.error('The base currency (SAR) cannot be deactivated.');
    await currencyService.setActive(c.code, !c.active);
    afterChange();
  };
  const addCurrency = async () => {
    if (!nc.code || !nc.name || !(Number(nc.rate) > 0)) return toast.error('Fill code, name and a valid rate.');
    await currencyService.add({
      code: nc.code.toUpperCase() as CurrencyCode,
      symbol: nc.symbol || nc.code.toUpperCase(),
      name: nc.name,
      rateFromSar: Number(nc.rate),
      active: true,
      updatedAt: new Date().toISOString(),
    });
    toast.success('Currency added.');
    setAdding(false);
    setNc({ code: '', symbol: '', name: '', rate: '' });
    afterChange();
  };

  return (
    <div>
      <PageHeader
        title="Currency Settings"
        subtitle="Exchange rates are the value of 1 SAR in each currency. SAR is the base and stays at 1."
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Add currency</Button>}
      />

      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-2.5 font-medium">Currency</th>
              <th className="px-4 py-2.5 font-medium">Symbol</th>
              <th className="px-4 py-2.5 font-medium">Rate (per 1 SAR)</th>
              <th className="px-4 py-2.5 font-medium">Last updated</th>
              <th className="px-4 py-2.5 font-medium">Active</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.code} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-3"><span className="font-medium text-ink-800">{c.code}</span><span className="ms-2 text-ink-400">{c.name}</span></td>
                <td className="px-4 py-3 text-ink-600">{c.symbol}</td>
                <td className="px-4 py-3">
                  <Input
                    type="number" step={0.0001} min={0}
                    value={rates[c.code] ?? ''}
                    disabled={c.code === 'SAR'}
                    onChange={(e) => setRates((r) => ({ ...r, [c.code]: e.target.value }))}
                    className="w-32"
                  />
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">{formatDate(c.updatedAt)}</td>
                <td className="px-4 py-3"><Toggle checked={c.active} onChange={() => toggle(c)} disabled={c.code === 'SAR'} /></td>
                <td className="px-4 py-3">
                  <Button size="sm" icon={Save} disabled={c.code === 'SAR' || Number(rates[c.code]) === c.rateFromSar} onClick={() => saveRate(c)}>
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add currency"
        footer={<><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button onClick={addCurrency}>Add</Button></>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Code (3 letters)" required><Input value={nc.code} onChange={(e) => setNc((s) => ({ ...s, code: e.target.value }))} placeholder="KWD" maxLength={3} /></Field>
          <Field label="Symbol"><Input value={nc.symbol} onChange={(e) => setNc((s) => ({ ...s, symbol: e.target.value }))} placeholder="KD" /></Field>
          <Field label="Name" required className="sm:col-span-2"><Input value={nc.name} onChange={(e) => setNc((s) => ({ ...s, name: e.target.value }))} placeholder="Kuwaiti Dinar" /></Field>
          <Field label="Rate per 1 SAR" required className="sm:col-span-2"><Input type="number" step={0.0001} value={nc.rate} onChange={(e) => setNc((s) => ({ ...s, rate: e.target.value }))} placeholder="0.0819" /></Field>
        </div>
      </Modal>
    </div>
  );
}
