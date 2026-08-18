import mongoose, { Schema, type Document } from 'mongoose';

export interface ILecture extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId | null;
  title: string;
  youtubeId: string;
  channelName: string;
  thumbnailUrl: string;
  duration: string;
  progress: number;
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    title: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true },
    channelName: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

lectureSchema.index({ userId: 1, youtubeId: 1 }, { unique: true });
lectureSchema.index({ userId: 1, subjectId: 1 });

export const Lecture = mongoose.model<ILecture>('Lecture', lectureSchema);
