
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sizeClass =
    size === 'sm'
      ? 'max-w-md'
      : size === 'lg'
        ? 'max-w-2xl'
        : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">

      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-slate-900/50
          dark:bg-black/70
          backdrop-blur-sm
          animate-fade-in
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative
          flex
          max-h-[90vh]
          w-full
          flex-col
          ${sizeClass}

          rounded-t-2xl
          bg-white
          shadow-2xl

          dark:border
          dark:border-white/[0.08]
          dark:bg-[#111827]
          dark:shadow-[0_25px_80px_rgba(0,0,0,0.55)]

          sm:rounded-2xl
          animate-slide-up
        `}
      >

        {/* Header */}
        <div
          className="
            flex
            flex-shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-4

            dark:border-white/[0.08]
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-1.5
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-600

              dark:text-slate-400
              dark:hover:bg-white/[0.07]
              dark:hover:text-white
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-4
            scrollbar-thin

            text-slate-700
            dark:text-slate-200
          "
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="
              flex
              flex-shrink-0
              justify-end
              gap-3
              border-t
              border-slate-100
              px-5
              py-4

              dark:border-white/[0.08]
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="
              btn-secondary
              dark:border-white/[0.1]
              dark:bg-white/[0.06]
              dark:text-slate-200
              dark:hover:bg-white/[0.1]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              danger
                ? 'btn-danger'
                : 'btn-primary'
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p
        className="
          text-sm
          text-slate-600
          dark:text-slate-300
        "
      >
        {message}
      </p>
    </Modal>
  );
}

