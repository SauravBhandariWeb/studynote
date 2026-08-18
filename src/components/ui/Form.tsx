import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'primary',
  loading = false,
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : variant === 'danger'
          ? 'btn-danger'
          : 'btn-ghost';

  const sizeClass = size === 'sm' ? ' px-3 py-1.5 text-xs' : '';

  return (
    <button
      className={`${baseClass}${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={`input-field ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea className={`input-field resize-none ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <select className={`input-field cursor-pointer ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Badge({
  children,
  color = 'blue',
}: {
  children: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'slate' | 'purple';
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-slate-200 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
