import mongoose, { Schema, type Document } from 'mongoose';

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  lectureIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    lectureIds: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }],
  },
  { timestamps: true },
);

export const Collection = mongoose.model<ICollection>('Collection', collectionSchema);
