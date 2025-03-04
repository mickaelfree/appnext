import mongoose, { Schema, Document } from 'mongoose';

export interface IShadowCoding extends Document {
  title: string;
  description: string;
  initialCode: string;
  solutionCode: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  
  // Spaced repetition
  nextReviewDate: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
  
  // Statistiques d'utilisation
  timesAttempted: number;
  timesCompleted: number;
  averageCompletionTime: number; // en secondes
  successRate: number; // pourcentage
  
  // AI generated
  isAIGenerated: boolean;
  generationPrompt?: string;
  focusAreas: string[]; // compétences ciblées
  estimatedTime: number; // en minutes
  
  // Relations
  userId: mongoose.Types.ObjectId;
  
  // Données temporelles
  createdAt: Date;
  updatedAt: Date;
  lastAttemptedAt?: Date;
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
    
    // Spaced repetition
    nextReviewDate: { type: Date, default: Date.now },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    
    // Statistiques d'utilisation
    timesAttempted: { type: Number, default: 0 },
    timesCompleted: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    
    // AI generated
    isAIGenerated: { type: Boolean, default: false },
    generationPrompt: { type: String },
    focusAreas: [{ type: String }],
    estimatedTime: { type: Number, default: 15 },
    
    // Relations
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Données temporelles
    lastAttemptedAt: { type: Date }
  },
  { timestamps: true }
);

// Super-Memo 2 Algorithm implementation for spaced repetition
// https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
ShadowCodingSchema.methods.updateSpacedRepetition = function(quality: number) {
  // quality: 0-5 rating of how well the user recalled the answer
  // 0 = complete blackout, 5 = perfect recall
  
  if (quality < 0) quality = 0;
  if (quality > 5) quality = 5;
  
  // Update repetition count and stats
  this.repetitions += 1;
  this.timesAttempted += 1;
  this.lastAttemptedAt = new Date();
  
  if (quality >= 3) {
    // Successful recall
    this.timesCompleted += 1;
  }
  
  // Update success rate
  this.successRate = (this.timesCompleted / this.timesAttempted) * 100;
  
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
  
  return this.save();
};

// Méthode pour mettre à jour le temps moyen de complétion
ShadowCodingSchema.methods.updateCompletionTime = function(timeSpentSeconds: number) {
  if (this.timesCompleted <= 1) {
    this.averageCompletionTime = timeSpentSeconds;
  } else {
    // Moyenne pondérée pour atténuer l'impact des valeurs aberrantes
    this.averageCompletionTime = 
      (this.averageCompletionTime * (this.timesCompleted - 1) + timeSpentSeconds) / this.timesCompleted;
  }
  
  return this;
};

export default mongoose.models.ShadowCoding || mongoose.model<IShadowCoding>('ShadowCoding', ShadowCodingSchema);