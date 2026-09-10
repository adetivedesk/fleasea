import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export function Logo({
  to = '/',
  className,
  compact = false,
}: {
  to?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-900 text-white">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path d="M6 16c3-5 9-7 14-7l4 7-4 7c-5 0-11-2-14-7z" fill="#4098b3" />
          <circle cx="11" cy="16" r="1.5" fill="#fff" />
          <path d="M24 12l4-3v14l-4-3z" fill="#72bacd" />
        </svg>
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight text-brand-900">Fleasea</span>
      )}
    </Link>
  );
}
