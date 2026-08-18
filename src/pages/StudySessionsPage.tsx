import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  BookOpen,
  Flame,
  TrendingUp,
  CalendarDays,
  Timer,
  Target,
  Play,
  Pause,
  RotateCcw,
  Bell,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import {
  Button,
  Input,
  Textarea,
  Select,
  Badge,
  ProgressBar,
} from '@/components/ui/Form';

import {
  Modal,
  ConfirmModal,
} from '@/components/ui/Modal';

import {
  EmptyState,
  ErrorState,
} from '@/components/ui/LoadingStates';

import {
  sessionApi,
  goalApi,
  streakApi,
  lectureApi,
  subjectApi,
} from '@/lib/api';

import { useToast } from '@/context/ToastContext';

import type {
  StudySession,
  StudyGoal,
  StudyStreak,
  Lecture,
  Subject,
} from '@/types';

const TIMER_STORAGE_KEY =
  'studynote_active_study_session';

const NOTIFICATIONS_STORAGE_KEY =
  'studynote_notifications';

interface ActiveTimer {
  startedAt: number;
  pausedAt: number | null;
  totalPausedMs: number;
  targetMinutes: number;
  lectureId: string;
  subjectId: string;
  notes: string;
  isPaused: boolean;
  targetNotified: boolean;
}

interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default function StudySessionsPage() {
  const { toast } = useToast();

  const [sessions, setSessions] =
    useState<StudySession[]>([]);

  const [goals, setGoals] =
    useState<StudyGoal[]>([]);

  const [streak, setStreak] =
    useState<StudyStreak | null>(null);

  const [lectures, setLectures] =
    useState<Lecture[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showSession, setShowSession] =
    useState(false);

  const [showGoal, setShowGoal] =
    useState(false);

  const [deleteSession, setDeleteSession] =
    useState<StudySession | null>(null);

  const [deleteGoal, setDeleteGoal] =
    useState<StudyGoal | null>(null);

  const [sessionDuration, setSessionDuration] =
    useState('30');

  const [sessionLecture, setSessionLecture] =
    useState('');

  const [sessionSubject, setSessionSubject] =
    useState('');

  const [sessionNotes, setSessionNotes] =
    useState('');

  const [savingSession, setSavingSession] =
    useState(false);

  const [goalTitle, setGoalTitle] =
    useState('');

  const [goalHours, setGoalHours] =
    useState('10');

  const [goalDeadline, setGoalDeadline] =
    useState('');

  const [savingGoal, setSavingGoal] =
    useState(false);

  const [timerLecture, setTimerLecture] =
    useState('');

  const [timerSubject, setTimerSubject] =
    useState('');

  const [timerNotes, setTimerNotes] =
    useState('');

  const [targetMinutes, setTargetMinutes] =
    useState('45');

  const [activeTimer, setActiveTimer] =
    useState<ActiveTimer | null>(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [targetReached, setTargetReached] =
    useState(false);

  const [savingTimer, setSavingTimer] =
    useState(false);

  const [alarmPlaying, setAlarmPlaying] =
    useState(false);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const timerRef =
    useRef<ActiveTimer | null>(null);

  useEffect(() => {
    timerRef.current = activeTimer;
  }, [activeTimer]);

  const loadData = () => {
    setLoading(true);
    setError('');

    Promise.all([
      sessionApi.list().catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Failed to load sessions',
        );

        return [];
      }),

      goalApi.list().catch(() => []),

      streakApi.get().catch(() => null),

      lectureApi.list().catch(() => []),

      subjectApi.list().catch(() => []),
    ]).then(([s, g, st, l, sub]) => {
      setSessions(
        s as StudySession[],
      );

      setGoals(
        g as StudyGoal[],
      );

      setStreak(
        st as StudyStreak | null,
      );

      setLectures(
        l as Lecture[],
      );

      setSubjects(
        sub as Subject[],
      );

      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const enableAlarmAudio = async () => {
    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    const audioWindow =
      window as WindowWithAudioContext;

    const AudioContextClass =
      window.AudioContext ||
      audioWindow.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContextClass();
    }

    if (
      audioContextRef.current.state ===
      'suspended'
    ) {
      try {
        await audioContextRef.current.resume();
      } catch {
        // Ignore browser audio restrictions.
      }
    }
  };

  const playAlarm = async () => {
    try {
      if (!audioContextRef.current) {
        await enableAlarmAudio();
      }

      const context =
        audioContextRef.current;

      if (!context) {
        return;
      }

      if (context.state === 'suspended') {
        await context.resume();
      }

      setAlarmPlaying(true);

      const startBase =
        context.currentTime + 0.05;

      const notes = [
        {
          delay: 0,
          frequency: 784,
          duration: 0.35,
        },
        {
          delay: 0.4,
          frequency: 988,
          duration: 0.35,
        },
        {
          delay: 0.8,
          frequency: 1175,
          duration: 0.35,
        },
        {
          delay: 1.2,
          frequency: 988,
          duration: 0.45,
        },
      ];

      notes.forEach(
        ({
          delay,
          frequency,
          duration,
        }) => {
          const oscillator =
            context.createOscillator();

          const gain =
            context.createGain();

          const startTime =
            startBase + delay;

          oscillator.type = 'sine';

          oscillator.frequency.setValueAtTime(
            frequency,
            startTime,
          );

          gain.gain.setValueAtTime(
            0.0001,
            startTime,
          );

          gain.gain.exponentialRampToValueAtTime(
            0.45,
            startTime + 0.03,
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            startTime + duration,
          );

          oscillator.connect(gain);

          gain.connect(
            context.destination,
          );

          oscillator.start(
            startTime,
          );

          oscillator.stop(
            startTime + duration + 0.03,
          );
        },
      );

      window.setTimeout(() => {
        setAlarmPlaying(false);
      }, 1900);
    } catch (error) {
      console.error(
        'Alarm playback failed:',
        error,
      );

      setAlarmPlaying(false);
    }
  };

  useEffect(() => {
    const raw =
      localStorage.getItem(
        TIMER_STORAGE_KEY,
      );

    if (!raw) {
      return;
    }

    try {
      const parsed =
        JSON.parse(raw) as ActiveTimer;

      if (
        !parsed ||
        typeof parsed.startedAt !==
          'number'
      ) {
        localStorage.removeItem(
          TIMER_STORAGE_KEY,
        );

        return;
      }

      const restoredTimer: ActiveTimer = {
        startedAt: parsed.startedAt,

        pausedAt:
          typeof parsed.pausedAt ===
          'number'
            ? parsed.pausedAt
            : null,

        totalPausedMs:
          Number(
            parsed.totalPausedMs,
          ) || 0,

        targetMinutes:
          Math.max(
            0,
            Number(
              parsed.targetMinutes,
            ) || 0,
          ),

        lectureId:
          parsed.lectureId || '',

        subjectId:
          parsed.subjectId || '',

        notes: parsed.notes || '',

        isPaused:
          Boolean(parsed.isPaused),

        targetNotified:
          Boolean(
            parsed.targetNotified,
          ),
      };

      setActiveTimer(
        restoredTimer,
      );

      setTimerLecture(
        restoredTimer.lectureId,
      );

      setTimerSubject(
        restoredTimer.subjectId,
      );

      setTimerNotes(
        restoredTimer.notes,
      );

      setTargetMinutes(
        String(
          restoredTimer.targetMinutes,
        ),
      );

      setTargetReached(
        restoredTimer.targetNotified,
      );

      const now = Date.now();

      const referenceTime =
        restoredTimer.isPaused &&
        restoredTimer.pausedAt
          ? restoredTimer.pausedAt
          : now;

      const elapsedMs =
        referenceTime -
        restoredTimer.startedAt -
        restoredTimer.totalPausedMs;

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            elapsedMs / 1000,
          ),
        ),
      );
    } catch {
      localStorage.removeItem(
        TIMER_STORAGE_KEY,
      );
    }
  }, []);

  useEffect(() => {
    if (
      !activeTimer ||
      activeTimer.isPaused
    ) {
      return;
    }

    const updateTimer = () => {
      const timer =
        timerRef.current;

      if (
        !timer ||
        timer.isPaused
      ) {
        return;
      }

      const now = Date.now();

      const elapsedMs =
        now -
        timer.startedAt -
        timer.totalPausedMs;

      const seconds = Math.max(
        0,
        Math.floor(
          elapsedMs / 1000,
        ),
      );

      setElapsedSeconds(seconds);

      const targetSeconds =
        Number(
          timer.targetMinutes || 0,
        ) * 60;

      if (
        targetSeconds <= 0 ||
        seconds < targetSeconds ||
        timer.targetNotified
      ) {
        return;
      }

      const updatedTimer: ActiveTimer = {
        ...timer,
        targetNotified: true,
      };

      timerRef.current =
        updatedTimer;

      setActiveTimer(
        updatedTimer,
      );

      setTargetReached(true);

      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(
          updatedTimer,
        ),
      );

      toast(
        'Study target reached!',
      );

      const notificationsEnabled =
        localStorage.getItem(
          NOTIFICATIONS_STORAGE_KEY,
        ) !== 'false';

      /*
       * Alarm sound is independent from
       * browser notification settings.
       */
      void playAlarm();

      /*
       * Browser notification follows
       * the user's notification setting.
       */
      if (
        notificationsEnabled &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission ===
          'granted'
      ) {
        try {
          new Notification(
            'StudyNote — Target reached',
            {
              body: `You completed your ${timer.targetMinutes}-minute study target.`,
              silent: false,
            },
          );
        } catch {
          // Ignore notification failures.
        }
      }
    };

    updateTimer();

    const interval =
      window.setInterval(
        updateTimer,
        250,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [activeTimer, toast]);

  const formatTime = (
    seconds: number,
  ) => {
    const hours =
      Math.floor(
        seconds / 3600,
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60,
      );

    const secs =
      seconds % 60;

    return [
      hours
        .toString()
        .padStart(2, '0'),

      minutes
        .toString()
        .padStart(2, '0'),

      secs
        .toString()
        .padStart(2, '0'),
    ].join(':');
  };

  const requestNotificationPermission =
    async () => {
      if (
        typeof window === 'undefined' ||
        !('Notification' in window)
      ) {
        return;
      }

      if (
        Notification.permission ===
        'default'
      ) {
        try {
          await Notification.requestPermission();
        } catch {
          // Ignore permission errors.
        }
      }
    };

  const handleStartTimer =
    async () => {
      if (activeTimer) {
        toast(
          'A study session is already running',
          'error',
        );

        return;
      }

      const target =
        Math.max(
          0,
          parseInt(
            targetMinutes,
          ) || 0,
        );

      await enableAlarmAudio();

      const notificationsEnabled =
        localStorage.getItem(
          NOTIFICATIONS_STORAGE_KEY,
        ) !== 'false';

      if (
        notificationsEnabled
      ) {
        await requestNotificationPermission();
      }

      const timer: ActiveTimer = {
        startedAt:
          Date.now(),

        pausedAt: null,

        totalPausedMs: 0,

        targetMinutes:
          target,

        lectureId:
          timerLecture || '',

        subjectId:
          timerSubject || '',

        notes:
          timerNotes,

        isPaused: false,

        targetNotified:
          false,
      };

      setActiveTimer(
        timer,
      );

      timerRef.current =
        timer;

      setElapsedSeconds(0);

      setTargetReached(false);

      setAlarmPlaying(false);

      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(
          timer,
        ),
      );

      toast(
        target > 0
          ? `Study session started — ${target} min target`
          : 'Study session started',
      );
    };

  const handlePauseTimer =
    () => {
      const timer =
        timerRef.current;

      if (
        !timer ||
        timer.isPaused
      ) {
        return;
      }

      const updatedTimer: ActiveTimer = {
        ...timer,
        pausedAt:
          Date.now(),
        isPaused: true,
      };

      timerRef.current =
        updatedTimer;

      setActiveTimer(
        updatedTimer,
      );

      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(
          updatedTimer,
        ),
      );

      toast(
        'Study session paused',
      );
    };

  const handleResumeTimer =
    async () => {
      const timer =
        timerRef.current;

      if (
        !timer ||
        !timer.isPaused ||
        !timer.pausedAt
      ) {
        return;
      }

      await enableAlarmAudio();

      const pauseDuration =
        Date.now() -
        timer.pausedAt;

      const updatedTimer: ActiveTimer = {
        ...timer,

        pausedAt: null,

        totalPausedMs:
          timer.totalPausedMs +
          pauseDuration,

        isPaused: false,
      };

      timerRef.current =
        updatedTimer;

      setActiveTimer(
        updatedTimer,
      );

      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify(
          updatedTimer,
        ),
      );

      toast(
        'Study session resumed',
      );
    };

  const handleResetTimer =
    () => {
      if (!timerRef.current) {
        return;
      }

      const confirmed =
        window.confirm(
          'Discard this active study session?',
        );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(
        TIMER_STORAGE_KEY,
      );

      timerRef.current =
        null;

      setActiveTimer(null);

      setElapsedSeconds(0);

      setTargetReached(false);

      setAlarmPlaying(false);

      setTimerLecture('');

      setTimerSubject('');

      setTimerNotes('');

      setTargetMinutes('45');

      toast(
        'Active session discarded',
      );
    };

  const handleFinishTimer =
    async () => {
      const timer =
        timerRef.current;

      if (!timer) {
        return;
      }

      const durationMinutes =
        Math.floor(
          elapsedSeconds / 60,
        );

      if (
        durationMinutes < 1
      ) {
        toast(
          'Study for at least 1 minute before saving.',
          'error',
        );

        return;
      }

      setSavingTimer(true);

      try {
        await sessionApi.create({
          duration:
            durationMinutes,

          lectureId:
            timer.lectureId ||
            null,

          subjectId:
            timer.subjectId ||
            null,

          notes:
            timer.notes,
        });

        localStorage.removeItem(
          TIMER_STORAGE_KEY,
        );

        timerRef.current =
          null;

        setActiveTimer(null);

        setElapsedSeconds(0);

        setTargetReached(false);

        setAlarmPlaying(false);

        setTimerLecture('');

        setTimerSubject('');

        setTimerNotes('');

        setTargetMinutes(
          '45',
        );

        toast(
          `Study session saved — ${durationMinutes} min`,
        );

        loadData();
      } catch (err) {
        toast(
          err instanceof Error
            ? err.message
            : 'Failed to save study session',
          'error',
        );
      } finally {
        setSavingTimer(false);
      }
    };

  const handleSaveSession =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      setSavingSession(true);

      try {
        await sessionApi.create({
          duration:
            parseInt(
              sessionDuration,
            ) || 30,

          lectureId:
            sessionLecture ||
            null,

          subjectId:
            sessionSubject ||
            null,

          notes:
            sessionNotes,
        });

        toast(
          'Study session logged',
        );

        setShowSession(false);

        setSessionDuration(
          '30',
        );

        setSessionLecture('');

        setSessionSubject('');

        setSessionNotes('');

        loadData();
      } catch (err) {
        toast(
          err instanceof Error
            ? err.message
            : 'Failed',
          'error',
        );
      } finally {
        setSavingSession(
          false,
        );
      }
    };

  const handleSaveGoal =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      if (!goalTitle.trim()) {
        toast(
          'Please enter a title',
          'error',
        );

        return;
      }

      setSavingGoal(true);

      try {
        await goalApi.create({
          title:
            goalTitle,

          targetHours:
            parseInt(
              goalHours,
            ) || 10,

          deadline:
            goalDeadline ||
            new Date(
              Date.now() +
                7 * 86400000,
            ).toISOString(),
        });

        toast(
          'Goal created',
        );

        setShowGoal(false);

        setGoalTitle('');

        setGoalHours('10');

        setGoalDeadline('');

        loadData();
      } catch (err) {
        toast(
          err instanceof Error
            ? err.message
            : 'Failed',
          'error',
        );
      } finally {
        setSavingGoal(false);
      }
    };

  const handleDeleteSession =
    async (
      s: StudySession,
    ) => {
      try {
        await sessionApi.remove(
          s._id,
        );

        toast(
          'Session deleted',
        );

        setDeleteSession(null);

        loadData();
      } catch (err) {
        toast(
          err instanceof Error
            ? err.message
            : 'Failed',
          'error',
        );
      }
    };

  const handleDeleteGoal =
    async (
      g: StudyGoal,
    ) => {
      try {
        await goalApi.remove(
          g._id,
        );

        toast(
          'Goal deleted',
        );

        setDeleteGoal(null);

        loadData();
      } catch (err) {
        toast(
          err instanceof Error
            ? err.message
            : 'Failed',
          'error',
        );
      }
    };

  const totalMinutes =
    sessions.reduce(
      (sum, s) =>
        sum + s.duration,
      0,
    );

  const totalHours =
    Math.floor(
      totalMinutes / 60,
    );

  const remainingMinutes =
    totalMinutes % 60;

  const getLectureName = (
    lectureId?: string | null,
  ) => {
    if (!lectureId) {
      return null;
    }

    return (
      lectures.find(
        (l) =>
          l._id ===
          lectureId,
      )?.title || null
    );
  };

  const getSubjectName = (
    subjectId?: string | null,
  ) => {
    if (!subjectId) {
      return null;
    }

    return (
      subjects.find(
        (s) =>
          s._id ===
          subjectId,
      )?.name || null
    );
  };

  const timerTargetSeconds =
    Math.max(
      0,
      parseInt(
        String(
          activeTimer?.targetMinutes ??
            targetMinutes,
        ),
      ) || 0,
    ) * 60;

  const timerProgress =
    timerTargetSeconds > 0
      ? Math.min(
          (elapsedSeconds /
            timerTargetSeconds) *
            100,
          100,
        )
      : 0;

  const notificationsEnabled =
    typeof window !== 'undefined'
      ? localStorage.getItem(
          NOTIFICATIONS_STORAGE_KEY,
        ) !== 'false'
      : true;

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#070b14]">
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">

        <PageHeader
          title="Study Sessions"
          subtitle="Track your study time, build consistency, and reach your goals"
          action={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setShowGoal(true)
                }
              >
                <Plus className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Goal
                </span>
              </Button>

              <Button
                onClick={() =>
                  setShowSession(
                    true,
                  )
                }
                disabled={
                  !!activeTimer
                }
              >
                <Plus className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Log session
                </span>

                <span className="sm:hidden">
                  Log
                </span>
              </Button>
            </div>
          }
        />

        <div
          className={`
            relative mb-8 overflow-hidden
            rounded-[28px]
            border
            p-5
            backdrop-blur-xl
            transition-all duration-700
            sm:p-7
            ${
              targetReached
                ? `
                  border-emerald-300/80
                  bg-emerald-50/70
                  shadow-[0_20px_70px_rgba(16,185,129,0.18)]
                  dark:border-emerald-400/20
                  dark:bg-emerald-500/[0.06]
                `
                : `
                  border-blue-200/60
                  bg-white/75
                  shadow-[0_20px_60px_rgba(37,99,235,0.08)]
                  dark:border-blue-500/10
                  dark:bg-white/[0.035]
                  dark:shadow-none
                `
            }
          `}
        >
          <div
            className={`
              pointer-events-none absolute
              -right-20 -top-20
              h-56 w-56 rounded-full
              blur-3xl
              ${
                targetReached
                  ? 'bg-emerald-400/20'
                  : 'bg-blue-500/10'
              }
            `}
          />

          <div className="relative">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      ${
                        targetReached
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                          : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                      }
                    `}
                  >
                    <Timer className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                    Focus Session
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {activeTimer
                    ? activeTimer.isPaused
                      ? 'Session paused'
                      : targetReached
                        ? 'Target reached 🎉'
                        : 'Focus mode active'
                    : 'Ready to study?'}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activeTimer
                    ? activeTimer.isPaused
                      ? 'Resume whenever you are ready.'
                      : targetReached
                        ? 'Your target is complete. You can continue studying or save the session.'
                        : 'Your study time is being tracked automatically.'
                    : 'Start a live session and let StudyNote track the real duration.'}
                </p>
              </div>

              {activeTimer && (
                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    self-start
                    rounded-full
                    border
                    px-3 py-1.5
                    text-xs font-semibold
                    ${
                      targetReached
                        ? `
                          animate-pulse
                          border-emerald-200
                          bg-emerald-50
                          text-emerald-700
                          dark:border-emerald-500/20
                          dark:bg-emerald-500/10
                          dark:text-emerald-300
                        `
                        : activeTimer.isPaused
                          ? `
                            border-amber-200
                            bg-amber-50
                            text-amber-700
                            dark:border-amber-500/20
                            dark:bg-amber-500/10
                            dark:text-amber-300
                          `
                          : `
                            border-blue-200
                            bg-blue-50
                            text-blue-700
                            dark:border-blue-500/20
                            dark:bg-blue-500/10
                            dark:text-blue-300
                          `
                    }
                  `}
                >
                  {targetReached ? (
                    <>
                      <Bell className="h-3.5 w-3.5" />
                      Target reached
                    </>
                  ) : activeTimer.isPaused ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      Paused
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                      Live
                    </>
                  )}
                </div>
              )}
            </div>

            {!activeTimer ? (
              <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                  <div className="mb-5 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl font-black tracking-[-0.04em] text-slate-900 dark:text-white sm:text-6xl">
                        00:00:00
                      </p>

                      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        Timer starts when you press Start
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Select
                      label="Lecture"
                      value={
                        timerLecture
                      }
                      onChange={(e) =>
                        setTimerLecture(
                          e.target.value,
                        )
                      }
                    >
                      <option value="">
                        None
                      </option>

                      {lectures.map(
                        (l) => (
                          <option
                            key={l._id}
                            value={l._id}
                          >
                            {l.title}
                          </option>
                        ),
                      )}
                    </Select>

                    <Select
                      label="Subject"
                      value={
                        timerSubject
                      }
                      onChange={(e) =>
                        setTimerSubject(
                          e.target.value,
                        )
                      }
                    >
                      <option value="">
                        None
                      </option>

                      {subjects.map(
                        (s) => (
                          <option
                            key={s._id}
                            value={s._id}
                          >
                            {s.name}
                          </option>
                        ),
                      )}
                    </Select>

                    <Select
                      label="Target"
                      value={
                        targetMinutes
                      }
                      onChange={(e) =>
                        setTargetMinutes(
                          e.target.value,
                        )
                      }
                    >
                      <option value="0">
                        No target
                      </option>

                      <option value="25">
                        25 minutes
                      </option>

                      <option value="45">
                        45 minutes
                      </option>

                      <option value="60">
                        60 minutes
                      </option>

                      <option value="90">
                        90 minutes
                      </option>
                    </Select>
                  </div>

                  <div className="mt-4">
                    <Textarea
                      label="Session notes (optional)"
                      placeholder="What are you planning to study?"
                      value={timerNotes}
                      onChange={(e) =>
                        setTimerNotes(
                          e.target.value,
                        )
                      }
                      rows={2}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleStartTimer
                    }
                    className="
                      mt-5 flex h-12 w-full
                      items-center justify-center
                      gap-2 rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      text-sm font-bold text-white
                      shadow-lg shadow-blue-500/20
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:shadow-blue-500/30
                    "
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start study session
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <Volume2 className="h-3.5 w-3.5" />

                    {notificationsEnabled
                      ? 'Alarm & notifications enabled'
                      : 'Alarm sound remains enabled'}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200/70 bg-white/70 p-5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                  <div className="mb-4 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-violet-500" />

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      How it works
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                        1
                      </span>

                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Choose a lecture, subject, and target.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                        2
                      </span>

                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Start studying and real elapsed time is tracked.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                        3
                      </span>

                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        At the target, StudyNote gives sound, notification, and visual feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                <div
                  className={`
                    rounded-[24px]
                    border
                    p-6
                    transition-all duration-500
                    ${
                      targetReached
                        ? `
                          border-emerald-200
                          bg-emerald-50/70
                          dark:border-emerald-500/20
                          dark:bg-emerald-500/[0.06]
                        `
                        : `
                          border-slate-200/70
                          bg-slate-50/70
                          dark:border-white/[0.07]
                          dark:bg-white/[0.025]
                        `
                    }
                  `}
                >
                  <div className="text-center">
                    <div
                      className={`
                        inline-flex
                        rounded-full
                        p-5
                        ${
                          targetReached
                            ? 'animate-pulse bg-emerald-500/10'
                            : ''
                        }
                      `}
                    >
                      <p
                        className={`
                          text-5xl
                          font-black
                          tracking-[-0.04em]
                          sm:text-7xl
                          ${
                            targetReached
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-white'
                          }
                        `}
                      >
                        {formatTime(
                          elapsedSeconds,
                        )}
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {activeTimer.targetMinutes >
                      0
                        ? `${activeTimer.targetMinutes} min target`
                        : 'No time target'}
                    </p>
                  </div>

                  {activeTimer.targetMinutes >
                    0 && (
                    <div className="mt-7">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Progress
                        </span>

                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {Math.round(
                            timerProgress,
                          )}
                          %
                        </span>
                      </div>

                      <ProgressBar
                        value={
                          timerProgress
                        }
                      />
                    </div>
                  )}

                  {targetReached && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Bell className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                            🎉 Study target completed!
                          </p>

                          <p className="mt-1 text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/70">
                            You completed your{' '}
                            {
                              activeTimer.targetMinutes
                            }
                            -minute target.
                          </p>

                          {alarmPlaying && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                              <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                              Alarm playing
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                    {activeTimer.isPaused ? (
                      <Button
                        onClick={
                          handleResumeTimer
                        }
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={
                          handlePauseTimer
                        }
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    )}

                    <Button
                      onClick={
                        handleFinishTimer
                      }
                      loading={
                        savingTimer
                      }
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Finish & save
                    </Button>

                    <button
                      type="button"
                      onClick={
                        handleResetTimer
                      }
                      className="
                        inline-flex h-10
                        items-center justify-center
                        gap-2 rounded-xl
                        border border-slate-200
                        bg-white px-4
                        text-sm font-medium
                        text-slate-500
                        transition-colors
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                        dark:border-white/[0.08]
                        dark:bg-white/[0.03]
                        dark:text-slate-400
                        dark:hover:border-red-500/20
                        dark:hover:bg-red-500/10
                        dark:hover:text-red-400
                      "
                    >
                      <RotateCcw className="h-4 w-4" />
                      Discard
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[22px] border border-slate-200/70 bg-white/70 p-5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                      Current session
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Lecture
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {activeTimer.lectureId
                              ? getLectureName(
                                  activeTimer.lectureId,
                                ) ||
                                'Selected lecture'
                              : 'Independent study'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />

                        <div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Target
                          </p>

                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {activeTimer.targetMinutes >
                            0
                              ? `${activeTimer.targetMinutes} minutes`
                              : 'No target'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                        <div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Alarm
                          </p>

                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Enabled
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/[0.08] dark:bg-white/[0.04]">
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200/70 bg-blue-50 shadow-sm dark:border-blue-400/10 dark:bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {totalHours}h {remainingMinutes}m
                </p>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Total study time
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 dark:border-white/[0.08] dark:bg-white/[0.04]">
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-200/70 bg-orange-50 shadow-sm dark:border-orange-400/10 dark:bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {streak?.currentStreak ?? 0}
                </p>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Day streak
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 dark:border-white/[0.08] dark:bg-white/[0.04]">
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200/70 bg-violet-50 shadow-sm dark:border-violet-400/10 dark:bg-violet-500/10">
                <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {sessions.length}
                </p>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Sessions logged
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-white/[0.06] dark:bg-white/[0.04]"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={loadData}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                    Recent sessions
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Your latest study activity
                  </p>
                </div>

                {sessions.length > 0 && (
                  <div className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400">
                    {sessions.length} total
                  </div>
                )}
              </div>

              {sessions.length === 0 ? (
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <EmptyState
                    icon={Clock}
                    title="No sessions yet"
                    description="Start a live study session or log your study time manually."
                    action={
                      <Button
                        onClick={() =>
                          setShowSession(true)
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Log session
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions
                    .slice(0, 10)
                    .map((s) => {
                      const lectureName =
                        getLectureName(
                          s.lectureId,
                        );

                      const subjectName =
                        getSubjectName(
                          s.subjectId,
                        );

                      return (
                        <div
                          key={s._id}
                          className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/[0.08] dark:bg-white/[0.04]"
                        >
                          <div className="relative flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm dark:border-blue-400/10 dark:from-blue-500/10 dark:to-indigo-500/10">
                              <Timer className="mb-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />

                              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                {s.duration}m
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-slate-400">
                                  <CalendarDays className="h-3 w-3" />

                                  {new Date(
                                    s.date,
                                  ).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    },
                                  )}
                                </span>

                                {subjectName && (
                                  <Badge color="purple">
                                    {subjectName}
                                  </Badge>
                                )}
                              </div>

                              {lectureName ? (
                                <div className="mb-1 flex min-w-0 items-center gap-2">
                                  <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />

                                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {lectureName}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  Independent study session
                                </p>
                              )}

                              {s.notes && (
                                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                  {s.notes}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              aria-label="Delete study session"
                              onClick={() =>
                                setDeleteSession(s)
                              }
                              className="shrink-0 rounded-xl p-2 text-slate-400 opacity-70 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:opacity-100 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                    Study goals
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Stay focused on what matters
                  </p>
                </div>

                {goals.length > 0 && (
                  <Target className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                )}
              </div>

              {goals.length === 0 ? (
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <EmptyState
                    icon={TrendingUp}
                    title="No goals set"
                    description="Set a study goal to keep yourself motivated."
                    action={
                      <Button
                        onClick={() =>
                          setShowGoal(true)
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Set goal
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {goals.map((g) => {
                    const progress =
                      g.targetHours > 0
                        ? Math.min(
                            (g.completedHours /
                              g.targetHours) *
                              100,
                            100,
                          )
                        : 0;

                    return (
                      <div
                        key={g._id}
                        className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/5 dark:border-white/[0.08] dark:bg-white/[0.04]"
                      >
                        <div className="relative">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                                  <Target className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>

                                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                  {g.title}
                                </h4>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-label="Delete study goal"
                              onClick={() =>
                                setDeleteGoal(g)
                              }
                              className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                              {g.completedHours}h / {g.targetHours}h
                            </span>

                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {Math.round(progress)}%
                            </span>
                          </div>

                          <ProgressBar
                            value={progress}
                          />

                          <div className="mt-3 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                              <CalendarDays className="h-3.5 w-3.5" />

                              {new Date(
                                g.deadline,
                              ).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </span>

                            {g.completed && (
                              <Badge color="emerald">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <Modal
          open={showSession}
          onClose={() =>
            setShowSession(false)
          }
          title="Log study session"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() =>
                  setShowSession(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveSession}
                loading={savingSession}
              >
                Save session
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleSaveSession}
            className="space-y-4"
          >
            <Input
              label="Duration (minutes)"
              type="number"
              min="1"
              value={sessionDuration}
              onChange={(e) =>
                setSessionDuration(
                  e.target.value,
                )
              }
              required
            />

            <Select
              label="Lecture (optional)"
              value={sessionLecture}
              onChange={(e) =>
                setSessionLecture(
                  e.target.value,
                )
              }
            >
              <option value="">
                None
              </option>

              {lectures.map((l) => (
                <option
                  key={l._id}
                  value={l._id}
                >
                  {l.title}
                </option>
              ))}
            </Select>

            <Select
              label="Subject (optional)"
              value={sessionSubject}
              onChange={(e) =>
                setSessionSubject(
                  e.target.value,
                )
              }
            >
              <option value="">
                None
              </option>

              {subjects.map((s) => (
                <option
                  key={s._id}
                  value={s._id}
                >
                  {s.name}
                </option>
              ))}
            </Select>

            <Textarea
              label="Notes (optional)"
              placeholder="What did you study in this session?"
              value={sessionNotes}
              onChange={(e) =>
                setSessionNotes(
                  e.target.value,
                )
              }
              rows={3}
            />
          </form>
        </Modal>

        <Modal
          open={showGoal}
          onClose={() =>
            setShowGoal(false)
          }
          title="Create study goal"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() =>
                  setShowGoal(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveGoal}
                loading={savingGoal}
              >
                Create goal
              </Button>
            </>
          }
        >
          <form
            onSubmit={handleSaveGoal}
            className="space-y-4"
          >
            <Input
              label="Goal title"
              placeholder="e.g. Study 20 hours this week"
              value={goalTitle}
              onChange={(e) =>
                setGoalTitle(
                  e.target.value,
                )
              }
              required
            />

            <Input
              label="Target hours"
              type="number"
              min="1"
              value={goalHours}
              onChange={(e) =>
                setGoalHours(
                  e.target.value,
                )
              }
              required
            />

            <Input
              label="Deadline"
              type="date"
              value={goalDeadline}
              onChange={(e) =>
                setGoalDeadline(
                  e.target.value,
                )
              }
            />
          </form>
        </Modal>

        <ConfirmModal
          open={!!deleteSession}
          onClose={() =>
            setDeleteSession(null)
          }
          onConfirm={() =>
            deleteSession &&
            handleDeleteSession(
              deleteSession,
            )
          }
          title="Delete session?"
          message="This session will be removed from your study records."
          confirmLabel="Delete"
          danger
        />

        <ConfirmModal
          open={!!deleteGoal}
          onClose={() =>
            setDeleteGoal(null)
          }
          onConfirm={() =>
            deleteGoal &&
            handleDeleteGoal(
              deleteGoal,
            )
          }
          title="Delete goal?"
          message="This goal will be permanently deleted."
          confirmLabel="Delete"
          danger
        />
      </div>
    </div>
  );
}