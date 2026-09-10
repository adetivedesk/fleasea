import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-ink-500', className)}>
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-white/60 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 text-ink-400">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      {body && <p className="max-w-sm text-sm text-ink-500">{body}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  body,
  action,
}: {
  title?: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertTriangle className="h-7 w-7 text-red-500" />
      <p className="text-sm font-semibold text-red-800">{title}</p>
      {body && <p className="max-w-sm text-sm text-red-600">{body}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
