/** notificationService (spec §43, §48). */
import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_NOTIFICATIONS } from '@/data/notifications';
import { readCollection, writeCollection, delay } from './mock/db';
import { uid } from '@/utils/id';
import type { DemoRole, Notification } from '@/types';

const KEY = STORAGE_KEYS.NOTIFICATIONS;
const all = () => readCollection<Notification>(KEY, () => DEFAULT_NOTIFICATIONS);

const visibleTo = (n: Notification, role: DemoRole) => n.audience === 'all' || n.audience === role;

export const notificationService = {
  listFor(role: DemoRole): Promise<Notification[]> {
    return delay(
      all()
        .filter((n) => visibleTo(n, role))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },
  unreadCount(role: DemoRole): number {
    return all().filter((n) => visibleTo(n, role) && !n.read).length;
  },
  push(audience: Notification['audience'], type: string, title: string, body: string): Notification {
    const n: Notification = {
      id: uid('nt'),
      audience,
      type,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const rows = all();
    rows.unshift(n);
    writeCollection(KEY, rows);
    return n;
  },
  markRead(id: string): Promise<Notification[]> {
    return delay(writeCollection(KEY, all().map((n) => (n.id === id ? { ...n, read: true } : n))));
  },
  markAllRead(role: DemoRole): Promise<Notification[]> {
    return delay(
      writeCollection(KEY, all().map((n) => (visibleTo(n, role) ? { ...n, read: true } : n))),
    );
  },
};
