import { Router } from 'express';
import { Lecture } from '../models/Lecture.js';
import { Note } from '../models/Note.js';
import type { AuthRequest } from '../middleware/auth.js';
import { getYouTubeThumbnail } from '../utils/helpers.js';

const router = Router();

function formatLecture(l: any) {
  return {
    _id: l._id.toString(),
    userId: l.userId.toString(),
    subjectId: l.subjectId ? l.subjectId.toString() : null,
    title: l.title,
    youtubeId: l.youtubeId,
    channelName: l.channelName,
    thumbnailUrl: l.thumbnailUrl,
    duration: l.duration,
    progress: l.progress,
    completed: l.completed,
    tags: l.tags,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
}

/* GET /api/lectures */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { subjectId, search } = req.query;
    const filter: any = { userId: req.userId };
    if (subjectId) filter.subjectId = subjectId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { channelName: { $regex: search, $options: 'i' } },
      ];
    }
    const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
    res.json(lectures.map(formatLecture));
  } catch {
    res.status(500).json({ message: 'Failed to fetch lectures' });
  }
});

/* GET /api/lectures/:id */
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const lecture = await Lecture.findOne({ _id: req.params.id, userId: req.userId });
    if (!lecture) {
      res.status(404).json({ message: 'Lecture not found' });
      return;
    }
    res.json(formatLecture(lecture));
  } catch {
    res.status(500).json({ message: 'Failed to fetch lecture' });
  }
});

/* POST /api/lectures */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, youtubeId, channelName, subjectId, thumbnailUrl, duration, tags } = req.body;
    if (!youtubeId) {
      res.status(400).json({ message: 'YouTube ID is required' });
      return;
    }
    const existing = await Lecture.findOne({ userId: req.userId, youtubeId });
    if (existing) {
      res.status(409).json({ message: 'This lecture is already in your library' });
      return;
    }
    const lecture = await Lecture.create({
      userId: req.userId,
      subjectId: subjectId || null,
      title: title || `Lecture ${youtubeId}`,
      youtubeId,
      channelName: channelName || '',
      thumbnailUrl: thumbnailUrl || getYouTubeThumbnail(youtubeId),
      duration: duration || '',
      tags: tags || [],
    });
    res.status(201).json(formatLecture(lecture));
  } catch {
    res.status(500).json({ message: 'Failed to create lecture' });
  }
});

/* PATCH /api/lectures/:id */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { title, subjectId, channelName, tags, completed } = req.body;
    const update: any = {};
    if (title !== undefined) update.title = title;
    if (subjectId !== undefined) update.subjectId = subjectId || null;
    if (channelName !== undefined) update.channelName = channelName;
    if (tags !== undefined) update.tags = tags;
    if (completed !== undefined) update.completed = completed;

    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true },
    );
    if (!lecture) {
      res.status(404).json({ message: 'Lecture not found' });
      return;
    }
    res.json(formatLecture(lecture));
  } catch {
    res.status(500).json({ message: 'Failed to update lecture' });
  }
});

/* PATCH /api/lectures/:id/progress */
router.patch('/:id/progress', async (req: AuthRequest, res) => {
  try {
    const { progress, completed } = req.body;
    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        $set: {
          progress: Math.min(100, Math.max(0, progress)),
          ...(completed !== undefined && { completed }),
        },
      },
      { new: true },
    );
    if (!lecture) {
      res.status(404).json({ message: 'Lecture not found' });
      return;
    }
    res.json(formatLecture(lecture));
  } catch {
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

/* DELETE /api/lectures/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    // Delete all notes for this lecture
    await Note.deleteMany({ lectureId: req.params.id, userId: req.userId });
    // Remove from any collections
    const result = await Lecture.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Lecture not found' });
      return;
    }
    res.json({ message: 'Lecture deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete lecture' });
  }
});

export default router;
