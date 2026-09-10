import { cn } from '@/utils/cn';

export function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus-ring',
        checked ? 'bg-brand-600' : 'bg-ink-300',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      <span
        className={cn(
          'block h-4 w-4 rounded-full bg-white transition-transform',
          checked && 'translate-x-4',
        )}
      />
    </button>
  );
}
