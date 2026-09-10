import { useMemo, useState } from 'react';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { notificationService } from '@/services/notificationService';
import { useApp } from '@/store/AppContext';
import { relativeDay, formatTime } from '@/utils/format';
import {
  Button, Card, EmptyState, LoadingState, PageHeader, SegmentedControl,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import type { DemoRole } from '@/types';

export function NotificationsPage({ role }: { role: DemoRole }) {
  const { demoRole } = useApp();
  const effectiveRole = role ?? demoRole;
  const { data, loading, reload } = useAsync(() => notificationService.listFor(effectiveRole), [effectiveRole]);
  const [filter, setFilter] = useState('all');

  const rows = useMemo(() => {
    const list = data ?? [];
    if (filter === 'unread') return list.filter((n) => !n.read);
    return list;
  }, [data, filter]);

  if (loading) return <LoadingState />;
  const unread = (data ?? []).filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "You're all caught up."}
        actions={
          unread > 0 ? (
            <Button
              variant="secondary"
              icon={CheckCheck}
              onClick={async () => { await notificationService.markAllRead(effectiveRole); reload(); }}
            >
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[{ value: 'all', label: 'All' }, { value: 'unread', label: `Unread (${unread})` }]}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={BellOff} title="You're all caught up." body="No notifications to show." />
      ) : (
        <Card>
          <ul className="divide-y divide-ink-100">
            {rows.map((n) => (
              <li key={n.id} className={cn('flex gap-3 p-4', !n.read && 'bg-brand-50/40')}>
                <span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full', n.read ? 'bg-ink-100 text-ink-400' : 'bg-brand-100 text-brand-700')}>
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="text-sm text-ink-600">{n.body}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{relativeDay(n.createdAt)} · {formatTime(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={async () => { await notificationService.markRead(n.id); reload(); }}
                    className="inline-flex items-center gap-1 self-start rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-ink-50"
                  >
                    <Check className="h-3 w-3" /> Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
