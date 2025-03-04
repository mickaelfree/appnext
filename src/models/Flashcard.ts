import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  category: string;
  difficultyLevel: number;
  nextReviewDate: Date;
  interval: number; // interval in days
  easeFactor: number; // SM-2 algorithm ease factor
  repetitions: number; // how many times reviewed successfully
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    difficultyLevel: { type: Number, default: 0 }, // 0 - new, 1 - learning, 2 - easy, 3 - medium, 4 - hard
    nextReviewDate: { type: Date, default: Date.now },
    interval: { type: Number, default: 1 }, // Initial interval of 1 day
    easeFactor: { type: Number, default: 2.5 }, // Initial ease factor (SM-2 default)
    repetitions: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);