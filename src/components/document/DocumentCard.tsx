import { FileText, Lock, Download } from 'lucide-react';
import type { FleaseaDocument } from '@/types';
import { formatDate } from '@/utils/format';
import { useToast } from '@/components/ui';
import { cn } from '@/utils/cn';

const TYPE_LABEL: Record<FleaseaDocument['type'], string> = {
  order_confirmation: 'Order confirmation',
  invoice: 'Invoice',
  shipment_document: 'Shipment document',
  delivery_note: 'Delivery note',
  proof_of_delivery: 'Proof of delivery',
  payment_receipt: 'Payment receipt',
};

export function DocumentCard({ doc }: { doc: FleaseaDocument }) {
  const toast = useToast();
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3',
        doc.locked ? 'border-ink-200 bg-ink-50' : 'border-ink-200 bg-white',
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
          doc.locked ? 'bg-ink-200 text-ink-500' : 'bg-brand-50 text-brand-600',
        )}
      >
        {doc.locked ? <Lock className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-800">{doc.title}</p>
        <p className="text-xs text-ink-400">
          {TYPE_LABEL[doc.type]} · {doc.orderNumber} · {formatDate(doc.issuedAt)}
        </p>
        {doc.locked && doc.lockReason && (
          <p className="mt-1 text-xs text-amber-700">{doc.lockReason}</p>
        )}
      </div>
      <button
        disabled={doc.locked}
        onClick={() => toast.success(`${doc.title} downloaded (demo).`)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
          doc.locked
            ? 'cursor-not-allowed border-ink-200 text-ink-300'
            : 'border-ink-300 text-ink-700 hover:bg-ink-50',
        )}
      >
        <Download className="h-3.5 w-3.5" /> {doc.locked ? 'Locked' : 'Download'}
      </button>
    </div>
  );
}
