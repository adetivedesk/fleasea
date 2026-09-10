/** Admin sub-roles and their console access (spec §41). Frontend visibility only. */
export interface RoleDef {
  id: string;
  name: string;
  description: string;
  /** ADMIN_NAV `to` paths this role may see. '*' = everything. */
  nav: string[] | '*';
}

export const ROLES: RoleDef[] = [
  { id: 'super', name: 'Super Admin', description: 'Full access to every area of the console.', nav: '*' },
  {
    id: 'sales',
    name: 'Sales / Admin',
    description: 'Products, pricing, merchants, negotiations and orders.',
    nav: ['/admin', '/admin/products', '/admin/pricing', '/admin/merchants', '/admin/negotiations', '/admin/orders', '/admin/notifications'],
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Inventory, shipments and delivery.',
    nav: ['/admin', '/admin/inventory', '/admin/shipments', '/admin/delivery', '/admin/notifications'],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Payments, invoices and financial reports.',
    nav: ['/admin', '/admin/payments', '/admin/orders', '/admin/reports', '/admin/settings/currencies', '/admin/notifications'],
  },
];

export const roleById = (id: string): RoleDef => ROLES.find((r) => r.id === id) ?? ROLES[0];

export const canSeeNav = (roleId: string, to: string): boolean => {
  const role = roleById(roleId);
  return role.nav === '*' || role.nav.includes(to);
};
