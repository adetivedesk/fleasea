import { ShieldCheck } from 'lucide-react';
import { DEFAULT_USERS } from '@/data/users';
import { ROLES, roleById } from '@/data/roles';
import { useApp } from '@/store/AppContext';
import { formatDateTime } from '@/utils/format';
import { Badge, Card, CardBody, CardHeader, PageHeader, SegmentedControl } from '@/components/ui';

export function AdminUsersPage() {
  const { adminRole, setAdminRole } = useApp();

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Console users and what each role can access. Frontend visibility only — real permissions are a V2 backend concern."
      />

      <Card className="mb-6">
        <CardHeader title={<span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Preview console as role</span>} />
        <CardBody>
          <SegmentedControl
            value={adminRole}
            onChange={setAdminRole}
            options={ROLES.map((r) => ({ value: r.id, label: r.name }))}
          />
          <p className="mt-2 text-sm text-ink-500">{roleById(adminRole).description}</p>
          <p className="mt-1 text-xs text-ink-400">The sidebar navigation updates immediately to match the selected role.</p>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <Card key={r.id} className="p-4">
            <p className="font-semibold text-ink-900">{r.name}</p>
            <p className="mt-1 text-xs text-ink-500">{r.description}</p>
            <p className="mt-2 text-xs text-ink-400">
              {r.nav === '*' ? 'All areas' : `${r.nav.length} areas`}
            </p>
          </Card>
        ))}
      </div>

      <h2 className="mb-2 mt-8 text-sm font-semibold text-ink-700">Console users</h2>
      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Last active</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_USERS.map((u) => (
              <tr key={u.id} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-3 font-medium text-ink-800">{u.name}</td>
                <td className="px-4 py-3 text-ink-600">{u.email}</td>
                <td className="px-4 py-3"><Badge tone="brand">{roleById(u.roleId).name}</Badge></td>
                <td className="px-4 py-3 text-xs text-ink-500">{formatDateTime(u.lastActiveAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Inactive'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
