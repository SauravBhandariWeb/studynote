import { Router } from 'express';
import { Note } from '../models/Note.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

function formatNote(n: any) {
  return {
    _id: n._id.toString(),
    userId: n.userId.toString(),
    lectureId: n.lectureId.toString(),
    timestamp: n.timestamp,
    timestampLabel: n.timestampLabel,
    content: n.content,
    isImportant: n.isImportant,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

/* GET /api/lectures/:lectureId/notes */
router.get('/:lectureId/notes', async (req: AuthRequest, res) => {
  try {
    const notes = await Note.find({
      lectureId: req.params.lectureId,
      userId: req.userId,
    }).sort({ timestamp: 1 });
    res.json(notes.map(formatNote));
  } catch {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

export default router;
