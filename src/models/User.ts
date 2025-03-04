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
  
  // Niveaux de compétence
  skills: Map<string, number>; // name: level (0-100)
  
  // Préférences utilisateur
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    exerciseDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
    studySessionDuration: number; // minutes
  };
  
  // Historique d'évaluations
  assessmentHistory: {
    date: Date;
    level: 'beginner' | 'intermediate' | 'advanced';
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
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
    
    // Niveaux de compétence
    skills: { 
      type: Map, 
      of: Number,
      default: () => new Map([
        ['JavaScript', 50],
        ['HTML', 50],
        ['CSS', 50],
        ['React', 50],
        ['Node.js', 50]
      ])
    },
    
    // Préférences utilisateur
    preferences: {
      theme: { 
        type: String, 
        enum: ['light', 'dark', 'system'], 
        default: 'system' 
      },
      language: { type: String, default: 'fr' },
      exerciseDifficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard', 'adaptive'], 
        default: 'adaptive' 
      },
      studySessionDuration: { type: Number, default: 30 }
    },
    
    // Historique d'évaluations
    assessmentHistory: [{
      date: { type: Date, default: Date.now },
      level: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
      },
      overallScore: { type: Number, required: true },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }]
    }],
    
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

// Méthode pour ajouter une nouvelle évaluation à l'historique
UserSchema.methods.addAssessment = function(assessment: {
  level: 'beginner' | 'intermediate' | 'advanced';
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}) {
  this.assessmentHistory.push({
    date: new Date(),
    ...assessment
  });
  return this.save();
};

// Méthode pour mettre à jour les compétences
UserSchema.methods.updateSkill = function(skillName: string, newValue: number) {
  if (newValue < 0) newValue = 0;
  if (newValue > 100) newValue = 100;
  
  this.skills.set(skillName, newValue);
  return this.save();
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);