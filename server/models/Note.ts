import mongoose, { Schema, type Document } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId;
  content: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Note =
  mongoose.model<INote>(
    "Note",
    noteSchema,
  );
