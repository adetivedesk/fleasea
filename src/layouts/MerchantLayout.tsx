import { Outlet } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AccessGate } from '@/components/common/AccessGate';
import { MERCHANT_NAV } from '@/routes/navigation';

export function MerchantLayout() {
  const { demoRole } = useApp();

  if (demoRole === 'visitor') {
    return (
      <AccessGate
        titleKey="access.merchantRequired.title"
        bodyKey="access.merchantRequired.body"
        ctaLabelKey="access.merchantRequired.cta"
        ctaTo="/register"
      />
    );
  }

  if (demoRole === 'pending') {
    return (
      <AccessGate
        titleKey="access.pending.title"
        bodyKey="access.pending.body"
        ctaLabelKey="nav.dashboard"
        ctaTo="/merchant/application-status"
      />
    );
  }

  return (
    <DashboardShell nav={MERCHANT_NAV} area="merchant">
      <Outlet />
    </DashboardShell>
  );
}
