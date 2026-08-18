import mongoose, { Schema, type Document } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId;
  timestamp: number;
  timestampLabel: string;
  content: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true, index: true },
    timestamp: { type: Number, required: true },
    timestampLabel: { type: String, required: true },
    content: { type: String, required: true, trim: true },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true },
);

noteSchema.index({ lectureId: 1, timestamp: 1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
