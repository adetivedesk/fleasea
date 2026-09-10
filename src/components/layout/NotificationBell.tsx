import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useApp } from '@/store/AppContext';
import { relativeDay } from '@/utils/format';
import type { DemoRole, Notification } from '@/types';
import { cn } from '@/utils/cn';

export function NotificationBell({ role, to }: { role: DemoRole; to: string }) {
  const { demoRole } = useApp();
  const effectiveRole = role ?? demoRole;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = () => {
    void notificationService.listFor(effectiveRole).then(setItems);
  };
  useEffect(refresh, [effectiveRole, open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-300 bg-white text-ink-600 hover:bg-ink-50"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -end-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-panel">
          <div className="flex items-center justify-between border-b border-ink-200 px-3 py-2">
            <span className="text-sm font-semibold text-ink-800">Notifications</span>
            {unread > 0 && (
              <button
                className="text-xs font-medium text-brand-700 hover:underline"
                onClick={async () => { await notificationService.markAllRead(effectiveRole); refresh(); }}
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 divide-y divide-ink-100 overflow-y-auto">
            {items.slice(0, 6).map((n) => (
              <li key={n.id} className={cn('px-3 py-2.5', !n.read && 'bg-brand-50/40')}>
                <p className="text-sm font-medium text-ink-800">{n.title}</p>
                <p className="line-clamp-2 text-xs text-ink-500">{n.body}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">{relativeDay(n.createdAt)}</p>
              </li>
            ))}
            {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-400">You're all caught up.</li>}
          </ul>
          <Link
            to={to}
            onClick={() => setOpen(false)}
            className="block border-t border-ink-200 px-3 py-2 text-center text-sm font-medium text-brand-700 hover:bg-ink-50"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
