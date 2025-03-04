import Groq from 'groq-sdk';

// Initialiser le client Groq
// Utiliser la clé API de l'environnement
if (!process.env.GROQ_API_KEY) {
  console.warn('GROQ_API_KEY is not set in environment variables. Using fallback key.');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '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',
});

// Le modèle à utiliser
const MODEL = 'llama3-70b-8192';

export interface SkillAssessment {
  level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number; // 0-100
}

export interface GeneratedExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  type: 'flashcard' | 'shadowCoding';
  question?: string; // Pour les flashcards
  answer?: string; // Pour les flashcards
  initialCode?: string; // Pour shadow coding
  solutionCode?: string; // Pour shadow coding
  language?: string; // Pour shadow coding
  estimatedTime: number; // en minutes
  focusAreas: string[]; // Les compétences ciblées
}

// Cache LRU simple pour les réponses de l'API
const assessmentCache = new Map<string, { data: SkillAssessment, timestamp: number }>();
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 heure en ms

/**
 * Génère une évaluation des compétences basée sur l'historique d'apprentissage
 * avec gestion avancée des erreurs, mise en cache et mécanisme de réessai
 */
export async function generateSkillAssessment(
  learningHistory: any[],
  userSkills: Record<string, number>,
  completedExercises: any[]
): Promise<SkillAssessment> {
  // Clé unique pour le cache basée sur les entrées
  const cacheKey = JSON.stringify({
    history: learningHistory,
    skills: userSkills,
    exercises: completedExercises
  });
  
  // Vérifier le cache
  const cachedResult = assessmentCache.get(cacheKey);
  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
    console.log('Utilisation du cache pour l\'évaluation des compétences');
    return cachedResult.data;
  }

  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const prompt = `
        Tu es un coach d'apprentissage expert. Je vais te donner l'historique d'apprentissage d'un utilisateur, 
        ses compétences actuelles et les exercices qu'il a complétés. 
        
        Analyse ces informations et crée une évaluation détaillée de ses compétences.
        
        Historique d'apprentissage: ${JSON.stringify(learningHistory)}
        
        Compétences actuelles (0-100): ${JSON.stringify(userSkills)}
        
        Exercices complétés: ${JSON.stringify(completedExercises)}
        
        Génère une évaluation complète au format JSON avec les champs suivants:
        - level: le niveau global de l'utilisateur ('beginner', 'intermediate', ou 'advanced')
        - strengths: un tableau de ses forces principales (3-5 éléments)
        - weaknesses: un tableau de ses faiblesses principales (3-5 éléments)
        - recommendations: un tableau de recommandations pour progresser (3-5 éléments)
        - overallScore: un score global entre 0 et 100
        
        Retourne uniquement le JSON valide sans explication.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en évaluation des compétences de programmation qui génère des analyses précises au format JSON.',
          },
          { role: 'user', content: prompt },
        ],
        model: MODEL,
        response_format: { type: 'json_object' },
        timeout: 30000, // 30 secondes
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Réponse vide reçue de Groq');
      }

      try {
        const parsedResponse = JSON.parse(responseContent) as SkillAssessment;
        
        // Valider la structure minimum
        if (!parsedResponse.level || !parsedResponse.strengths || !parsedResponse.weaknesses) {
          throw new Error('Structure de réponse JSON invalide');
        }
        
        // Mettre en cache le résultat
        assessmentCache.set(cacheKey, {
          data: parsedResponse,
          timestamp: Date.now()
        });
        
        return parsedResponse;
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Format de réponse invalide');
      }
      
    } catch (error: any) {
      console.error(`Tentative ${retries + 1}/${maxRetries} échouée:`, error);
      
      // Erreurs spécifiques qui justifient une nouvelle tentative
      const retryableErrors = [
        'network error', 'timeout', 'rate limit', 'server error',
        '429', '500', '502', '503', '504'
      ];
      
      const errorMsg = error.message || '';
      const shouldRetry = retryableErrors.some(e => errorMsg.toLowerCase().includes(e));
      
      if (shouldRetry && retries < maxRetries - 1) {
        retries++;
        // Attente exponentielle entre les tentatives
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Si c'est la dernière tentative ou si l'erreur ne justifie pas une nouvelle tentative
        console.error('Erreur finale lors de la génération de l\'évaluation des compétences:', error);
        
        // Retourner une évaluation par défaut en cas d'erreur
        const defaultAssessment = {
          level: 'beginner',
          strengths: ['Apprentissage autodidacte'],
          weaknesses: ['Besoin de plus de pratique'],
          recommendations: ['Continuer à pratiquer régulièrement'],
          overallScore: 50,
        };
        
        return defaultAssessment;
      }
    }
  }
  
  // Ne devrait jamais atteindre ce point, mais TypeScript l'exige
  return {
    level: 'beginner',
    strengths: ['Apprentissage autodidacte'],
    weaknesses: ['Besoin de plus de pratique'],
    recommendations: ['Continuer à pratiquer régulièrement'],
    overallScore: 50,
  };
}

// Cache pour les exercices générés
const exercisesCache = new Map<string, { data: GeneratedExercise[], timestamp: number }>();

/**
 * Génère des exercices personnalisés basés sur l'évaluation des compétences
 * avec gestion d'erreurs améliorée et mise en cache
 */
export async function generatePersonalizedExercises(
  assessment: SkillAssessment,
  existingExercises: any[],
  exerciseType: 'flashcard' | 'shadowCoding',
  count: number = 3
): Promise<GeneratedExercise[]> {
  // Clé unique pour le cache
  const cacheKey = JSON.stringify({
    assessment,
    existingCount: existingExercises.length,
    type: exerciseType,
    count
  });
  
  // Vérifier le cache
  const cachedResult = exercisesCache.get(cacheKey);
  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
    console.log(`Utilisation du cache pour les exercices de type ${exerciseType}`);
    return cachedResult.data;
  }

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const prompt = `
        Tu es un générateur d'exercices d'apprentissage personnalisés. Je vais te donner une évaluation 
        des compétences d'un utilisateur et la liste des exercices qu'il a déjà faits.
        
        En fonction de ces informations, génère ${count} nouveaux exercices de type ${exerciseType} 
        qui ciblent ses faiblesses et l'aident à progresser.
        
        Évaluation des compétences: ${JSON.stringify(assessment)}
        
        Exercices existants: ${JSON.stringify(existingExercises)}
        
        Pour chaque exercice généré, fournis les informations suivantes au format JSON:
        - id: un identifiant unique sous forme de chaîne (ex: "gen-123")
        - title: un titre concis et descriptif
        - description: une description détaillée de l'exercice
        - difficulty: la difficulté ('easy', 'medium', 'hard')
        - category: la catégorie de l'exercice
        - type: "${exerciseType}"
        ${exerciseType === 'flashcard' ? `
        - question: la question à poser
        - answer: la réponse détaillée
        ` : `
        - initialCode: le code de départ (incomplet)
        - solutionCode: la solution complète
        - language: le langage de programmation
        `}
        - estimatedTime: temps estimé pour compléter l'exercice (en minutes)
        - focusAreas: un tableau des compétences ciblées par cet exercice
        
        Assure-toi que les exercices sont progressifs, pertinents et adaptés au niveau de l'utilisateur.
        Retourne un objet JSON avec une propriété "exercises" contenant un tableau des exercices générés.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en création d\'exercices de programmation personnalisés qui génère des exercices au format JSON.',
          },
          { role: 'user', content: prompt },
        ],
        model: MODEL,
        response_format: { type: 'json_object' },
        timeout: 30000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Réponse vide reçue de Groq');
      }

      try {
        const parsedResponse = JSON.parse(responseContent);
        const exercises = parsedResponse.exercises || [];
        
        // Validation minimale
        if (!Array.isArray(exercises)) {
          throw new Error('La réponse ne contient pas un tableau d\'exercices valide');
        }
        
        if (exercises.length === 0) {
          throw new Error('Aucun exercice généré');
        }
        
        // Ajouter des IDs uniques si manquants
        const validatedExercises = exercises.map((ex, index) => ({
          ...ex,
          id: ex.id || `gen-${Date.now()}-${index}`
        }));
        
        // Mettre en cache
        exercisesCache.set(cacheKey, {
          data: validatedExercises,
          timestamp: Date.now()
        });
        
        return validatedExercises;
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Format de réponse invalide');
      }
      
    } catch (error: any) {
      console.error(`Tentative ${retries + 1}/${maxRetries} échouée:`, error);
      
      // Erreurs justifiant une nouvelle tentative
      const retryableErrors = [
        'network error', 'timeout', 'rate limit', 'server error',
        '429', '500', '502', '503', '504'
      ];
      
      const errorMsg = error.message || '';
      const shouldRetry = retryableErrors.some(e => errorMsg.toLowerCase().includes(e));
      
      if (shouldRetry && retries < maxRetries - 1) {
        retries++;
        // Attente exponentielle
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Exercices par défaut adaptés au type
        const defaultExercises = Array.from({ length: count }, (_, i) => ({
          id: `gen-default-${Date.now()}-${i}`,
          title: `Exercice ${exerciseType} par défaut ${i+1}`,
          description: `Un exercice simple de type ${exerciseType} pour continuer à pratiquer`,
          difficulty: ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard',
          category: exerciseType === 'flashcard' ? 'Général' : 'JavaScript',
          type: exerciseType,
          ...(exerciseType === 'flashcard' 
            ? {
                question: `Question par défaut ${i+1} sur la programmation`,
                answer: 'Réponse par défaut expliquant le concept de manière simple et claire.'
              } 
            : {
                initialCode: '// Implémente une fonction qui additionne deux nombres\nfunction add(a, b) {\n  // Ton code ici\n}',
                solutionCode: 'function add(a, b) {\n  return a + b;\n}',
                language: 'javascript'
              }
          ),
          estimatedTime: 10,
          focusAreas: ['Concepts de base']
        }));
        
        return defaultExercises;
      }
    }
  }
  
  // Ne devrait jamais atteindre ce point
  return [{
    id: `gen-default-${Date.now()}`,
    title: 'Exercice par défaut',
    description: `Un exercice simple de type ${exerciseType}`,
    difficulty: 'medium',
    category: exerciseType === 'flashcard' ? 'Général' : 'JavaScript',
    type: exerciseType,
    ...(exerciseType === 'flashcard' 
      ? {
          question: 'Qu\'est-ce que la programmation asynchrone?',
          answer: 'La programmation asynchrone permet d\'exécuter des tâches sans bloquer le thread principal, améliorant ainsi les performances des applications.'
        } 
      : {
          initialCode: '// Implémente une fonction qui additionne deux nombres\nfunction add(a, b) {\n  // Ton code ici\n}',
          solutionCode: 'function add(a, b) {\n  return a + b;\n}',
          language: 'javascript'
        }
    ),
    estimatedTime: 10,
    focusAreas: ['Concepts de base']
  }];
}

