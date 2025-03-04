import { NextRequest, NextResponse } from 'next/server';
import { identifyBlockingPoints } from '@/lib/groq-service';

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

    const { userPerformance, failedExercises } = body;

    // Validation détaillée des paramètres
    if (!userPerformance || !Array.isArray(userPerformance)) {
      return NextResponse.json(
        { error: 'Le paramètre userPerformance est requis et doit être un tableau' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!failedExercises || !Array.isArray(failedExercises)) {
      return NextResponse.json(
        { error: 'Le paramètre failedExercises est requis et doit être un tableau' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validation spécifique du format des performances
    if (userPerformance.length > 0) {
      for (const perf of userPerformance) {
        if (!perf.category || typeof perf.averageScore !== 'number') {
          return NextResponse.json(
            { error: 'Les performances utilisateur doivent contenir au moins une catégorie et un score moyen' },
            { status: 400, headers: corsHeaders }
          );
        }
      }
    }

    // Appel au service avec gestion du timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 secondes

    try {
      const analysis = await identifyBlockingPoints(
        userPerformance,
        failedExercises
      );

      clearTimeout(timeoutId);
      return NextResponse.json({
        ...analysis,
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
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
    console.error('Erreur lors de l\'analyse des points de blocage:', error);
    
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
        error: 'Erreur lors de l\'analyse des points de blocage',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}