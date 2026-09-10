import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

/** Minimal chrome for the pending-merchant experience (application status, profile). */
export function PendingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-ink-50">
        <div className="container-page py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
