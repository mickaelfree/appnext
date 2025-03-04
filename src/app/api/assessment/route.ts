import { NextRequest, NextResponse } from 'next/server';
import { generateSkillAssessment } from '@/lib/groq-service';

export const maxDuration = 120; // Augmenter la durée max à 120 secondes

// Options CORS pour permettre l'accès depuis une application mobile
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Gestion des requêtes OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier la méthode
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Méthode non autorisée' },
        { status: 405, headers: corsHeaders }
      );
    }

    // Validation du corps de la requête
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { learningHistory, userSkills, completedExercises } = body;

    // Validation détaillée des paramètres
    if (!learningHistory || !Array.isArray(learningHistory)) {
      return NextResponse.json(
        { error: 'Le paramètre learningHistory est requis et doit être un tableau' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!userSkills || typeof userSkills !== 'object') {
      return NextResponse.json(
        { error: 'Le paramètre userSkills est requis et doit être un objet' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!completedExercises || !Array.isArray(completedExercises)) {
      return NextResponse.json(
        { error: 'Le paramètre completedExercises est requis et doit être un tableau' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Vérification des données spécifiques
    for (const [skill, value] of Object.entries(userSkills)) {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        return NextResponse.json(
          { error: `La compétence "${skill}" doit avoir une valeur numérique entre 0 et 100` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Appel au service avec gestion du timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 secondes

    try {
      const assessment = await generateSkillAssessment(
        learningHistory,
        userSkills,
        completedExercises
      );

      clearTimeout(timeoutId);
      return NextResponse.json(assessment, { headers: corsHeaders });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'La requête a pris trop de temps' },
          { status: 504, headers: corsHeaders }
        );
      }
      
      throw error; // Relancer pour le gestionnaire d'erreurs global
    }
  } catch (error: any) {
    console.error('Erreur lors de la génération de l\'évaluation:', error);
    
    // Erreurs spécifiques
    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Limite de requêtes atteinte, veuillez réessayer plus tard' },
        { status: 429, headers: corsHeaders }
      );
    }
    
    if (error.message?.includes('invalid api key')) {
      return NextResponse.json(
        { error: 'Problème d\'authentification avec le service externe' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'évaluation',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}