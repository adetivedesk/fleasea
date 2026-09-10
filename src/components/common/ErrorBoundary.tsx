import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface State {
  error: Error | null;
}

/** Catches render errors so a single broken screen never white-screens the app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('Fleasea render error:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-card">
          <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
          <h1 className="mt-3 text-lg font-bold text-ink-900">Something went wrong on this screen</h1>
          <p className="mt-2 text-sm text-ink-500">
            The prototype hit an unexpected error. Reloading usually fixes it; if not, use
            “Reset Demo Data” in the top bar.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
