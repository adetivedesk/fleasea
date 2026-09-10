import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { recordPayment, type PaymentOutcome } from '@/services/checkoutService';
import { formatMoney } from '@/utils/currency';
import type { Payment } from '@/types';
import { Modal, Button, Field, Select, useToast } from '@/components/ui';

const METHODS: Array<{ value: Payment['method']; label: string }> = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'online', label: 'Online Payment' },
  { value: 'other', label: 'Other' },
];

const OUTCOMES: Array<{ value: PaymentOutcome; label: string }> = [
  { value: 'success', label: 'Payment successful' },
  { value: 'pending', label: 'Payment pending' },
  { value: 'failed', label: 'Payment failed' },
];

/** Frontend-only payment simulator (spec §21). No real gateway. */
export function PaymentSimulator({
  payment,
  open,
  onClose,
  onDone,
}: {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const toast = useToast();
  const [method, setMethod] = useState<Payment['method']>('bank_transfer');
  const [outcome, setOutcome] = useState<PaymentOutcome>('success');
  const [busy, setBusy] = useState(false);

  if (!payment) return null;

  const pay = async () => {
    setBusy(true);
    try {
      await recordPayment(payment.id, method, outcome);
      toast[outcome === 'failed' ? 'error' : 'success'](
        outcome === 'success'
          ? 'Payment completed.'
          : outcome === 'pending'
            ? 'Payment marked as pending.'
            : 'Payment failed. Please try again.',
      );
      onDone();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pay ${payment.portion} — ${payment.orderNumber}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button icon={CreditCard} onClick={pay} disabled={busy}>
            {busy ? 'Processing…' : `Pay ${formatMoney(payment.amount, payment.currency)}`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-ink-50 p-3 text-sm">
          Amount due:{' '}
          <span className="font-semibold text-ink-900">{formatMoney(payment.amount, payment.currency)}</span>
          <span className="ms-2 text-ink-400">({payment.portion})</span>
        </div>
        <Field label="Payment method">
          <Select value={method} onChange={(e) => setMethod(e.target.value as Payment['method'])} options={METHODS} />
        </Field>
        <Field label="Simulated result" hint="Prototype only — choose the outcome to test the workflow.">
          <Select value={outcome} onChange={(e) => setOutcome(e.target.value as PaymentOutcome)} options={OUTCOMES} />
        </Field>
      </div>
    </Modal>
  );
}
