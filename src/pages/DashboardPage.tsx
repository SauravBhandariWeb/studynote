import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  StickyNote,
  FolderTree,
  Flame,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar, Badge } from '@/components/ui/Form';
import { CardSkeleton, EmptyState } from '@/components/ui/LoadingStates';
import { dashboardApi, lectureApi, streakApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { DashboardStats, Lecture, StudyStreak } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats().catch(() => null),
      streakApi.get().catch(() => null),
      lectureApi.list().catch(() => []),
    ]).then(([s, st, lectures]) => {
      setStats(s);
      setStreak(st);
      setRecentLectures((lectures as Lecture[]).slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-white/[0.06]" />

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Lectures',
      value: stats?.totalLectures ?? 0,
      sub: `${stats?.completedLectures ?? 0} completed`,
      icon: BookOpen,
      color:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    },
    {
      label: 'Notes',
      value: stats?.totalNotes ?? 0,
      sub: `${stats?.importantNotes ?? 0} important`,
      icon: StickyNote,
      color:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    },
    {
      label: 'Subjects',
      value: stats?.totalSubjects ?? 0,
      sub: 'Organized',
      icon: FolderTree,
      color:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
    {
      label: 'Study time',
      value: `${Math.floor((stats?.totalStudyMinutes ?? 0) / 60)}h`,
      sub: `${(stats?.totalStudyMinutes ?? 0) % 60}m`,
      icon: Clock,
      color:
        'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#070b14]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <PageHeader
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}
          subtitle="Here's your study overview"
          action={
            <Link
              to="/lectures"
              className="
                inline-flex items-center gap-2 rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-600
                px-4 py-2.5 text-sm font-semibold text-white
                shadow-lg shadow-blue-500/20
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-blue-500/30
              "
            >
              <Plus className="h-4 w-4" />

              <span className="hidden sm:inline">
                Add lecture
              </span>

              <span className="sm:hidden">
                Add
              </span>
            </Link>
          }
        />

        {/* Streak */}
        {streak && streak.currentStreak > 0 && (
          <div
            className="
              mb-6 overflow-hidden rounded-2xl
              border border-orange-200/70
              bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50
              p-5 shadow-sm
              dark:border-orange-500/10
              dark:from-orange-500/[0.08]
              dark:via-amber-500/[0.06]
              dark:to-yellow-500/[0.04]
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-12 w-12 flex-shrink-0 items-center justify-center
                  rounded-xl bg-orange-100
                  shadow-sm
                  dark:bg-orange-500/10
                "
              >
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>

              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {streak.currentStreak} day study streak!
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Longest streak: {streak.longestStreak} days. Keep it going!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;

            return (
              <div
                key={i}
                className="
                  group rounded-2xl
                  border border-slate-200/70
                  bg-white/70
                  p-5
                  shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]
                  dark:border-white/[0.07]
                  dark:bg-white/[0.035]
                  dark:shadow-none
                  dark:hover:bg-white/[0.055]
                "
              >
                <div
                  className={`
                    mb-4 flex h-10 w-10 items-center justify-center
                    rounded-xl
                    ${card.color}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </p>

                <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.label}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Weekly goal + Recent lectures */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Weekly Goal */}
          <div
            className="
              rounded-2xl
              border border-slate-200/70
              bg-white/70
              p-6
              shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              backdrop-blur-xl
              dark:border-white/[0.07]
              dark:bg-white/[0.035]
              dark:shadow-none
            "
          >
            <div className="mb-5 flex items-center gap-2">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg
                  bg-blue-50
                  dark:bg-blue-500/10
                "
              >
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Weekly goal
              </h3>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Progress
                </span>

                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {stats?.weeklyGoalProgress ?? 0}%
                </span>
              </div>

              <ProgressBar
                value={stats?.weeklyGoalProgress ?? 0}
              />
            </div>

            <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
              Keep studying to reach your weekly target.
            </p>
          </div>

          {/* Recent lectures */}
          <div className="lg:col-span-2">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Recent lectures
                </h3>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Continue where you left off
                </p>
              </div>

              <Link
                to="/lectures"
                className="
                  flex items-center gap-1.5
                  text-sm font-medium
                  text-blue-600
                  transition-colors
                  hover:text-blue-700
                  dark:text-blue-400
                  dark:hover:text-blue-300
                "
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentLectures.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  border border-slate-200/70
                  bg-white/70
                  backdrop-blur-xl
                  dark:border-white/[0.07]
                  dark:bg-white/[0.035]
                "
              >
                <EmptyState
                  icon={BookOpen}
                  title="No lectures yet"
                  description="Add your first YouTube lecture to start taking timestamped notes."
                  action={
                    <Link
                      to="/lectures"
                      className="
                        inline-flex items-center gap-2
                        rounded-xl
                        bg-gradient-to-r from-blue-600 to-indigo-600
                        px-4 py-2.5
                        text-sm font-semibold text-white
                        shadow-lg shadow-blue-500/20
                      "
                    >
                      <Plus className="h-4 w-4" />
                      Add lecture
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {recentLectures.map((lecture) => (
                  <Link
                    key={lecture._id}
                    to={`/lectures/${lecture._id}`}
                    className="
                      group flex items-center gap-4
                      rounded-2xl
                      border border-slate-200/70
                      bg-white/70
                      p-4
                      shadow-[0_5px_20px_rgba(15,23,42,0.03)]
                      backdrop-blur-xl
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:border-blue-200
                      hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]
                      dark:border-white/[0.07]
                      dark:bg-white/[0.035]
                      dark:shadow-none
                      dark:hover:border-blue-500/20
                      dark:hover:bg-white/[0.055]
                    "
                  >
                    {/* Thumbnail */}
                    <img
                      src={lecture.thumbnailUrl}
                      alt={lecture.title}
                      className="
                        h-16 w-24 flex-shrink-0
                        rounded-xl object-cover
                        bg-slate-200
                        ring-1 ring-black/5
                        dark:bg-white/[0.05]
                        dark:ring-white/[0.06]
                      "
                    />

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h4
                        className="
                          truncate font-medium
                          text-slate-900
                          transition-colors
                          group-hover:text-blue-600
                          dark:text-white
                          dark:group-hover:text-blue-400
                        "
                      >
                        {lecture.title}
                      </h4>

                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {lecture.channelName}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <ProgressBar
                          value={lecture.progress}
                          className="w-24"
                        />

                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {lecture.progress}%
                        </span>

                        {lecture.completed && (
                          <Badge color="emerald">
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      className="
                        hidden h-4 w-4 flex-shrink-0
                        text-slate-300
                        transition-all
                        group-hover:translate-x-1
                        group-hover:text-blue-500
                        dark:text-slate-600
                        dark:group-hover:text-blue-400
                        sm:block
                      "
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}