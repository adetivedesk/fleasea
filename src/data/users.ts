export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  active: boolean;
  lastActiveAt: string;
}

/** Demo console users (spec §41). */
export const DEFAULT_USERS: AdminUser[] = [
  { id: 'u-1', name: 'Sara Al-Amoudi', email: 'admin@fleasea.demo', roleId: 'super', active: true, lastActiveAt: '2026-09-10T09:40:00Z' },
  { id: 'u-2', name: 'Omar Khan', email: 'sales@fleasea.demo', roleId: 'sales', active: true, lastActiveAt: '2026-09-10T08:55:00Z' },
  { id: 'u-3', name: 'Huda Nassar', email: 'ops@fleasea.demo', roleId: 'operations', active: true, lastActiveAt: '2026-09-10T07:30:00Z' },
  { id: 'u-4', name: 'Tariq Bin Saleh', email: 'finance@fleasea.demo', roleId: 'finance', active: true, lastActiveAt: '2026-09-09T16:10:00Z' },
  { id: 'u-5', name: 'Noura Farsi', email: 'sales2@fleasea.demo', roleId: 'sales', active: false, lastActiveAt: '2026-08-30T12:00:00Z' },
];
