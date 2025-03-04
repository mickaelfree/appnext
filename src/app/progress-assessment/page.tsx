'use client';

import { useState, useEffect } from 'react';
import { useGroqService } from '@/lib/hooks/useGroqService';
import { Navbar } from "@/components/ui/navbar";
import { ClientOnlyRadarChart } from "@/components/stats/ClientOnlyRadarChart";
import { SkillAssessment, GeneratedExercise } from '@/lib/groq-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuBrain, LuCode, LuClock, LuTrendingUp, LuBookOpen, LuCheck, LuTriangleAlert, LuLightbulb } from 'react-icons/lu';
import Link from 'next/link';

// Service pour récupérer les données utilisateur (version mock)
export async function getUserData(userId: string) {
  // Données mockup
  return {
    name: 'Utilisateur Test',
    email: 'test@example.com',
    stats: {
      totalStudyTime: 450,
      flashcardsCreated: 35,
      flashcardsMastered: 28,
      shadowCodingCreated: 15,
      shadowCodingCompleted: 12
    }
  };
}

// Service pour récupérer l'historique d'apprentissage (version mock)
export async function getLearningHistory(userId: string) {
  // Données mockup
  return [
    { id: "1", date: '2025-03-01', type: 'flashcard', category: 'JavaScript', score: 85, timeSpent: 20 },
    { id: "2", date: '2025-03-02', type: 'shadowCoding', category: 'React', score: 70, timeSpent: 45 },
    { id: "3", date: '2025-03-03', type: 'flashcard', category: 'CSS', score: 90, timeSpent: 15 },
    { id: "4", date: '2025-03-04', type: 'shadowCoding', category: 'TypeScript', score: 65, timeSpent: 50 },
    { id: "5", date: '2025-03-05', type: 'flashcard', category: 'JavaScript', score: 88, timeSpent: 25 },
  ];
}

// Service pour récupérer les compétences de l'utilisateur (version mock)
export async function getUserSkills(userId: string) {
  // Données mockup
  return {
    'JavaScript': 85,
    'React': 68,
    'TypeScript': 72,
    'CSS': 92,
    'Node.js': 65,
    'Testing': 58,
    'API Design': 75,
    'Database': 63,
  };
}

// Service pour récupérer les exercices complétés (version mock)
export async function getCompletedExercises(userId: string) {
  // Données mockup
  return [
    { id: "1", type: 'flashcard', category: 'JavaScript', title: 'ES6 Features', difficulty: 'medium', success: true },
    { id: "2", type: 'shadowCoding', category: 'React', title: 'Custom Hook Implementation', difficulty: 'hard', success: false },
    { id: "3", type: 'flashcard', category: 'CSS', title: 'Flexbox Layout', difficulty: 'easy', success: true },
    { id: "4", type: 'shadowCoding', category: 'JavaScript', title: 'Array Methods', difficulty: 'medium', success: true },
  ];
}

// Service pour récupérer les performances par catégorie (version mock)
export async function getUserPerformance(userId: string) {
  // Données mockup
  return [
    { category: 'JavaScript', averageScore: 85, timeSpent: 120, successRate: 0.8 },
    { category: 'React', averageScore: 70, timeSpent: 180, successRate: 0.65 },
    { category: 'CSS', averageScore: 90, timeSpent: 90, successRate: 0.95 },
    { category: 'TypeScript', averageScore: 65, timeSpent: 150, successRate: 0.6 },
  ];
}

// Service pour récupérer les exercices échoués (version mock)
export async function getFailedExercises(userId: string) {
  // Données mockup
  return [
    { id: "2", type: 'shadowCoding', category: 'React', title: 'Custom Hook Implementation', difficulty: 'hard', errorPattern: 'Logic error' },
    { id: "5", type: 'flashcard', category: 'TypeScript', title: 'Type Interfaces', difficulty: 'medium', errorPattern: 'Conceptual misunderstanding' },
  ];
}

// Pour la démo, on utilise un ID statique, en prod ce serait déterminé par l'authentification
const DEMO_USER_ID = '65ea7a8d4b7e41c9e1234567';

// Services avec version asynchrone
const mockLearningHistory = getLearningHistory(DEMO_USER_ID);
const mockUserSkills = getUserSkills(DEMO_USER_ID);
const mockCompletedExercises = getCompletedExercises(DEMO_USER_ID);
const mockUserPerformance = getUserPerformance(DEMO_USER_ID);
const mockFailedExercises = getFailedExercises(DEMO_USER_ID);

