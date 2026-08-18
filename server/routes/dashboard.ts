import { Router } from 'express';
import { Lecture } from '../models/Lecture.js';
import { Note } from '../models/Note.js';
import { Subject } from '../models/Subject.js';
import { StudySession } from '../models/StudySession.js';
import { StudyStreak } from '../models/StudyStreak.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* GET /api/dashboard/stats */
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const [totalLectures, completedLectures, totalNotes, importantNotes, totalSubjects, streak, sessions] =
      await Promise.all([
        Lecture.countDocuments({ userId }),
        Lecture.countDocuments({ userId, completed: true }),
        Note.countDocuments({ userId }),
        Note.countDocuments({ userId, isImportant: true }),
        Subject.countDocuments({ userId }),
        StudyStreak.findOne({ userId }),
        StudySession.find({ userId }),
      ]);

    const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Weekly goal: calculate minutes studied in the last 7 days
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weeklySessions = sessions.filter((s) => new Date(s.date) >= weekAgo);
    const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + s.duration, 0);
    const weeklyTargetMinutes = 10 * 60; // 10 hours per week target
    const weeklyGoalProgress = Math.min(100, Math.round((weeklyMinutes / weeklyTargetMinutes) * 100));

    res.json({
      totalLectures,
      completedLectures,
      totalNotes,
      importantNotes,
      totalSubjects,
      currentStreak: streak?.currentStreak ?? 0,
      totalStudyMinutes,
      weeklyGoalProgress,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

export default router;
