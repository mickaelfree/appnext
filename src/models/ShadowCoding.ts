import mongoose, { Schema, Document } from 'mongoose';

export interface IShadowCoding extends Document {
  title: string;
  description: string;
  initialCode: string;
  solutionCode: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  nextReviewDate: Date;
  interval: number;
  repetitions: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ShadowCodingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    initialCode: { type: String, default: '' },
    solutionCode: { type: String, required: true },
    language: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    category: { type: String, required: true },
    nextReviewDate: { type: Date, default: Date.now },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.ShadowCoding || mongoose.model<IShadowCoding>('ShadowCoding', ShadowCodingSchema);