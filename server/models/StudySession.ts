import mongoose, { Schema, type Document } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId | null;
  subjectId: mongoose.Types.ObjectId | null;
  duration: number;
  date: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const studySessionSchema = new Schema<IStudySession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', default: null },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    duration: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export const StudySession = mongoose.model<IStudySession>('StudySession', studySessionSchema);
