import React from 'react';
import { cn } from '../lib/utils';

// ---------- Button ----------

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  default:
    'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
  outline:
    'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  secondary:
    'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600',
  ghost:
    'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
};

export function Button({
  className,
  variant = 'default',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- Card ----------

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------- CardHeader ----------

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('border-b border-zinc-100 dark:border-zinc-700 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------- CardContent ----------

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

// ---------- Badge ----------

type BadgeVariant = 'default' | 'neutral' | 'pass' | 'warning' | 'fail';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  neutral:
    'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',
  pass:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  warning:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  fail:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
};

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
