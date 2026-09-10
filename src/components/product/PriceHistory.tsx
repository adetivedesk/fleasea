import type { PricePoint } from '@/types';
import { formatDate, formatPercent } from '@/utils/format';
import { formatMoney } from '@/utils/currency';
import { cn } from '@/utils/cn';

function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 240;
  const h = 48;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - ((p - min) / span) * h}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full" preserveAspectRatio="none">
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="currentColor" className="text-brand-100" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} className="text-brand-600" />
    </svg>
  );
}

/** Price history preview (spec §33) — chronological oldest→newest for the chart. */
export function PriceHistory({ history }: { history: PricePoint[] }) {
  const chron = [...history].reverse();
  return (
    <div>
      <div className="text-brand-600">
        <Sparkline points={chron.map((p) => p.price)} />
      </div>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
            <th className="py-1.5 font-medium">Date</th>
            <th className="py-1.5 font-medium">Price</th>
            <th className="py-1.5 font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {history.map((p) => (
            <tr key={p.date} className="border-b border-ink-100 last:border-0">
              <td className="py-1.5 text-ink-600">{formatDate(p.date)}</td>
              <td className="py-1.5 font-medium text-ink-800">{formatMoney(p.price, p.currency, { unit: 'KG' })}</td>
              <td
                className={cn(
                  'py-1.5 font-medium',
                  p.changePct > 0 ? 'text-emerald-600' : p.changePct < 0 ? 'text-red-600' : 'text-ink-400',
                )}
              >
                {formatPercent(p.changePct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
