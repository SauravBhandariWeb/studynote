import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  PlaySquare,
} from 'lucide-react';

import { authApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(token || '', password);

      setSuccess(true);
      toast('Password reset successfully');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px]">
        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="hidden w-1/2 flex-col justify-between px-12 py-12 lg:flex xl:px-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-white/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white"
              >
                <path
                  d="M3 8.5L12 4l9 4.5-9 4.5L3 8.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 10.2V15c0 1.7 2.7 3.5 6 3.5s6-1.8 6-3.5v-4.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tight">
              StudyNote
            </span>
          </div>

          {/* Main marketing content */}
          <div className="max-w-[650px]">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/[0.06] px-4 py-2">
              <PlaySquare className="h-4 w-4 text-blue-400" />

              <span className="text-xs font-medium text-blue-300">
                Built for serious learners
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </div>

            {/* Heading */}
            <h1 className="text-[56px] font-bold leading-[0.98] tracking-[-0.045em] xl:text-[68px]">
              Get back to
              <br />

              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
                learning
              </span>

              <br />

              faster.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-[650px] text-[17px] leading-7 text-slate-400">
              Securely recover your account and get back to your notes,
              lectures and organized knowledge.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid max-w-[620px] grid-cols-3 gap-3">
              {/* Organize */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>

                <p className="text-sm font-semibold text-white">
                  Organize
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Keep everything
                  <br />
                  structured
                </p>
              </div>

              {/* Capture */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <PlaySquare className="h-5 w-5 text-violet-400" />
                </div>

                <p className="text-sm font-semibold text-white">
                  Capture
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Save what actually
                  <br />
                  matters
                </p>
              </div>

              {/* Learn */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <p className="text-sm font-semibold text-white">
                  Learn
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Revise without
                  <br />
                  the noise
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-slate-500">
            Your personal YouTube lecture companion.
          </p>
        </div>

      
        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2 lg:px-10 xl:px-16">
          <div className="w-full max-w-[540px]">
            {/* Browser-like card */}
            <div className="rounded-[28px] border border-white/[0.09] bg-[#0b111e]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
              {/* Top browser dots */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>

                <div className="h-2 w-20 rounded-full bg-white/[0.06]" />
              </div>

              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
                <PlaySquare className="h-3.5 w-3.5 text-blue-400" />

                <span className="text-xs font-medium text-slate-400">
                  Account recovery
                </span>
              </div>

              {/* ================================================= */}
              {/* SUCCESS */}
              {/* ================================================= */}

              {success ? (
                <>
                  <h2 className="text-[28px] font-bold tracking-tight text-white">
                    Password reset
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Your password has been updated successfully.
                  </p>

                  <div className="py-10">
                    <div className="flex justify-center">
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] shadow-[0_0_35px_rgba(16,185,129,0.08)]">
                        <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                      </div>
                    </div>

                    <div className="mt-7 text-center">
                      <p className="text-sm leading-6 text-slate-400">
                        Your password has been reset successfully.
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        Redirecting you to sign in...
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                      ←
                    </span>

                    Back to sign in
                  </Link>

                  <div className="mt-8 border-t border-white/[0.06] pt-6">
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />

                      <span className="text-[11px] text-slate-600">
                        Your account is securely protected
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                

                  <h2 className="text-[28px] font-bold tracking-tight text-white">
                    Set a new password
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Create a strong password for your StudyNote account
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-red-300">
                            Unable to reset password
                          </p>

                          <p className="mt-0.5 text-xs leading-5 text-red-400/80">
                            {error}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* New password */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-400">
                        New password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          required
                          className="
                            h-12 w-full rounded-xl
                            border border-white/[0.08]
                            bg-white/[0.045]
                            pl-10 pr-11
                            text-sm text-white
                            outline-none
                            placeholder:text-slate-600
                            transition-all
                            focus:border-blue-500/50
                            focus:bg-white/[0.06]
                            focus:ring-4
                            focus:ring-blue-500/10
                          "
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] text-slate-600">
                        Use at least 6 characters for your new password.
                      </p>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-400">
                        Confirm new password
                      </label>

                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          placeholder="Repeat your password"
                          required
                          className="
                            h-12 w-full rounded-xl
                            border border-white/[0.08]
                            bg-white/[0.045]
                            pl-10
                            text-sm text-white
                            outline-none
                            placeholder:text-slate-600
                            transition-all
                            focus:border-blue-500/50
                            focus:bg-white/[0.06]
                            focus:ring-4
                            focus:ring-blue-500/10
                          "
                        />
                      </div>
                    </div>

                    {/* Security hint */}
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-300">
                          Secure password reset
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-600">
                          Your password is securely encrypted.
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        group flex w-full items-center justify-center gap-2
                        rounded-xl
                        bg-gradient-to-r from-blue-600 to-violet-600
                        py-3.5
                        text-sm font-semibold text-white
                        shadow-lg shadow-blue-500/20
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:shadow-xl hover:shadow-blue-500/25
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading ? 'Resetting...' : 'Reset password'}

                      {!loading && (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <span className="text-sm text-slate-600">
                      Remember your password?{' '}
                    </span>

                    <Link
                      to="/login"
                      className="text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Sign in
                    </Link>
                  </div>

                  {/* Security footer */}
                  <div className="mt-8 border-t border-white/[0.06] pt-6">
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />

                      <span className="text-[11px] text-slate-600">
                        Your account is securely protected
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}