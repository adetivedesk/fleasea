import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useI18n } from '@/i18n';
import { authService, ROLE_HOME } from '@/services/authService';
import { DEMO_ACCOUNTS } from '@/constants';
import { Button, Card, Field, Input, useToast } from '@/components/ui';
import { Logo } from '@/components/layout/Logo';

const DEMO = [
  { email: DEMO_ACCOUNTS.admin, label: 'Admin' },
  { email: DEMO_ACCOUNTS.merchant, label: 'Approved merchant' },
  { email: DEMO_ACCOUNTS.pending, label: 'Pending merchant' },
];

export function LoginPage() {
  const { setDemoRole } = useApp();
  const { t } = useI18n();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async (value: string) => {
    setBusy(true);
    try {
      const { role, label } = await authService.login(value);
      setDemoRole(role);
      toast.success(`Signed in — ${label}`);
      navigate(ROLE_HOME[role]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-bold text-ink-900">Sign in</h1>
          <p className="mt-1 text-sm text-ink-500">
            Mock authentication — any password works for demo accounts.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void signIn(email);
            }}
          >
            <Field label="Email" required>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Password" hint="Not checked in the prototype.">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" icon={LogIn} fullWidth disabled={busy}>
              {busy ? 'Signing in…' : t('nav.login')}
            </Button>
          </form>

          <div className="mt-6 border-t border-ink-200 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Quick demo sign-in
            </p>
            <div className="mt-2 grid gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  onClick={() => void signIn(d.email)}
                  disabled={busy}
                  className="flex items-center justify-between rounded-lg border border-ink-200 px-3 py-2 text-sm hover:bg-ink-50 disabled:opacity-50"
                >
                  <span className="font-medium text-ink-800">{d.label}</span>
                  <span className="text-ink-400">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500">
            No account?{' '}
            <Link to="/register" className="font-medium text-brand-700 hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
