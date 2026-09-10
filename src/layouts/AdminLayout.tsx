import { Outlet } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AccessGate } from '@/components/common/AccessGate';
import { ADMIN_NAV } from '@/routes/navigation';

export function AdminLayout() {
  const { demoRole } = useApp();

  if (demoRole !== 'admin') {
    return (
      <AccessGate
        titleKey="access.adminRequired.title"
        bodyKey="access.adminRequired.body"
      />
    );
  }

  return (
    <DashboardShell nav={ADMIN_NAV} area="admin">
      <Outlet />
    </DashboardShell>
  );
}
