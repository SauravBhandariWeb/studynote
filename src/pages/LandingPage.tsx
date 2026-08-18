import { Link } from "react-router-dom"
import {
  GraduationCap,
  Youtube,
  Clock,
  StickyNote,
  Star,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Check,
  ArrowRight,
  Play,
  Zap,
  ChevronRight,
  Layers3,
  FileText,
} from "lucide-react"

export default function LandingPage() {
  const workflow = [
    {
      icon: Youtube,
      number: "01",
      title: "Add a lecture",
      desc: "Paste any YouTube lecture and instantly add it to your personal study library.",
      iconStyle:
        "bg-red-500/10 text-red-500 dark:bg-red-500/10 dark:text-red-400",
    },
    {
      icon: Clock,
      number: "02",
      title: "Capture moments",
      desc: "Save the exact moment something important is explained with a timestamp.",
      iconStyle:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      icon: StickyNote,
      number: "03",
      title: "Write your notes",
      desc: "Attach your own explanations, ideas and important points to every moment.",
      iconStyle:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      icon: BookOpen,
      number: "04",
      title: "Revise smarter",
      desc: "Come back later and jump directly to the knowledge that matters.",
      iconStyle:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
  ]

  const features = [
    {
      icon: StickyNote,
      title: "Timestamped notes",
      desc: "Save your notes at the exact moment they matter and jump back to that point instantly.",
    },
    {
      icon: Star,
      title: "Important markers",
      desc: "Star critical timestamps and create a focused revision list for the topics that matter most.",
    },
    {
      icon: RefreshCw,
      title: "Revision mode",
      desc: "Review your most important notes without searching through entire lectures again.",
    },
    {
      icon: TrendingUp,
      title: "Study progress",
      desc: "See your lecture completion, study streaks and learning activity at a glance.",
    },
    {
      icon: Layers3,
      title: "Subjects & collections",
      desc: "Keep lectures organized by subjects, topics and custom study collections.",
    },
    {
      icon: FileText,
      title: "Export revision notes",
      desc: "Choose the notes you want to export and save them as a clean PDF for revision, printing, or later use.",
    },
  ]

  return (
    <div className="dark min-h-screen overflow-x-hidden bg-[#070b14] text-white">
      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-[#070b14]/75">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="relative z-10 h-5 w-5 text-white" />

              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div>
              <span className="block text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
                StudyNote
              </span>

              <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Learn • Capture • Revise
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 sm:inline-flex dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-slate-900"
            >
              Get started

              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.14),transparent_42%)]" />

        <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />

        <div className="absolute -right-32 top-44 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/10" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left */}

            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-xl dark:border-blue-400/10 dark:bg-blue-500/10 dark:text-blue-300">
                <Youtube className="h-3.5 w-3.5" />

                Built for serious learners

                <ChevronRight className="h-3 w-3 opacity-60" />
              </div>

              <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:mx-0 lg:text-[4.35rem] dark:text-white">
                Turn every lecture into

                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  knowledge you keep.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0 dark:text-slate-400">
                Stop losing important concepts inside hours of YouTube
                lectures. Capture timestamps, write notes, organize everything
                and revise exactly what matters.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  to="/register"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/25 sm:w-auto"
                >
                  Start taking notes free

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white sm:w-auto dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-slate-200 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.06]"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-5 flex items-center justify-center gap-5 text-xs text-slate-400 lg:justify-start dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Free to start
                </span>

                <span className="h-3 w-px bg-slate-200 dark:bg-white/10" />

                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  No credit card
                </span>
              </div>
            </div>

            {/* Right — Product Preview */}

            <div className="relative mx-auto w-full max-w-[590px] lg:mx-0 lg:ml-auto">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />

              {/* Floating Timestamp */}

              <div className="absolute -left-2 top-10 z-20 hidden animate-[float_5s_ease-in-out_infinite] sm:block lg:-left-10">
                <div className="flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-xl shadow-slate-300/30 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#111827]/90 dark:shadow-black/30">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      Timestamp saved
                    </p>

                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      12:42
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Note */}

              <div className="absolute -right-2 bottom-10 z-20 hidden animate-[float_6s_ease-in-out_infinite_1s] sm:block lg:-right-8">
                <div className="w-44 rounded-xl border border-white/80 bg-white/90 p-3 shadow-xl shadow-slate-300/30 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#111827]/90 dark:shadow-black/30">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <StickyNote className="h-3 w-3" />
                    </div>

                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                      My note
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10" />
                    <div className="h-1.5 w-4/5 rounded-full bg-slate-100 dark:bg-white/[0.06]" />
                    <div className="h-1.5 w-2/3 rounded-full bg-slate-100 dark:bg-white/[0.06]" />
                  </div>
                </div>
              </div>

              {/* App Window */}

              <div className="relative rounded-[28px] border border-slate-200/80 bg-white/90 p-2 shadow-2xl shadow-slate-300/40 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0d1422]/95 dark:shadow-black/40 sm:p-3">
                {/* Browser Bar */}

                <div className="flex h-9 items-center gap-1.5 px-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />

                  <div className="mx-auto hidden h-5 w-48 rounded-md bg-slate-100 sm:block dark:bg-white/[0.04]" />
                </div>

                {/* Video */}

                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-10 rounded-full bg-blue-500/10 blur-2xl" />

                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                        <Play className="ml-1 h-6 w-6 fill-white text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-4 top-4 rounded-lg bg-black/40 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                    Data Structures • Lecture 08
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                    <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[42%] rounded-full bg-blue-500" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/70">
                      <span>12:42</span>
                      <span>30:14</span>
                    </div>
                  </div>
                </div>

                {/* Notes Area */}

                <div className="grid gap-3 p-2 sm:grid-cols-[1fr_170px]">
                  <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-3.5 w-3.5 text-blue-500" />

                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          Timestamped notes
                        </span>
                      </div>

                      <span className="rounded-md bg-blue-500/10 px-1.5 py-1 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                        4 notes
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[
                        ["12:42", "Binary tree traversal"],
                        ["14:18", "Remember recursion base case"],
                        ["18:06", "Important interview concept"],
                      ].map(([time, text], i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white/80 px-2.5 py-2 dark:border-white/[0.05] dark:bg-white/[0.025]"
                        >
                          <span className="rounded-md bg-blue-50 px-1.5 py-1 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {time}
                          </span>

                          <span className="truncate text-[10px] font-medium text-slate-600 dark:text-slate-300">
                            {text}
                          </span>

                          {i === 2 && (
                            <Star className="ml-auto h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="hidden rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 sm:block dark:border-white/[0.06] dark:bg-white/[0.025]">
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />

                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        Progress
                      </span>
                    </div>

                    <div className="mb-2 flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        68%
                      </span>

                      <span className="text-[9px] text-slate-400">
                        complete
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">
                          Notes
                        </span>

                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          18
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">
                          Important
                        </span>

                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}

              <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-500 shadow-lg backdrop-blur-xl sm:flex dark:border-white/[0.08] dark:bg-[#111827]/90 dark:text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                Your knowledge, organized.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}

      <section className="border-y border-slate-100 bg-slate-50/60 dark:border-white/[0.05] dark:bg-white/[0.015]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-slate-200/70 px-4 py-8 sm:grid-cols-4 dark:divide-white/[0.06]">
          {[
            ["01", "Focused workflow"],
            ["∞", "Your notes"],
            ["1", "Simple workspace"],
            ["24/7", "Your library"],
          ].map(([value, label], i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-3 text-center"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {value}
              </span>

              <span className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}

      <section className="relative overflow-hidden bg-white py-24 dark:bg-[#070b14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
              <Zap className="h-3.5 w-3.5 text-blue-500" />

              Simple workflow
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              From watching to

              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                actually learning.
              </span>
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
              StudyNote turns passive video watching into a structured learning
              workflow.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-16 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block dark:via-white/10" />

            {workflow.map((step, i) => {
              const Icon = step.icon

              return (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/40 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-blue-400/20 dark:hover:shadow-black/20"
                >
                  <div className="relative z-10 mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.iconStyle} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.18em] text-slate-300 dark:text-slate-600">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="relative overflow-hidden bg-slate-50 py-24 dark:bg-[#0a101c]">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                <span className="h-px w-6 bg-blue-500" />

                Everything in one place
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Built around the way

                <span className="text-slate-400 dark:text-slate-500">
                  {" "}
                  students actually study.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              No complicated dashboards. Just the tools you need to capture,
              organize and revisit what you learn.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon

              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/40 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-blue-400/20 dark:hover:shadow-black/20"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {feature.desc}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-blue-400">
                    Explore feature

                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="relative overflow-hidden bg-white py-24 dark:bg-[#070b14]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.10),transparent_45%)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-14 text-center shadow-2xl shadow-blue-500/20 sm:px-10 lg:px-16">
            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full border border-white/10 bg-white/5" />

            <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl">
                <GraduationCap className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your next lecture deserves better notes.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-blue-100">
                Start turning YouTube lectures into organized, timestamped
                knowledge you can actually revisit.
              </p>

              <Link
                to="/register"
                className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-2xl"
              >
                Create your free account

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-xs text-blue-100/70">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-slate-100 bg-white py-8 dark:border-white/[0.05] dark:bg-[#070b14]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>

            <span className="font-bold text-slate-700 dark:text-slate-200">
              StudyNote
            </span>
          </Link>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your personal YouTube lecture companion.
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <span>Built for</span>

            <span className="font-semibold text-slate-500 dark:text-slate-400">
              focused learners
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}