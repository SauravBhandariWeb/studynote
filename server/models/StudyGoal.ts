import mongoose, { Schema, type Document } from 'mongoose';

export interface IStudyGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetHours: number;
  completedHours: number;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studyGoalSchema = new Schema<IStudyGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    targetHours: { type: Number, required: true, min: 1 },
    completedHours: { type: Number, default: 0, min: 0 },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StudyGoal = mongoose.model<IStudyGoal>('StudyGoal', studyGoalSchema);
