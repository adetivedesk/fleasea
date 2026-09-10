import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { negotiationService } from '@/services/negotiationService';
import { CURRENT_MERCHANT_ID } from '@/services/session';
import { fromKg, toKg } from '@/utils/quantity';
import { formatMoney } from '@/utils/currency';
import type { Product, QuantityUnit } from '@/types';
import { Modal, Button, Field, Input, Textarea, SegmentedControl, useToast } from '@/components/ui';

export function NegotiationDialog({
  product,
  open,
  onClose,
  initialKg,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  initialKg?: number;
}) {
  const toast = useToast();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<QuantityUnit>('TON');
  const [qty, setQty] = useState(String(fromKg(initialKg ?? product.moqKg, 'TON')));
  const [proposed, setProposed] = useState(String(product.basePrice));
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);

  const quantityKg = toKg(Number(qty) || 0, unit);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityKg < product.moqKg) return toast.error(`Minimum order is ${product.moqKg.toLocaleString()} KG.`);
    if (!(Number(proposed) > 0)) return toast.error('Enter a valid proposed price.');
    setBusy(true);
    try {
      await negotiationService.create({
        merchantId: CURRENT_MERCHANT_ID,
        productId: product.id,
        quantityKg,
        currentPrice: product.basePrice,
        proposedPrice: Number(proposed),
        currency: product.baseCurrency,
        desiredDeliveryDate: date || new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
        message: message || `Requesting ${product.baseCurrency} ${proposed}/KG for ${quantityKg.toLocaleString()} KG.`,
      });
      toast.success('Negotiation request sent.');
      onClose();
      navigate('/merchant/negotiations');
    } catch {
      toast.error('Could not send negotiation.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Request negotiation — ${product.nameEn}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? 'Sending…' : 'Send request'}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-lg bg-ink-50 p-3 text-sm">
          Current price:{' '}
          <span className="font-semibold text-ink-800">
            {formatMoney(product.basePrice, product.baseCurrency, { unit: 'KG' })}
          </span>
        </div>
        <Field label="Quantity" required>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              step={unit === 'TON' ? 0.1 : 50}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-32"
            />
            <SegmentedControl
              value={unit}
              onChange={(u) => setUnit(u as QuantityUnit)}
              size="sm"
              options={[{ value: 'KG', label: 'KG' }, { value: 'TON', label: 'TON' }]}
            />
          </div>
          <span className="mt-1 block text-xs text-ink-500">
            = {quantityKg.toLocaleString()} KG · MOQ {product.moqKg.toLocaleString()} KG
          </span>
        </Field>
        <Field label={`Proposed price (${product.baseCurrency} / KG)`} required>
          <Input type="number" min={0} step={0.5} value={proposed} onChange={(e) => setProposed(e.target.value)} />
        </Field>
        <Field label="Desired delivery date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Message">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add context for the Fleasea team…"
          />
        </Field>
      </form>
    </Modal>
  );
}
