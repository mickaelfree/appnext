import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  category: string;
  
  // Difficulté
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyLevel: number; // 0-new, 1-learning, 2-easy, 3-medium, 4-hard
  
  // Spaced repetition
  nextReviewDate: Date;
  interval: number; // interval in days
  easeFactor: number; // SM-2 algorithm ease factor
  repetitions: number; // times reviewed successfully
  
  // Statistiques d'utilisation
  timesReviewed: number;
  timesCorrect: number;
  successRate: number; // pourcentage
  lastReviewedAt?: Date;
  
  // AI generated
  isAIGenerated: boolean;
  generationPrompt?: string;
  focusAreas: string[]; // compétences ciblées
  
  // Relations
  userId: mongoose.Types.ObjectId;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    
    // Difficulté
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    difficultyLevel: { type: Number, default: 0 }, // 0-new, 1-learning, 2-easy, 3-medium, 4-hard
    
    // Spaced repetition
    nextReviewDate: { type: Date, default: Date.now },
    interval: { type: Number, default: 1 }, // Initial interval of 1 day
    easeFactor: { type: Number, default: 2.5 }, // Initial ease factor (SM-2 default)
    repetitions: { type: Number, default: 0 },
    
    // Statistiques
    timesReviewed: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
    
    // AI generated
    isAIGenerated: { type: Boolean, default: false },
    generationPrompt: { type: String },
    focusAreas: [{ type: String }],
    
    // Relations
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Super-Memo 2 Algorithm implementation for spaced repetition
FlashcardSchema.methods.processReview = function(quality: number) {
  // quality: 0-5 rating of how well the user recalled the answer
  // 0 = complete blackout, 5 = perfect recall
  
  if (quality < 0) quality = 0;
  if (quality > 5) quality = 5;
  
  // Update review statistics
  this.timesReviewed += 1;
  this.lastReviewedAt = new Date();
  
  if (quality >= 3) {
    // Successful recall
    this.timesCorrect += 1;
    this.repetitions += 1;
  }
  
  // Update success rate
  this.successRate = (this.timesCorrect / this.timesReviewed) * 100;
  
  // SM-2 Algorithm implementation
  if (quality < 3) {
    // Failed recall, reset repetitions
    this.repetitions = 0;
    this.interval = 1;
  } else {
    // Successful recall, increase interval
    if (this.repetitions === 1) {
      this.interval = 1;
    } else if (this.repetitions === 2) {
      this.interval = 6;
    } else {
      this.interval = Math.round(this.interval * this.easeFactor);
    }
  }
  
  // Update ease factor
  this.easeFactor = Math.max(
    1.3, // Minimum ease factor
    this.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  // Set next review date based on interval (in days)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + this.interval);
  this.nextReviewDate = nextDate;
  
  // Update difficulty level based on recent performance
  if (this.timesReviewed >= 3) {
    if (this.successRate >= 90) {
      this.difficultyLevel = 2; // Easy
      this.difficulty = 'easy';
    } else if (this.successRate >= 70) {
      this.difficultyLevel = 3; // Medium
      this.difficulty = 'medium';
    } else {
      this.difficultyLevel = 4; // Hard
      this.difficulty = 'hard';
    }
  } else if (this.repetitions > 0) {
    this.difficultyLevel = 1; // Learning
  }
  
  return this.save();
};

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);