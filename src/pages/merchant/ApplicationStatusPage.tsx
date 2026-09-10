import { Clock, FileText, Mail, PhoneCall } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useAsync } from '@/hooks/useAsync';
import { merchantService } from '@/services/merchantService';
import { DEMO_ACCOUNTS } from '@/constants';
import { formatDate } from '@/utils/format';
import { Button, Card, LoadingState, StatusBadge } from '@/components/ui';

export function ApplicationStatusPage() {
  const { setDemoRole } = useApp();
  const { data: merchant, loading } = useAsync(
    () => merchantService.getByEmail(DEMO_ACCOUNTS.pending),
    [],
  );

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-500">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ink-900">Application under review</h1>
            <p className="text-sm text-ink-500">Your merchant application is currently under review.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-ink-50 p-4 text-sm sm:grid-cols-2">
          <Row label="Company" value={merchant?.companyName ?? 'Your company'} />
          <Row
            label="Status"
            value={<StatusBadge status={merchant?.status ?? 'PENDING'} />}
          />
          <Row
            label="Submitted"
            value={merchant ? formatDate(merchant.registeredAt) : '—'}
          />
          <Row
            label="Estimated volume"
            value={
              merchant ? `${merchant.estimatedMonthlyVolumeKg.toLocaleString()} KG / month` : '—'
            }
          />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink-600">
          Our team will review your business information and documents, and contact you once your
          account is approved. Approved merchants get access to the full catalogue, live pricing,
          negotiation and wholesale ordering.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MiniCard icon={FileText} title="Documents" body={`${merchant?.documents.length ?? 0} on file`} />
          <MiniCard icon={Mail} title="Contact email" body={merchant?.contact.email ?? '—'} />
          <MiniCard icon={PhoneCall} title="Support" body="trade@fleasea.demo" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button to="/">Back to home</Button>
          <Button
            variant="secondary"
            onClick={() => setDemoRole('visitor')}
          >
            Sign out
          </Button>
        </div>

        <p className="mt-4 text-xs text-ink-400">
          Prototype tip: switch to <strong>Admin</strong> in the top bar and approve this application
          under Merchants, then sign in as the merchant.
        </p>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-0.5 font-medium text-ink-800">{value}</p>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3">
      <Icon className="h-4 w-4 text-sea-600" />
      <p className="mt-1.5 text-xs text-ink-400">{title}</p>
      <p className="truncate text-sm font-medium text-ink-800">{body}</p>
    </div>
  );
}
