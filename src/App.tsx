import { useI18n } from '@/i18n';
import { PrototypeBar } from '@/components/prototype/PrototypeBar';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  const { dir } = useI18n();

  return (
    <div dir={dir} className="min-h-screen">
      <ScrollToTop />
      {/* PROTOTYPE-ONLY chrome — remove with real auth (spec §52) */}
      <PrototypeBar />
      <AppRoutes />
    </div>
  );
}
