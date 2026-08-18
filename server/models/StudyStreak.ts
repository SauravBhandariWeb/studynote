import mongoose, { Schema, type Document } from 'mongoose';

export interface IStudyStreak extends Document {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date | null;
  totalSessions: number;
  totalMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const studyStreakSchema = new Schema<IStudyStreak>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date, default: null, required: false },
    totalSessions: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const StudyStreak = mongoose.model<IStudyStreak>('StudyStreak', studyStreakSchema);
