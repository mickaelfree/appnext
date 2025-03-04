'use client';

import { useState } from 'react';
import { Navbar } from "@/components/ui/navbar";
import { CodeEditor } from "@/components/shadow-coding/CodeEditor";
import { CodeTimer } from "@/components/shadow-coding/CodeTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuCheck, LuClock, LuPlus } from 'react-icons/lu';
import Link from "next/link";

// Mock data for shadow coding exercises
const mockExercises = [
  {
    id: 1,
    title: 'Implement a Counter Hook',
    description: 'Create a custom React hook that implements a counter with increment, decrement, and reset functionality.',
    language: 'typescript',
    category: 'React',
    difficulty: 'medium',
    initialCode: `// Implement the useCounter hook
function useCounter(initialValue = 0) {
  // Your code here
}

// Example usage:
// const { count, increment, decrement, reset } = useCounter(10);`,
    solutionCode: `// Implement the useCounter hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Example usage:
// const { count, increment, decrement, reset } = useCounter(10);`,
    averageTime: 180, // 3 minutes in seconds
    attempts: 12,
  },
  {
    id: 2,
    title: 'Implement Array.prototype.map',
    description: 'Create your own implementation of the JavaScript Array.map() method.',
    language: 'javascript',
    category: 'JavaScript',
    difficulty: 'easy',
    initialCode: `// Implement your own version of Array.map()
function customMap(arr, callback) {
  // Your code here
}

// Example usage:
// const doubled = customMap([1, 2, 3], (num) => num * 2);
// Result: [2, 4, 6]`,
    solutionCode: `// Implement your own version of Array.map()
function customMap(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }
  return result;
}

// Example usage:
// const doubled = customMap([1, 2, 3], (num) => num * 2);
// Result: [2, 4, 6]`,
    averageTime: 125, // 2 minutes 5 seconds
    attempts: 24,
  },
];

export default function ShadowCodingPage() {
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [userTimes, setUserTimes] = useState<Record<number, number[]>>({});
  
  const handleStartExercise = (id: number) => {
    setCurrentExerciseId(id);
    setTimeSpent(0);
  };
  
  const handleTimeUpdate = (seconds: number) => {
    setTimeSpent(seconds);
  };
  
  const handleCompleteExercise = (success: boolean) => {
    if (currentExerciseId && success) {
      setCompletedExercises(prev => 
        prev.includes(currentExerciseId) ? prev : [...prev, currentExerciseId]
      );
      
      // Record the time for this attempt
      setUserTimes(prev => {
        const existingTimes = prev[currentExerciseId] || [];
        return {
          ...prev,
          [currentExerciseId]: [...existingTimes, timeSpent]
        };
      });
      
      console.log(`Exercise completed in ${timeSpent} seconds`);
    }
  };
  
  const getUserAverageTime = (exerciseId: number): number | undefined => {
    const times = userTimes[exerciseId];
    if (!times || times.length === 0) return undefined;
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / times.length);
  };
  
  const currentExercise = currentExerciseId 
    ? mockExercises.find(ex => ex.id === currentExerciseId) 
    : null;

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shadow Coding</h1>
        
        <Tabs defaultValue="exercises" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercises" className="pt-6">
            {currentExercise ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentExerciseId(null)}
                  >
                    ← Back to exercises
                  </Button>
                  
                  <div className="w-1/3">
                    <CodeTimer 
                      onTimeUpdate={handleTimeUpdate}
                      autoStart={true}
                      averageTime={currentExercise.averageTime}
                      previousAttempts={userTimes[currentExercise.id]?.length || 0}
                    />
                  </div>
                </div>
                
                <CodeEditor 
                  title={currentExercise.title}
                  description={currentExercise.description}
                  language={currentExercise.language}
                  initialCode={currentExercise.initialCode}
                  solutionCode={currentExercise.solutionCode}
                  onComplete={handleCompleteExercise}
                />
                
                {userTimes[currentExercise.id]?.length > 0 && (
                  <div className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Your Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Attempts: {userTimes[currentExercise.id].length}</div>
                            {getUserAverageTime(currentExercise.id) && (
                              <div className="text-sm text-muted-foreground">
                                Your average time: {Math.floor(getUserAverageTime(currentExercise.id)! / 60)}:{String(getUserAverageTime(currentExercise.id)! % 60).padStart(2, '0')}
                              </div>
                            )}
                          </div>
                          <div>
                            {(getUserAverageTime(currentExercise.id) && currentExercise.averageTime) && (
                              <div className={`text-sm ${getUserAverageTime(currentExercise.id)! < currentExercise.averageTime ? 'text-green-500' : 'text-yellow-500'}`}>
                                {getUserAverageTime(currentExercise.id)! < currentExercise.averageTime 
                                  ? `${Math.floor((currentExercise.averageTime - getUserAverageTime(currentExercise.id)!) / 60)}:${String((currentExercise.averageTime - getUserAverageTime(currentExercise.id)!) % 60).padStart(2, '0')} faster than global average`
                                  : `${Math.floor((getUserAverageTime(currentExercise.id)! - currentExercise.averageTime) / 60)}:${String((getUserAverageTime(currentExercise.id)! - currentExercise.averageTime) % 60).padStart(2, '0')} slower than global average`
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockExercises.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-muted ${
                          exercise.difficulty === 'easy' ? 'text-green-500' : 
                          exercise.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {exercise.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {exercise.category}
                        </span>
                      </div>
                      <CardTitle className="text-base">{exercise.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {exercise.description.length > 100 
                          ? `${exercise.description.substring(0, 100)}...` 
                          : exercise.description}
                      </p>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        {exercise.language}
                      </div>
                      <Button 
                        onClick={() => handleStartExercise(exercise.id)}
                        size="sm"
                        className={completedExercises.includes(exercise.id) ? 'bg-green-600' : ''}
                      >
                        {completedExercises.includes(exercise.id) ? (
                          <>
                            <LuCheck className="mr-1 h-4 w-4" /> Completed
                          </>
                        ) : (
                          'Start'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card className="overflow-hidden flex flex-col items-center justify-center p-6 border-dashed border-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <LuPlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4 text-center">
                    Create your own shadow coding exercise
                  </p>
                  <Button>Create New</Button>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="pt-6">
            {completedExercises.length > 0 ? (
              <div className="grid gap-4">
                {mockExercises
                  .filter(ex => completedExercises.includes(ex.id))
                  .map(exercise => (
                    <Card key={exercise.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{exercise.title}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <LuClock className="mr-1 h-4 w-4" />
                            Last practiced: Today
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button 
                          onClick={() => handleStartExercise(exercise.id)}
                          variant="outline"
                          size="sm"
                        >
                          Practice Again
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <LuClock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Completed Exercises Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start practicing shadow coding to see your completed exercises here.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="#exercises">
                      Browse Exercises
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}