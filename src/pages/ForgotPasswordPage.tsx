import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Youtube,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast('Reset instructions sent if account exists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#060a13] text-white">
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

        <main className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_500px]">

            {/* LEFT SIDE */}
            <section className="max-w-2xl">
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
                Get back to
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
                  learning
                </span>

                <br />

                <span className="text-white">
                  faster.
                </span>
              </h1>

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
                Securely recover your account and get back to your
                notes, lectures and organized knowledge.
              </p>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
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

            {/* RIGHT SIDE */}
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

              <div className="mb-7 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />

                <div className="ml-auto h-2 w-20 rounded-full bg-white/[0.06]" />
              </div>

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
                  Account recovery
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Check your email
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  We sent reset instructions if an account exists.
                </p>
              </div>

              <div className="py-6 text-center">
                <div
                  className="
                    mx-auto
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-400/10
                    bg-emerald-400/[0.08]
                  "
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>

                <p className="text-sm leading-6 text-slate-400">
                  If an account exists for{' '}
                  <span className="font-semibold text-white">
                    {email}
                  </span>
                  , you'll receive an email with a link to reset your
                  password. The link expires in 1 hour.
                </p>

                <Link
                  to="/login"
                  className="
                    group
                    relative
                    mt-7
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
                  "
                >
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

                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
         
                </Link>
              </div>

              <div
                className="
                  mt-7
                  flex
                  items-center
                  justify-center
                  gap-2
                  border-t
                  border-white/[0.06]
                  pt-6
                  text-[11px]
                  text-slate-600
                "
              >
                <ShieldCheck className="h-3.5 w-3.5" />
               
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060a13] text-white">
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

      <main className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_500px]">

          {/* LEFT SIDE */}
          <section className="max-w-2xl">
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
              Your learning
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
                is waiting
              </span>

              <br />

              <span className="text-white">
                for you.
              </span>
            </h1>

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
              Get back into your learning workspace and continue
              where you left off.
            </p>

            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
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
                 
                </p>
              </div>

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

          {/* RIGHT SIDE */}
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

            <div className="mb-7 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />

              <div className="ml-auto h-2 w-20 rounded-full bg-white/[0.06]" />
            </div>

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
                Account recovery
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Forgot password?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your email and we'll send you reset instructions.
              </p>
            </div>

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

                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="you@example.com"
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

                    Sending...
                  </>
                ) : (
                  <>
                    Send reset instructions

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
               
              </div>
            </form>

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
                Remember your password?
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