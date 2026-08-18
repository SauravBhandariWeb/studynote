import { Router } from 'express';
import { Note } from '../models/Note.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

function formatNote(n: any) {
  return {
    _id: n._id.toString(),
    userId: n.userId.toString(),
    lectureId: n.lectureId.toString(),
    content: n.content,
    isImportant: n.isImportant,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

/* GET /api/notes */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { important } = req.query;
    const filter: any = { userId: req.userId };

    if (important === 'true') {
      filter.isImportant = true;
    }

    const notes = await Note.find(filter).sort({
      createdAt: -1,
    });

    res.json(notes.map(formatNote));
  } catch {
    res.status(500).json({
      message: 'Failed to fetch notes',
    });
  }
});

/* POST /api/notes */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      lectureId,
      content,
      isImportant,
    } = req.body;

    if (!lectureId || !content) {
      res.status(400).json({
        message:
          'Lecture ID and content are required',
      });

      return;
    }

    const note = await Note.create({
      userId: req.userId,
      lectureId,
      content,
      isImportant: isImportant || false,
    });

    res.status(201).json(
      formatNote(note),
    );
  } catch {
    res.status(500).json({
      message: 'Failed to create note',
    });
  }
});

/* PATCH /api/notes/:id */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const {
      content,
      isImportant,
    } = req.body;

    const update: any = {};

    if (content !== undefined) {
      update.content = content;
    }

    if (isImportant !== undefined) {
      update.isImportant = isImportant;
    }

    const note =
      await Note.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.userId,
        },
        { $set: update },
        { new: true },
      );

    if (!note) {
      res.status(404).json({
        message: 'Note not found',
      });

      return;
    }

    res.json(
      formatNote(note),
    );
  } catch {
    res.status(500).json({
      message: 'Failed to update note',
    });
  }
});

/* DELETE /api/notes/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result =
      await Note.deleteOne({
        _id: req.params.id,
        userId: req.userId,
      });

    if (result.deletedCount === 0) {
      res.status(404).json({
        message: 'Note not found',
      });

      return;
    }

    res.json({
      message: 'Note deleted',
    });
  } catch {
    res.status(500).json({
      message: 'Failed to delete note',
    });
  }
});

export default router;
