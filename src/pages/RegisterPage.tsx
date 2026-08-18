import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Youtube,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // -----------------------------
    // Name validation
    // -----------------------------

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    // -----------------------------
    // Email validation
    // -----------------------------

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // -----------------------------
    // Password validation
    // -----------------------------

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // -----------------------------
    // Confirm password
    // -----------------------------

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // -----------------------------
      // Register user
      // -----------------------------

      await register(cleanName, cleanEmail, password);

      // Only runs if registration succeeds
      toast('Account created successfully!');

      navigate('/dashboard', {
        replace: true,
      });
    } catch (err: any) {
      console.error('REGISTER ERROR:', err);

      /*
       * Depending on your authApi implementation,
       * error information may be available in different places.
       */

      const status =
        err?.response?.status ??
        err?.status ??
        null;

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '';

      // -----------------------------
      // Already exists
      // -----------------------------

      if (status === 409) {
        setError(
          'An account with this email already exists. Please sign in instead.'
        );
        return;
      }

      // -----------------------------
      // Bad request
      // -----------------------------

      if (status === 400) {
        setError(
          backendMessage ||
            'Please check your details and try again.'
        );
        return;
      }

      // -----------------------------
      // Unauthorized
      // -----------------------------

      if (status === 401) {
        setError(
          'Registration was not authorized. Please try again.'
        );
        return;
      }

      // -----------------------------
      // Validation error
      // -----------------------------

      if (status === 422) {
        setError(
          backendMessage ||
            'Please enter valid registration details.'
        );
        return;
      }

      // -----------------------------
      // Server error
      // -----------------------------

      if (status && status >= 500) {
        setError(
          'Something went wrong on the server. Please try again.'
        );
        return;
      }

      // -----------------------------
      // Generic error
      // -----------------------------

      setError(
        backendMessage ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060a13] text-white">

      {/* Background grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
          [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      {/* Top ambient gradient */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[550px]
          w-[550px]
          rounded-full
          bg-violet-600/10
          blur-[130px]
        "
      />

      {/* Main */}
      <main className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">

        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_500px]">

          {/* ================================================== */}
          {/* LEFT SIDE */}
          {/* ================================================== */}

          <section className="max-w-2xl">

            {/* Badge */}
            <div
              className="
                mb-8
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-400/20
                bg-blue-500/[0.07]
                px-4
                py-2
                text-xs
                font-semibold
                text-blue-300
                backdrop-blur-xl
              "
            >
              <Youtube className="h-3.5 w-3.5" />

              Built for serious learners

              <ArrowRight className="ml-1 h-3.5 w-3.5 text-blue-400" />
            </div>

            {/* Heading */}
            <h1
              className="
                text-5xl
                font-black
                leading-[0.98]
                tracking-[-0.045em]
                sm:text-6xl
                lg:text-[76px]
              "
            >
              Create your
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-500
                  via-indigo-500
                  to-violet-500
                  bg-clip-text
                  text-transparent
                "
              >
                knowledge
              </span>

              <br />

              <span className="text-white">
                workspace.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-xl
                text-base
                leading-7
                text-slate-400
                sm:text-lg
              "
            >
              Turn every lecture into organized knowledge you
              can actually keep. Capture notes, timestamps and
              important concepts in one focused workspace.
            </p>

            {/* Feature cards */}
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">

              {/* Organize */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                  backdrop-blur-xl
                "
              >
                <BookOpen className="mb-3 h-5 w-5 text-blue-400" />

                <p className="text-sm font-semibold text-white">
                  Organize
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Keep everything structured
                </p>
              </div>

              {/* Capture */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                  backdrop-blur-xl
                "
              >
                <Youtube className="mb-3 h-5 w-5 text-violet-400" />

                <p className="text-sm font-semibold text-white">
                  Capture
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Save what actually matters
                </p>
              </div>

              {/* Learn */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                  backdrop-blur-xl
                "
              >
                <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />

                <p className="text-sm font-semibold text-white">
                  Learn
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Revise without the noise
                </p>
              </div>

            </div>
          </section>

          {/* ================================================== */}
          {/* RIGHT SIDE */}
          {/* ================================================== */}

          <section
            className="
              relative
              rounded-[28px]
              border
              border-white/[0.08]
              bg-[#0c1321]/90
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
              sm:p-8
            "
          >

            {/* Card top glow */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-px
                w-2/3
                -translate-x-1/2
                bg-gradient-to-r
                from-transparent
                via-blue-500
                to-transparent
                opacity-80
              "
            />

            {/* Window dots */}
            <div className="mb-7 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />

              <div className="ml-auto h-2 w-20 rounded-full bg-white/[0.06]" />
            </div>

            {/* Header */}
            <div className="mb-7">

              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.035]
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-slate-400
                "
              >
                <Youtube className="h-3.5 w-3.5 text-blue-400" />

                Start learning smarter
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start turning lectures into organized knowledge.
              </p>

            </div>

            {/* ================================================== */}
            {/* ERROR */}
            {/* ================================================== */}

            {error && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/[0.07]
                  px-4
                  py-3
                  text-sm
                  text-red-300
                "
              >
                <div className="flex items-start gap-3">

                  <div
                    className="
                      mt-0.5
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500/15
                      text-[11px]
                      font-bold
                      text-red-300
                    "
                  >
                    !
                  </div>

                  <p className="leading-5">
                    {error}
                  </p>

                </div>
              </div>
            )}

            {/* ================================================== */}
            {/* FORM */}
            {/* ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold text-slate-400"
                >
                  Full name
                </label>

                <div className="group relative">

                  <User
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-[17px]
                      w-[17px]
                      -translate-y-1/2
                      text-slate-600
                      transition-colors
                      group-focus-within:text-blue-400
                    "
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      placeholder:text-slate-600
                      hover:border-white/[0.13]
                      focus:border-blue-500/60
                      focus:bg-white/[0.04]
                      focus:ring-4
                      focus:ring-blue-500/[0.08]
                    "
                  />

                </div>
              </div>

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-slate-400"
                >
                  Email address
                </label>

                <div className="group relative">

                  <Mail
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-[17px]
                      w-[17px]
                      -translate-y-1/2
                      text-slate-600
                      transition-colors
                      group-focus-within:text-blue-400
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    autoComplete="email"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      placeholder:text-slate-600
                      hover:border-white/[0.13]
                      focus:border-blue-500/60
                      focus:bg-white/[0.04]
                      focus:ring-4
                      focus:ring-blue-500/[0.08]
                    "
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-slate-400"
                >
                  Password
                </label>

                <div className="group relative">

                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-[17px]
                      w-[17px]
                      -translate-y-1/2
                      text-slate-600
                      transition-colors
                      group-focus-within:text-blue-400
                    "
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      pl-11
                      pr-12
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      placeholder:text-slate-600
                      hover:border-white/[0.13]
                      focus:border-blue-500/60
                      focus:bg-white/[0.04]
                      focus:ring-4
                      focus:ring-blue-500/[0.08]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-600
                      transition-colors
                      hover:bg-white/[0.05]
                      hover:text-slate-300
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold text-slate-400"
                >
                  Confirm password
                </label>

                <div className="group relative">

                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-[17px]
                      w-[17px]
                      -translate-y-1/2
                      text-slate-600
                      transition-colors
                      group-focus-within:text-blue-400
                    "
                  />

                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition-all
                      placeholder:text-slate-600
                      hover:border-white/[0.13]
                      focus:border-blue-500/60
                      focus:bg-white/[0.04]
                      focus:ring-4
                      focus:ring-blue-500/[0.08]
                    "
                  />

                </div>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  relative
                  mt-2
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  via-blue-600
                  to-violet-600
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_35px_rgba(37,99,235,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_45px_rgba(37,99,235,0.3)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {/* Button shine */}
                <span
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    transition-transform
                    duration-700
                    group-hover:translate-x-full
                  "
                />

                {loading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}

              </button>

              {/* SECURITY */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  pt-2
                  text-[11px]
                  text-slate-600
                "
              >
                <ShieldCheck className="h-3.5 w-3.5" />

                Your account is securely protected
              </div>

            </form>

            {/* FOOTER */}
            <div
              className="
                mt-7
                border-t
                border-white/[0.06]
                pt-6
                text-center
                text-sm
              "
            >

              <span className="text-slate-600">
                Already have an account?
              </span>{' '}

              <Link
                to="/login"
                className="
                  font-semibold
                  text-blue-400
                  transition-colors
                  hover:text-blue-300
                "
              >
                Sign in
              </Link>

            </div>

          </section>
        </div>
      </main>
    </div>
  );
}