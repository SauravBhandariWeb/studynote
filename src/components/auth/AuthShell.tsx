import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">StudyNote</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Turn YouTube lectures into organized, timestamped notes.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Mark important moments, write personal notes, track your progress, and build a
              structured knowledge library.
            </p>

            <div className="mt-8 space-y-3">
              {['Timestamped notes for any video', 'Track study streaks & goals'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-blue-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-200 text-sm">Your personal YouTube lecture companion.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">StudyNote</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-600 mb-8">{subtitle}</p>

          {children}

          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
