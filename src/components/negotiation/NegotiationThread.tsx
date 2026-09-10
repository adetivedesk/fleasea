import type { Negotiation } from '@/types';
import { formatDateTime } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import { cn } from '@/utils/cn';

/** Conversation / timeline view for a negotiation (spec §19, §35). */
export function NegotiationThread({
  negotiation,
  viewerSide,
}: {
  negotiation: Negotiation;
  viewerSide: 'merchant' | 'admin';
}) {
  return (
    <ol className="space-y-3">
      {negotiation.messages.map((m) => {
        const mine = m.author === viewerSide;
        return (
          <li key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm',
                mine ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-800',
              )}
            >
              <div className={cn('mb-0.5 text-xs font-medium', mine ? 'text-white/80' : 'text-ink-500')}>
                {m.author === 'merchant' ? 'Merchant' : 'Fleasea'}
              </div>
              {m.proposedPrice != null && (
                <div
                  className={cn(
                    'mb-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold',
                    mine ? 'bg-white/15' : 'bg-white',
                  )}
                >
                  Offer: {formatMoney(m.proposedPrice, negotiation.currency, { unit: 'KG' })}
                </div>
              )}
              <p className="whitespace-pre-wrap">{m.message}</p>
              <div className={cn('mt-1 text-[11px]', mine ? 'text-white/70' : 'text-ink-400')}>
                {formatDateTime(m.createdAt)}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
