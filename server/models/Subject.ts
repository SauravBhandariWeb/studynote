import mongoose, { Schema, type Document } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: 'blue' },
    icon: { type: String, default: 'folder' },
  },
  { timestamps: true },
);

subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