export default function ProgressAssessmentPage() {
  const { 
    getSkillAssessment, 
    getPersonalizedExercises, 
    getBlockingPoints,
    isLoadingAssessment,
    isLoadingExercises,
    isLoadingBlockingPoints,
    error
  } = useGroqService();

  const [assessment, setAssessment] = useState<SkillAssessment | null>(null);
  const [blockingPoints, setBlockingPoints] = useState<{ blockingPoints: string[], recommendedFocus: string[] } | null>(null);
  const [flashcardExercises, setFlashcardExercises] = useState<GeneratedExercise[] | null>(null);
  const [shadowCodingExercises, setShadowCodingExercises] = useState<GeneratedExercise[] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fonction pour charger les données initiales
    const loadInitialData = async () => {
      try {
        // Récupérer les données pour l'évaluation des compétences
        const [
          learningHistory, 
          userSkills, 
          completedExercises,
          userPerformance,
          failedExercisesData
        ] = await Promise.all([
          mockLearningHistory,
          mockUserSkills,
          mockCompletedExercises,
          mockUserPerformance,
          mockFailedExercises
        ]);
      
        // Obtenir l'évaluation des compétences
        const assessmentResult = await getSkillAssessment(
          learningHistory,
          userSkills,
          completedExercises
        );
        
        if (assessmentResult) {
          setAssessment(assessmentResult);
          
          // Stocker l'évaluation dans l'historique de l'utilisateur si on est en prod
          // await storeAssessmentInUserHistory(DEMO_USER_ID, assessmentResult);
          
          // Exécuter les appels API en parallèle pour de meilleures performances
          const [blockingPointsResult, flashcardExercisesResult, shadowCodingExercisesResult] = 
            await Promise.all([
              // Obtenir les points de blocage
              getBlockingPoints(userPerformance, failedExercisesData),
              
              // Obtenir des exercices personnalisés de type flashcard
              getPersonalizedExercises(
                assessmentResult,
                completedExercises,
                'flashcard',
                2
              ),
              
              // Obtenir des exercices personnalisés de type shadow coding
              getPersonalizedExercises(
                assessmentResult,
                completedExercises,
                'shadowCoding',
                2
              )
            ]);
          
          if (blockingPointsResult) {
            setBlockingPoints(blockingPointsResult);
          }
          
          if (flashcardExercisesResult) {
            setFlashcardExercises(flashcardExercisesResult);
          }
          
          if (shadowCodingExercisesResult) {
            setShadowCodingExercises(shadowCodingExercisesResult);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Gérer l'erreur (afficher un message, etc.)
      }
    };
    
    loadInitialData();
  }, []);

  // Méthode pour générer un score de niveau visuel (1-5)
  const getLevelScore = (level: string): number => {
    switch (level) {
      case 'beginner': return 2;
      case 'intermediate': return 3.5;
      case 'advanced': return 5;
      default: return 1;
    }
  };
  
  // Cette fonction peut-être utilisée pour générer des exercices supplémentaires
  const handleGenerateMoreExercises = async (type: 'flashcard' | 'shadowCoding') => {
    if (!assessment) return;
    
    const exercisesResult = await getPersonalizedExercises(
      assessment,
      type === 'flashcard' ? flashcardExercises || [] : shadowCodingExercises || [],
      type,
      3
    );
    
    if (exercisesResult) {
      if (type === 'flashcard') {
        setFlashcardExercises([...(flashcardExercises || []), ...exercisesResult]);
      } else {
        setShadowCodingExercises([...(shadowCodingExercises || []), ...exercisesResult]);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Évaluation de progression</h1>
        
        {error && (
          <Card className="mb-6 border-red-500">
            <CardContent className="pt-6 text-red-500">
              <p>{error}</p>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="exercises">Exercices</TabsTrigger>
          </TabsList>
          
          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="pt-6">
            {isLoadingAssessment ? (
              <Card className="mb-6">
                <CardContent className="flex justify-center items-center h-60">
                  <div className="text-center">
                    <div className="spinner h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Génération de l'évaluation en cours...</p>
                  </div>
                </CardContent>
              </Card>
            ) : assessment ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Niveau de compétence</CardTitle>
                      <CardDescription>Votre niveau actuel basé sur vos performances</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-4xl font-bold text-primary">{assessment.level}</div>
                        <div className="w-1/2">
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ 
                                width: `${(getLevelScore(assessment.level) / 5) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Débutant</span>
                            <span>Intermédiaire</span>
                            <span>Avancé</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span>Score global</span>
                          <span className="font-bold">{assessment.overallScore}/100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${assessment.overallScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Forces et faiblesses</CardTitle>
                      <CardDescription>Vos points forts et axes d'amélioration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <LuCheck className="mr-2 text-green-500" /> Points forts
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {assessment.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span> {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <LuTriangleAlert className="mr-2 text-yellow-500" /> Points à améliorer
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {assessment.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span> {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {blockingPoints && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Points de blocage</CardTitle>
                      <CardDescription>Concepts ou compétences qui ralentissent votre progression</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Difficultés identifiées</h3>
                          <ul className="space-y-1 text-sm">
                            {blockingPoints.blockingPoints.map((point, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span> {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Domaines à cibler</h3>
                          <div className="flex flex-wrap gap-2">
                            {blockingPoints.recommendedFocus.map((focus, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {focus}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="#recommendations">
                          Voir les recommandations détaillées
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </>
            ) : (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Aucune évaluation disponible. Veuillez réessayer plus tard.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Onglet Compétences */}
          <TabsContent value="skills" className="pt-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Radar des compétences</CardTitle>
                <CardDescription>Visualisation de vos compétences par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ClientOnlyRadarChart 
                    labels={Object.keys(mockUserSkills)}
                    data={Object.values(mockUserSkills)}
                    label="Niveau de maîtrise (%)"
                    backgroundColor="rgba(79, 70, 229, 0.2)"
                    borderColor="rgba(79, 70, 229, 1)"
                    height={360}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Détail des compétences</CardTitle>
                <CardDescription>Niveau de maîtrise par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockUserSkills).map(([skill, level]) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{skill}</span>
                        <span className="text-muted-foreground">{level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Recommandations */}
          <TabsContent value="recommendations" className="pt-6" id="recommendations">
            {assessment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LuLightbulb className="mr-2 text-yellow-500" />
                    Recommandations personnalisées
                  </CardTitle>
                  <CardDescription>
                    Basées sur votre niveau et vos points à améliorer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {assessment.recommendations.map((recommendation, index) => (
                      <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-base mb-2">Recommandation {index + 1}</h3>
                        <p className="text-muted-foreground">{recommendation}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full" onClick={() => setActiveTab('exercises')}>
                    <Link href="#exercises">
                      Voir les exercices recommandés
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Aucune recommandation disponible. Veuillez générer une évaluation d'abord.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Onglet Exercices */}
          <TabsContent value="exercises" className="pt-6" id="exercises">
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LuBrain className="mr-2 text-primary" />
                    Flashcards recommandées
                  </CardTitle>
                  <CardDescription>
                    Exercices de mémorisation adaptés à votre niveau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingExercises ? (
                    <div className="text-center py-8">
                      <div className="spinner h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Génération des exercices...</p>
                    </div>
                  ) : flashcardExercises && flashcardExercises.length > 0 ? (
                    <ul className="space-y-4">
                      {flashcardExercises.map((exercise) => (
                        <li key={exercise.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{exercise.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500' :
                              exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500' :
                              'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500'
                            }`}>
                              {exercise.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <LuClock className="mr-1 h-3 w-3" />
                            {exercise.estimatedTime} min
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Aucun exercice disponible
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoadingExercises || !flashcardExercises}
                    onClick={() => handleGenerateMoreExercises('flashcard')}
                  >
                    Générer plus
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/flashcards">
                      Commencer l'exercice
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LuCode className="mr-2 text-primary" />
                    Shadow Coding recommandé
                  </CardTitle>
                  <CardDescription>
                    Exercices de programmation adaptés à votre niveau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingExercises ? (
                    <div className="text-center py-8">
                      <div className="spinner h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Génération des exercices...</p>
                    </div>
                  ) : shadowCodingExercises && shadowCodingExercises.length > 0 ? (
                    <ul className="space-y-4">
                      {shadowCodingExercises.map((exercise) => (
                        <li key={exercise.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{exercise.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500' :
                              exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500' :
                              'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500'
                            }`}>
                              {exercise.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                          <div className="text-xs bg-muted p-2 rounded mb-3 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            {exercise.initialCode?.split('\n')[0]}...
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{exercise.language}</span>
                            <div className="flex items-center">
                              <LuClock className="mr-1 h-3 w-3" />
                              {exercise.estimatedTime} min
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Aucun exercice disponible
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoadingExercises || !shadowCodingExercises}
                    onClick={() => handleGenerateMoreExercises('shadowCoding')}
                  >
                    Générer plus
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/shadow-coding">
                      Commencer l'exercice
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}