// Cache pour les points de blocage
const blockingPointsCache = new Map<string, { data: { blockingPoints: string[], recommendedFocus: string[] }, timestamp: number }>();

/**
 * Identifie les points de blocage basés sur les performances d'un utilisateur
 * avec gestion avancée des erreurs et mise en cache
 */
export async function identifyBlockingPoints(
  userPerformance: any[],
  failedExercises: any[]
): Promise<{ blockingPoints: string[], recommendedFocus: string[] }> {
  // Clé unique pour le cache
  const cacheKey = JSON.stringify({
    performance: userPerformance,
    failed: failedExercises
  });
  
  // Vérifier le cache
  const cachedResult = blockingPointsCache.get(cacheKey);
  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
    console.log('Utilisation du cache pour les points de blocage');
    return cachedResult.data;
  }

  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const prompt = `
        Tu es un coach d'apprentissage spécialisé dans l'identification des points de blocage.
        
        Analyse les performances de l'utilisateur et ses exercices échoués pour identifier
        les concepts ou compétences qui lui posent problème.
        
        Performances de l'utilisateur: ${JSON.stringify(userPerformance)}
        
        Exercices échoués: ${JSON.stringify(failedExercises)}
        
        Génère une analyse au format JSON avec:
        - blockingPoints: un tableau des principaux points de blocage identifiés (concepts spécifiques, techniques, etc.)
        - recommendedFocus: un tableau de domaines sur lesquels l'utilisateur devrait se concentrer
        
        Assure-toi que les points de blocage sont détaillés et spécifiques aux difficultés de l'utilisateur.
        Les recommandations doivent être concrètes et actionnables.
        
        Retourne uniquement le JSON valide sans explication.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse des difficultés d\'apprentissage qui génère des analyses au format JSON.',
          },
          { role: 'user', content: prompt },
        ],
        model: MODEL,
        response_format: { type: 'json_object' },
        timeout: 30000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Réponse vide reçue de Groq');
      }

      try {
        const parsedResponse = JSON.parse(responseContent) as { blockingPoints: string[], recommendedFocus: string[] };
        
        // Validation minimale
        if (!parsedResponse.blockingPoints || !parsedResponse.recommendedFocus) {
          throw new Error('Structure de réponse JSON invalide');
        }
        
        if (!Array.isArray(parsedResponse.blockingPoints) || !Array.isArray(parsedResponse.recommendedFocus)) {
          throw new Error('Les champs blockingPoints et recommendedFocus doivent être des tableaux');
        }
        
        // Mettre en cache le résultat
        blockingPointsCache.set(cacheKey, {
          data: parsedResponse,
          timestamp: Date.now()
        });
        
        return parsedResponse;
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Format de réponse invalide');
      }
      
    } catch (error: any) {
      console.error(`Tentative ${retries + 1}/${maxRetries} échouée:`, error);
      
      // Erreurs justifiant une nouvelle tentative
      const retryableErrors = [
        'network error', 'timeout', 'rate limit', 'server error',
        '429', '500', '502', '503', '504'
      ];
      
      const errorMsg = error.message || '';
      const shouldRetry = retryableErrors.some(e => errorMsg.toLowerCase().includes(e));
      
      if (shouldRetry && retries < maxRetries - 1) {
        retries++;
        // Attente exponentielle
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Analyse par défaut en cas d'erreur finale
        console.error('Erreur finale lors de l\'identification des points de blocage:', error);
        
        // Adapter la réponse par défaut au contexte si possible
        let defaultBlockingPoints = ['Compréhension des concepts avancés'];
        let defaultRecommendedFocus = ['Pratiquer régulièrement', 'Revoir les notions de base'];
        
        // Si nous avons des exercices échoués, essayer de déduire des informations
        if (failedExercises && failedExercises.length > 0) {
          const categories = failedExercises
            .map(ex => ex.category || '')
            .filter(Boolean);
          
          if (categories.length > 0) {
            // Utiliser les catégories des exercices échoués
            defaultBlockingPoints = [`Difficultés avec ${categories.join(', ')}`];
            defaultRecommendedFocus = [`Se concentrer sur ${categories.join(', ')}`];
          }
        }
        
        return {
          blockingPoints: defaultBlockingPoints,
          recommendedFocus: defaultRecommendedFocus
        };
      }
    }
  }
  
  // Ne devrait jamais atteindre ce point
  return {
    blockingPoints: ['Compréhension des concepts avancés'],
    recommendedFocus: ['Pratiquer régulièrement', 'Revoir les notions de base']
  };
}