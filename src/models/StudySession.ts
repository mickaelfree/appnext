import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  sessionType: 'flashcard' | 'shadowCoding' | 'assessment';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  
  // Statistiques générales
  score?: number; // score global
  cardsReviewed?: number;
  correctAnswers?: number;
  codeCompleted?: boolean;
  
  // Utilisateur
  userId: mongoose.Types.ObjectId;
  
  // Détails des exercices
  exerciseDetails: {
    exerciseId: string;
    title: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    success: boolean;
    timeSpent: number; // en secondes
    attempts: number;
    score: number; // 0-100
  }[];
  
  // Métriques de la session
  metrics: {
    averageTimePerExercise: number;
    successRate: number;
    skillsImproved: string[];
  };
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema: Schema = new Schema(
  {
    sessionType: { 
      type: String, 
      enum: ['flashcard', 'shadowCoding', 'assessment'],
      required: true 
    },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    
    // Statistiques générales
    score: { type: Number },
    cardsReviewed: { type: Number },
    correctAnswers: { type: Number },
    codeCompleted: { type: Boolean },
    
    // Utilisateur
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Détails des exercices
    exerciseDetails: [{
      exerciseId: { type: String, required: true },
      title: { type: String, required: true },
      category: { type: String, required: true },
      difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'],
        required: true 
      },
      success: { type: Boolean, required: true },
      timeSpent: { type: Number, required: true },
      attempts: { type: Number, default: 1 },
      score: { type: Number, required: true }
    }],
    
    // Métriques
    metrics: {
      averageTimePerExercise: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
      skillsImproved: [{ type: String }]
    },
    
    notes: { type: String }
  },
  { timestamps: true }
);

// Méthode pour compléter une session
StudySessionSchema.methods.completeSession = function() {
  this.endTime = new Date();
  
  if (this.startTime) {
    // Calculer la durée en minutes
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    this.duration = Math.round(durationMs / 60000); // Convertir ms en minutes
  }
  
  // Calculer les métriques
  if (this.exerciseDetails && this.exerciseDetails.length > 0) {
    const totalTimeSpent = this.exerciseDetails.reduce((sum, ex) => sum + ex.timeSpent, 0);
    this.metrics.averageTimePerExercise = totalTimeSpent / this.exerciseDetails.length;
    
    const succeededExercises = this.exerciseDetails.filter(ex => ex.success).length;
    this.metrics.successRate = succeededExercises / this.exerciseDetails.length;
    
    // Mettre à jour les statistiques spécifiques au type
    if (this.sessionType === 'flashcard') {
      this.cardsReviewed = this.exerciseDetails.length;
      this.correctAnswers = succeededExercises;
    } else if (this.sessionType === 'shadowCoding') {
      this.codeCompleted = succeededExercises > 0;
    }
    
    // Calculer le score global
    const totalScore = this.exerciseDetails.reduce((sum, ex) => sum + ex.score, 0);
    this.score = Math.round(totalScore / this.exerciseDetails.length);
  }
  
  return this.save();
};

// Méthode pour ajouter un exercice à la session
StudySessionSchema.methods.addExercise = function(exercise: {
  exerciseId: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  success: boolean;
  timeSpent: number;
  attempts: number;
  score: number;
}) {
  if (!this.exerciseDetails) {
    this.exerciseDetails = [];
  }
  this.exerciseDetails.push(exercise);
  return this;
};

export default mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', StudySessionSchema);