import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TimelineStep {
  label: string;
  at?: string;
  note?: string;
  state: 'done' | 'current' | 'todo';
}

export function StepTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-4 ps-6">
      <span className="absolute inset-y-1 start-[9px] w-px bg-ink-200" aria-hidden />
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span
            className={cn(
              'absolute -start-6 top-0.5 grid h-[19px] w-[19px] place-items-center rounded-full border-2 text-white',
              s.state === 'done' && 'border-brand-600 bg-brand-600',
              s.state === 'current' && 'border-brand-600 bg-white',
              s.state === 'todo' && 'border-ink-300 bg-white',
            )}
          >
            {s.state === 'done' && <Check className="h-3 w-3" />}
            {s.state === 'current' && <span className="h-2 w-2 rounded-full bg-brand-600" />}
          </span>
          <p
            className={cn(
              'text-sm font-medium',
              s.state === 'todo' ? 'text-ink-400' : 'text-ink-800',
            )}
          >
            {s.label}
          </p>
          {s.at && <p className="text-xs text-ink-400">{s.at}</p>}
          {s.note && <p className="mt-0.5 text-xs text-ink-500">{s.note}</p>}
        </li>
      ))}
    </ol>
  );
}
