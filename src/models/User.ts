import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  stats: {
    totalStudyTime: number; // in minutes
    flashcardsCreated: number;
    flashcardsMastered: number;
    shadowCodingCreated: number;
    shadowCodingCompleted: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    stats: {
      totalStudyTime: { type: Number, default: 0 },
      flashcardsCreated: { type: Number, default: 0 },
      flashcardsMastered: { type: Number, default: 0 },
      shadowCodingCreated: { type: Number, default: 0 },
      shadowCodingCompleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);