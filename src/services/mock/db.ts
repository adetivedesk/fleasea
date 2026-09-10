/**
 * Tiny localStorage-backed "database" for mock services (spec §48, §53).
 * Each service reads/writes its own key. Later phases seed real data here;
 * Phase 1 only wires the plumbing.
 */
import { storage } from '@/utils/storage';

export function readCollection<T>(key: string, seed: () => T[]): T[] {
  const existing = storage.get<T[] | null>(key, null);
  if (existing) return existing;
  const seeded = seed();
  storage.set(key, seeded);
  return seeded;
}

export function writeCollection<T>(key: string, rows: T[]): T[] {
  storage.set(key, rows);
  return rows;
}

/** Simulate async latency so components can exercise loading states. */
export function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
