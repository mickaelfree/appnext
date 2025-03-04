import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  type: 'flashcard' | 'shadowCoding';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  cardsReviewed?: number;
  correctAnswers?: number;
  codeCompleted?: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema: Schema = new Schema(
  {
    type: { 
      type: String, 
      enum: ['flashcard', 'shadowCoding'],
      required: true 
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    cardsReviewed: { type: Number },
    correctAnswers: { type: Number },
    codeCompleted: { type: Boolean },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', StudySessionSchema);