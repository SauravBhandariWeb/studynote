import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function FullPageSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Spinner className="w-8 h-8 text-blue-600" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-32 bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-red-500">!</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
