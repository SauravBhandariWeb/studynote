import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const NOTIFICATIONS_STORAGE_KEY =
  'studynote_notifications';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(() => {
      const saved = localStorage.getItem(
        NOTIFICATIONS_STORAGE_KEY,
      );

      return saved === null
        ? true
        : saved === 'true';
    });

  /*
   * Dark mode
   */
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      darkMode,
    );

    localStorage.setItem(
      'theme',
      darkMode ? 'dark' : 'light',
    );
  }, [darkMode]);

  /*
   * Notification toggle
   *
   * State + localStorage + toast are handled together
   * from the user click, so there is only one toast.
   */
  const handleNotificationsToggle = () => {
    const next = !notificationsEnabled;

    setNotificationsEnabled(next);

    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      String(next),
    );

    toast(
      next
        ? 'Notifications enabled'
        : 'Notifications disabled',
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : 'Failed to sign out',
        'error',
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-6 transition-colors dark:bg-[#070b14] sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />

        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-500/5" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl">
        {/* Main glass container */}
        <div className="rounded-3xl border border-white/60 bg-white/55 p-4 shadow-2xl shadow-slate-300/30 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-black/20 sm:p-6 lg:p-8">
          <PageHeader
            title="Settings"
            subtitle="Manage your preferences and account"
          />

          <div className="mt-8 space-y-5">
            {/* Preferences */}
            <section className="overflow-hidden rounded-2xl border border-white/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.035]">
              <div className="border-b border-slate-200/60 px-5 py-4 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                    Preferences
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Customize how your study workspace behaves
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200/60 dark:divide-white/[0.06]">
                {/* Notifications */}
                <div className="group flex items-center justify-between px-5 py-5 transition-colors hover:bg-white/50 dark:hover:bg-white/[0.025]">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        border border-slate-200/70
                        bg-white/70
                        shadow-sm
                        dark:border-white/[0.08]
                        dark:bg-white/[0.05]
                      "
                    >
                      <Bell
                        className="
                          h-[18px] w-[18px]
                          text-slate-600
                          dark:text-slate-300
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {notificationsEnabled
                          ? 'Study alarms and important updates are enabled'
                          : 'Study alarms and browser notifications are disabled'}
                      </p>
                    </div>
                  </div>

                  <label className="relative ml-4 inline-flex shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notificationsEnabled}
                      onChange={
                        handleNotificationsToggle
                      }
                    />

                    <div
                      className="
                        h-6 w-11
                        rounded-full
                        border border-slate-300/60
                        bg-slate-200/80
                        shadow-inner
                        transition-all duration-300
                        peer-checked:border-blue-500/30
                        peer-checked:bg-blue-600
                        peer-focus:ring-4
                        peer-focus:ring-blue-500/10
                        after:absolute
                        after:left-[3px]
                        after:top-[3px]
                        after:h-[18px]
                        after:w-[18px]
                        after:rounded-full
                        after:bg-white
                        after:shadow-md
                        after:transition-all
                        after:duration-300
                        peer-checked:after:translate-x-5
                        dark:border-white/10
                        dark:bg-white/10
                      "
                    />
                  </label>
                </div>

                {/* Dark Mode */}
                <div className="group flex items-center justify-between px-5 py-5 transition-colors hover:bg-white/50 dark:hover:bg-white/[0.025]">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.05]">
                      {darkMode ? (
                        <Moon className="h-[18px] w-[18px] text-indigo-500 dark:text-indigo-300" />
                      ) : (
                        <Sun className="h-[18px] w-[18px] text-amber-500" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Dark mode
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {darkMode
                          ? 'Dark theme is currently enabled'
                          : 'Use a bright and clean appearance'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle dark mode"
                    onClick={() =>
                      setDarkMode(
                        (prev) => !prev,
                      )
                    }
                    className={`relative ml-4 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-300 ${
                      darkMode
                        ? 'border-blue-500/30 bg-blue-600 shadow-lg shadow-blue-500/20'
                        : 'border-slate-300/60 bg-slate-200/80 dark:border-white/10 dark:bg-white/10'
                    }`}
                  >
                    <span
                      className={`h-[18px] w-[18px] rounded-full bg-white shadow-md transition-transform duration-300 ${
                        darkMode
                          ? 'translate-x-5'
                          : 'translate-x-[3px]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Account */}
            <section className="overflow-hidden rounded-2xl border border-red-200/50 bg-white/60 shadow-sm backdrop-blur-xl dark:border-red-400/[0.08] dark:bg-white/[0.035]">
              <div className="border-b border-red-100/60 px-5 py-4 dark:border-red-400/[0.06]">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                  Account
                </h3>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Manage your account session
                </p>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200/60 bg-red-50/70 shadow-sm dark:border-red-400/10 dark:bg-red-500/10">
                      <LogOut className="h-[18px] w-[18px] text-red-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Sign out
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Sign out of your current session
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLogout(true)
                    }
                    className="
                      ml-4
                      rounded-xl
                      border border-red-200/80
                      bg-red-50/70
                      px-4 py-2
                      text-sm font-medium
                      text-red-600
                      shadow-sm
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-red-300
                      hover:bg-red-100
                      hover:shadow-md
                      active:translate-y-0
                      dark:border-red-400/10
                      dark:bg-red-500/10
                      dark:text-red-400
                      dark:hover:bg-red-500/15
                    "
                  >
                    Sign out
                  </button>
                </div>

                <div className="mt-5 rounded-xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                    Signed in as{' '}
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {user?.email}
                    </span>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showLogout}
        onClose={() =>
          setShowLogout(false)
        }
        onConfirm={handleLogout}
        title="Sign out?"
        message="You'll need to sign in again to access your notes."
        confirmLabel="Sign out"
        danger
      />
    </div>
  );
}