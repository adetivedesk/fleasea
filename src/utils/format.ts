export const formatDate = (iso: string, locale = 'en-US'): string =>
  new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

export const formatDateTime = (iso: string, locale = 'en-US'): string =>
  new Date(iso).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatTime = (iso: string, locale = 'en-US'): string =>
  new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

export const relativeDay = (iso: string): string => {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.round((d.getTime() - new Date(today.toDateString()).getTime()) / 86_400_000);
  if (diff === 0) return 'today';
  if (diff === -1) return 'yesterday';
  if (diff === 1) return 'tomorrow';
  return formatDate(iso);
};

export const formatPercent = (pct: number): string =>
  `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;

/** Title-case a SCREAMING_SNAKE status for display. */
export const humanizeStatus = (s: string): string =>
  s
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/** Minimal HTML-escaping for any free-text we echo back (spec §59). */
export const sanitizeText = (s: string): string =>
  s.replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'));
