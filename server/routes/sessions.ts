import { Router } from 'express';
import { StudySession } from '../models/StudySession.js';
import { StudyStreak } from '../models/StudyStreak.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

function isYesterday(d1: Date, d2: Date): boolean {
  const yesterday = new Date(d2);
  yesterday.setDate(yesterday.getDate() - 1);
  return d1.toDateString() === yesterday.toDateString();
}

async function updateStreak(userId: string, duration: number): Promise<void> {
  const today = new Date();
  let streak = await StudyStreak.findOne({ userId });

  if (!streak) {
    streak = await StudyStreak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastStudyDate: today,
      totalSessions: 1,
      totalMinutes: duration,
    });
    return;
  }

  // Check if already studied today
  if (streak.lastStudyDate && isSameDay(streak.lastStudyDate, today)) {
    // Already counted today, just add to totals
    streak.totalSessions += 1;
    streak.totalMinutes += duration;
    await streak.save();
    return;
  }

  // Check if yesterday → continue streak
  if (streak.lastStudyDate && isYesterday(streak.lastStudyDate, today)) {
    streak.currentStreak += 1;
  } else {
    // Streak broken
    streak.currentStreak = 1;
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastStudyDate = today;
  streak.totalSessions += 1;
  streak.totalMinutes += duration;
  await streak.save();
}

/* GET /api/sessions */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.userId }).sort({ date: -1 });
    res.json(
      sessions.map((s) => ({
        _id: s._id.toString(),
        userId: s.userId.toString(),
        lectureId: s.lectureId ? s.lectureId.toString() : null,
        subjectId: s.subjectId ? s.subjectId.toString() : null,
        duration: s.duration,
        date: s.date,
        notes: s.notes,
        createdAt: s.createdAt,
      })),
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

/* POST /api/sessions */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { lectureId, subjectId, duration, notes } = req.body;
    if (!duration || duration < 1) {
      res.status(400).json({ message: 'Duration must be at least 1 minute' });
      return;
    }
    const session = await StudySession.create({
      userId: req.userId,
      lectureId: lectureId || null,
      subjectId: subjectId || null,
      duration,
      notes: notes || '',
      date: new Date(),
    });

    // Update streak
    await updateStreak(req.userId!, duration);

    res.status(201).json({
      _id: session._id.toString(),
      userId: session.userId.toString(),
      lectureId: session.lectureId ? session.lectureId.toString() : null,
      subjectId: session.subjectId ? session.subjectId.toString() : null,
      duration: session.duration,
      date: session.date,
      notes: session.notes,
      createdAt: session.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to create session' });
  }
});

/* DELETE /api/sessions/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await StudySession.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.json({ message: 'Session deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

/* GET /api/streak */
router.get('/streak', async (req: AuthRequest, res) => {
  try {
    let streak = await StudyStreak.findOne({ userId: req.userId });
    if (!streak) {
      streak = await StudyStreak.create({
        userId: req.userId,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        totalSessions: 0,
        totalMinutes: 0,
      });
    }
    res.json({
      _id: streak._id.toString(),
      userId: streak.userId.toString(),
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastStudyDate: streak.lastStudyDate,
      totalSessions: streak.totalSessions,
      totalMinutes: streak.totalMinutes,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch streak' });
  }
});

export default router;
