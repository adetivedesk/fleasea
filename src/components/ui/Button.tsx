import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 border border-transparent',
  secondary: 'bg-white text-brand-800 border border-brand-200 hover:bg-brand-50',
  outline: 'bg-transparent text-ink-700 border border-ink-300 hover:bg-ink-50',
  ghost: 'bg-transparent text-ink-600 border border-transparent hover:bg-ink-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { to?: undefined };
type ButtonAsLink = BaseProps & { to: string; external?: boolean };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseCls =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const cls = cn(
    baseCls,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const inner = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      {children}
      {IconRight && <IconRight className="h-4 w-4 shrink-0 flip-x" aria-hidden />}
    </>
  );

  if ('to' in props && props.to !== undefined) {
    const { external, to } = props as ButtonAsLink;
    if (external) {
      return (
        <a className={cls} href={to} target="_blank" rel="noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link className={cls} to={to}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={cls}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
});
