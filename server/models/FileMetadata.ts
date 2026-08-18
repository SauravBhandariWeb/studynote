import mongoose, { Schema, type Document } from 'mongoose';

export interface IFileMetadata extends Document {
  userId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId | null;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const fileMetadataSchema = new Schema<IFileMetadata>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', default: null },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const FileMetadata = mongoose.model<IFileMetadata>('FileMetadata', fileMetadataSchema);