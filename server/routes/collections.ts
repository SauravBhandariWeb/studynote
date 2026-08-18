import { Router } from 'express';
import { Collection } from '../models/Collection.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* GET /api/collections */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const collections = await Collection.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(
      collections.map((c) => ({
        _id: c._id.toString(),
        userId: c.userId.toString(),
        name: c.name,
        description: c.description,
        lectureIds: c.lectureIds.map((id) => id.toString()),
        createdAt: c.createdAt,
      })),
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
});

/* POST /api/collections */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    const collection = await Collection.create({
      userId: req.userId,
      name,
      description: description || '',
      lectureIds: [],
    });
    res.status(201).json({
      _id: collection._id.toString(),
      userId: collection.userId.toString(),
      name: collection.name,
      description: collection.description,
      lectureIds: [],
      createdAt: collection.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to create collection' });
  }
});

/* PATCH /api/collections/:id */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body;
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { ...(name && { name }), ...(description !== undefined && { description }) } },
      { new: true },
    );
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    res.json({
      _id: collection._id.toString(),
      userId: collection.userId.toString(),
      name: collection.name,
      description: collection.description,
      lectureIds: collection.lectureIds.map((id) => id.toString()),
      createdAt: collection.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to update collection' });
  }
});

/* DELETE /api/collections/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await Collection.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    res.json({ message: 'Collection deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete collection' });
  }
});

/* POST /api/collections/:id/lectures */
router.post('/:id/lectures', async (req: AuthRequest, res) => {
  try {
    const { lectureId } = req.body;
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $addToSet: { lectureIds: lectureId } },
      { new: true },
    );
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    res.json({
      _id: collection._id.toString(),
      userId: collection.userId.toString(),
      name: collection.name,
      description: collection.description,
      lectureIds: collection.lectureIds.map((id) => id.toString()),
      createdAt: collection.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to add lecture to collection' });
  }
});

/* DELETE /api/collections/:id/lectures/:lectureId */
router.delete('/:id/lectures/:lectureId', async (req: AuthRequest, res) => {
  try {
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $pull: { lectureIds: req.params.lectureId } },
      { new: true },
    );
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    res.json({
      _id: collection._id.toString(),
      userId: collection.userId.toString(),
      name: collection.name,
      description: collection.description,
      lectureIds: collection.lectureIds.map((id) => id.toString()),
      createdAt: collection.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to remove lecture from collection' });
  }
});

export default router;
