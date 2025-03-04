import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedExercises, SkillAssessment } from '@/lib/groq-service';

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

    const { assessment, existingExercises, exerciseType, count } = body;

    // Validation détaillée des paramètres
    if (!assessment || typeof assessment !== 'object') {
      return NextResponse.json(
        { error: 'Le paramètre assessment est requis et doit être un objet' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validation de la structure de l'évaluation
    if (!assessment.level || !assessment.strengths || !assessment.weaknesses || 
        !assessment.recommendations || assessment.overallScore === undefined) {
      return NextResponse.json(
        { error: 'L\'évaluation fournie est incomplète ou mal formatée' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!existingExercises || !Array.isArray(existingExercises)) {
      return NextResponse.json(
        { error: 'Le paramètre existingExercises est requis et doit être un tableau' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!exerciseType || 
        (exerciseType !== 'flashcard' && exerciseType !== 'shadowCoding')) {
      return NextResponse.json(
        { error: 'Le paramètre exerciseType est requis et doit être "flashcard" ou "shadowCoding"' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validation optionnelle du nombre d'exercices
    const parsedCount = count !== undefined ? parseInt(String(count), 10) : 3;
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 10) {
      return NextResponse.json(
        { error: 'Le paramètre count doit être un nombre entre 1 et 10' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Appel au service avec gestion du timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 secondes

    try {
      const exercises = await generatePersonalizedExercises(
        assessment as SkillAssessment,
        existingExercises,
        exerciseType as 'flashcard' | 'shadowCoding',
        parsedCount
      );

      clearTimeout(timeoutId);
      return NextResponse.json({ exercises, count: exercises.length }, { headers: corsHeaders });
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
    console.error('Erreur lors de la génération d\'exercices:', error);
    
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
        error: 'Erreur lors de la génération d\'exercices',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}