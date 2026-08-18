import { Router } from 'express';
import { FileMetadata } from '../models/FileMetadata.ts';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* GET /api/files */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { lectureId } = req.query;
    const filter: any = { userId: req.userId };

    if (lectureId) filter.lectureId = lectureId;

    const files = await FileMetadata.find(filter).sort({ createdAt: -1 });

    res.json(
      files.map((f) => ({
        _id: f._id.toString(),
        userId: f.userId.toString(),
        lectureId: f.lectureId ? f.lectureId.toString() : undefined,
        fileName: f.fileName,
        fileUrl: f.fileUrl,
        fileType: f.fileType,
        fileSize: f.fileSize,
        createdAt: f.createdAt,
      })),
    );
  } catch {
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

/* POST /api/files */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { lectureId, fileName, fileUrl, fileType, fileSize } = req.body;

    if (!fileName || !fileUrl) {
      res.status(400).json({ message: 'fileName and fileUrl are required' });
      return;
    }

    const file = await FileMetadata.create({
      userId: req.userId,
      lectureId: lectureId || null,
      fileName,
      fileUrl,
      fileType: fileType || '',
      fileSize: fileSize || 0,
    });

    res.status(201).json({
      _id: file._id.toString(),
      userId: file.userId.toString(),
      lectureId: file.lectureId ? file.lectureId.toString() : undefined,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileType: file.fileType,
      fileSize: file.fileSize,
      createdAt: file.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to save file metadata' });
  }
});

/* DELETE /api/files/:id */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const file = await FileMetadata.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    await FileMetadata.deleteOne({
      _id: req.params.id,
      userId: req.userId,
    });

    res.json({ message: 'File deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

export default router;