import { Router } from 'express';
import { Subject } from '../models/Subject.js';
import { Lecture } from '../models/Lecture.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* GET /api/subjects */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId }).sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      subjects.map(async (s) => {
        const lectureCount = await Lecture.countDocuments({ userId: req.userId, subjectId: s._id });
        return {
          _id: s._id.toString(),
          userId: s.userId.toString(),
          name: s.name,
          color: s.color,
          icon: s.icon,
          lectureCount,
          createdAt: s.createdAt,
        };
      }),
    );
    res.json(withCounts);
  } catch {
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

/* POST /api/subjects */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, color, icon } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    const subject = await Subject.create({
      userId: req.userId,
      name,
      color: color || 'blue',
      icon: icon || 'folder',
    });
    res.status(201).json({
      _id: subject._id.toString(),
      userId: subject.userId.toString(),
      name: subject.name,
      color: subject.color,
      icon: subject.icon,
      lectureCount: 0,
      createdAt: subject.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to create subject' });
  }
});

/* PATCH /api/subjects/:id */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { name, color, icon } = req.body;
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { ...(name && { name }), ...(color && { color }), ...(icon && { icon }) } },
      { new: true },
    );
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }
    res.json({
      _id: subject._id.toString(),
      userId: subject.userId.toString(),
      name: subject.name,
      color: subject.color,
      icon: subject.icon,
      createdAt: subject.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to update subject' });
  }
});

/* DELETE /api/subjects/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    // Unassign lectures from this subject
    await Lecture.updateMany({ subjectId: req.params.id, userId: req.userId }, { $set: { subjectId: null } });
    const result = await Subject.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }
    res.json({ message: 'Subject deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete subject' });
  }
});

export default router;
