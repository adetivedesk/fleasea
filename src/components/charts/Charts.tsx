import { cn } from '@/utils/cn';

/* Lightweight, dependency-free SVG charts (spec §29, §62). Readable over fancy. */

export function MiniBars({
  data,
  height = 140,
  format = (n: number) => n.toLocaleString(),
  className,
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[11px] font-medium text-ink-500">{format(d.value)}</span>
          <div
            className="w-full rounded-t bg-brand-500/85"
            style={{ height: `${(d.value / max) * (height - 40)}px`, minHeight: 2 }}
          />
          <span className="truncate text-[10px] text-ink-400" title={d.label}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MiniLine({
  points,
  labels,
  height = 140,
  format = (n: number) => n.toLocaleString(),
}: {
  points: number[];
  labels?: string[];
  height?: number;
  format?: (n: number) => string;
}) {
  if (points.length < 2) return <p className="text-sm text-ink-400">Not enough data.</p>;
  const w = 320;
  const h = height;
  const pad = 8;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  const xy = points.map((p, i) => [pad + i * step, h - pad - ((p - min) / span) * (h - pad * 2 - 16)]);
  const d = xy.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <path d={`${d} L ${xy[xy.length - 1][0]} ${h} L ${xy[0][0]} ${h} Z`} className="fill-brand-100" />
        <path d={d} fill="none" className="stroke-brand-600" strokeWidth={2} />
        {xy.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} className="fill-brand-600" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-ink-400">
        <span>{format(points[0])}</span>
        <span>{format(points[points.length - 1])}</span>
      </div>
      {labels && (
        <div className="flex justify-between text-[10px] text-ink-400">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}

const DONUT_COLORS = ['#2b7d99', '#4098b3', '#72bacd', '#a7d6e1', '#1d4457', '#f97316'];

export function MiniDonut({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = `${frac * c} ${c}`;
          const el = (
            <circle
              key={d.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={-acc * c}
            />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <ul className="space-y-1 text-xs">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-ink-600">{d.label}</span>
            <span className="font-medium text-ink-800">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
