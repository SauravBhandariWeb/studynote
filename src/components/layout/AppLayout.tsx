import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  StickyNote,
  FolderTree,
  Library,
  RefreshCw,
  Clock,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lectures', label: 'Lecture Library', icon: BookOpen },
  { to: '/notes', label: 'My Notes', icon: StickyNote },
  { to: '/subjects', label: 'Subjects', icon: FolderTree },
  { to: '/collections', label: 'Collections', icon: Library },
  { to: '/revision', label: 'Revision Mode', icon: RefreshCw },
  { to: '/sessions', label: 'Study Sessions', icon: Clock },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (
      path === '/lectures' &&
      location.pathname.startsWith('/lectures')
    ) {
      return true;
    }

    return location.pathname === path;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-5 dark:border-white/[0.07]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>

        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          StudyNote
        </span>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`
                group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200
                ${
                  active
                    ? `
                      bg-blue-50 text-blue-700
                      shadow-sm
                      dark:bg-blue-500/10
                      dark:text-blue-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100/80
                      hover:text-slate-900
                      dark:text-slate-400
                      dark:hover:bg-white/[0.05]
                      dark:hover:text-white
                    `
                }
              `}
            >
              {active && (
                <span className="absolute left-0 h-6 w-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}

              <Icon
                className={`
                  h-5 w-5 flex-shrink-0 transition-colors
                  ${
                    active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }
                `}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 border-t border-slate-200/70 px-3 py-4 dark:border-white/[0.07]">

        {/* Profile */}
        <Link
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 rounded-xl px-3 py-2.5
            text-sm font-medium transition-all
            ${
              location.pathname === '/profile'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
            }
          `}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span>Profile</span>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 rounded-xl px-3 py-2.5
            text-sm font-medium transition-all
            ${
              location.pathname === '/settings'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
            }
          `}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            group flex w-full items-center gap-3 rounded-xl
            px-3 py-2.5 text-left text-sm font-medium
            text-slate-600 transition-all
            hover:bg-red-50 hover:text-red-600
            dark:text-slate-400
            dark:hover:bg-red-500/10
            dark:hover:text-red-400
          "
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>

      {/* User */}
      {user && (
        <div className="border-t border-slate-200/70 px-5 py-4 dark:border-white/[0.07]">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2.5 dark:border-white/[0.07] dark:bg-white/[0.03]">
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Signed in as
            </p>

            <p className="mt-0.5 truncate text-xs font-medium text-slate-700 dark:text-slate-200">
              {user.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    
  <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* Desktop sidebar */}
      <aside
        className="
          fixed inset-y-0 left-0 z-30 hidden w-64 flex-col
          border-r border-slate-200/70
          bg-white/80
          shadow-[10px_0_40px_rgba(15,23,42,0.03)]
          backdrop-blur-2xl
          dark:border-white/[0.07]
          dark:bg-[#0b101b]/80
          dark:shadow-black/20
          lg:flex
        "
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="
              fixed inset-0 z-40
              bg-slate-950/40
              backdrop-blur-sm
              dark:bg-black/60
              lg:hidden
            "
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="
              fixed inset-y-0 left-0 z-50 w-72
              border-r border-slate-200/70
              bg-white/95
              shadow-2xl
              backdrop-blur-2xl
              dark:border-white/[0.07]
              dark:bg-[#0b101b]/95
              lg:hidden
            "
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="
                absolute right-4 top-4 rounded-lg p-2
                text-slate-500
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
                dark:text-slate-400
                dark:hover:bg-white/[0.06]
                dark:hover:text-white
              "
            >
              <X className="h-5 w-5" />
            </button>

            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="lg:pl-64">

        {/* Mobile header */}
        <header
          className="
            sticky top-0 z-30 flex items-center justify-between
            border-b border-slate-200/70
            bg-white/80
            px-4 py-3
            backdrop-blur-xl
            dark:border-white/[0.07]
            dark:bg-[#0b101b]/80
            lg:hidden
          "
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="
              rounded-xl p-2
              text-slate-600
              transition-colors
              hover:bg-slate-100
              dark:text-slate-400
              dark:hover:bg-white/[0.06]
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>

            <span className="font-bold tracking-tight text-slate-900 dark:text-white">
              StudyNote
            </span>
          </Link>

          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}