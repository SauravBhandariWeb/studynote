import { Router } from 'express';
import { StudyGoal } from '../models/StudyGoal.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* GET /api/goals */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const goals = await StudyGoal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(
      goals.map((g) => ({
        _id: g._id.toString(),
        userId: g.userId.toString(),
        title: g.title,
        targetHours: g.targetHours,
        completedHours: g.completedHours,
        deadline: g.deadline,
        completed: g.completed,
        createdAt: g.createdAt,
      })),
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
});

/* POST /api/goals */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, targetHours, deadline } = req.body;
    if (!title || !targetHours) {
      res.status(400).json({ message: 'Title and target hours are required' });
      return;
    }
    const goal = await StudyGoal.create({
      userId: req.userId,
      title,
      targetHours,
      deadline: deadline || new Date(Date.now() + 7 * 86400000),
    });
    res.status(201).json({
      _id: goal._id.toString(),
      userId: goal.userId.toString(),
      title: goal.title,
      targetHours: goal.targetHours,
      completedHours: goal.completedHours,
      deadline: goal.deadline,
      completed: goal.completed,
      createdAt: goal.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to create goal' });
  }
});

/* PATCH /api/goals/:id */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { title, targetHours, completedHours, completed, deadline } = req.body;
    const update: any = {};
    if (title !== undefined) update.title = title;
    if (targetHours !== undefined) update.targetHours = targetHours;
    if (completedHours !== undefined) update.completedHours = completedHours;
    if (completed !== undefined) update.completed = completed;
    if (deadline !== undefined) update.deadline = deadline;

    const goal = await StudyGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true },
    );
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    res.json({
      _id: goal._id.toString(),
      userId: goal.userId.toString(),
      title: goal.title,
      targetHours: goal.targetHours,
      completedHours: goal.completedHours,
      deadline: goal.deadline,
      completed: goal.completed,
      createdAt: goal.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to update goal' });
  }
});

/* DELETE /api/goals/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await StudyGoal.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    res.json({ message: 'Goal deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete goal' });
  }
});

export default router;
