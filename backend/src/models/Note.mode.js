// src/models/Note.model.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    reminderDate: {
      type: Date,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, reminderDate: 1 });

const Note = mongoose.model("Note", noteSchema);
export default Note;
