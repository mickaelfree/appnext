'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FlashcardProps {
  question: string;
  answer: string;
  onResult: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function FlashcardComponent({ question, answer, onResult }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Utiliser useEffect pour réinitialiser l'état quand les props changent
  useEffect(() => {
    setIsFlipped(false);
    setIsAnswered(false);
  }, [question, answer]);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDifficultySelection = (e: React.MouseEvent, difficulty: 'easy' | 'medium' | 'hard') => {
    // Empêcher le clic de propager et de déclencher un flip de la carte
    e.stopPropagation();
    setIsAnswered(true);
    onResult(difficulty);
  };

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4">
      <div className="w-full h-[300px] sm:h-[400px] relative perspective-1000" onClick={handleFlip}>
        <div 
          className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front of card (Question) */}
          <Card 
            className="absolute inset-0 backface-hidden p-3 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 cursor-pointer"
          >
            <CardContent className="text-center flex-grow flex flex-col justify-center">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Question:</h3>
              <p className="text-lg sm:text-xl overflow-auto max-h-[180px] sm:max-h-[250px] no-scrollbar">{question}</p>
            </CardContent>
            <CardFooter className="text-center text-xs sm:text-sm text-muted-foreground">
              {!isAnswered && "Tap to flip card"}
            </CardFooter>
          </Card>

          {/* Back of card (Answer) */}
          <Card 
            className="absolute inset-0 backface-hidden p-3 sm:p-6 flex flex-col items-center justify-center border-2 border-primary/20 rotate-y-180"
          >
            <CardContent className="text-center flex-grow flex flex-col justify-center w-full">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Answer:</h3>
              <p className="text-lg sm:text-xl overflow-auto max-h-[150px] sm:max-h-[200px] no-scrollbar">{answer}</p>
            </CardContent>
            <CardFooter className="flex justify-center space-x-1 sm:space-x-2 w-full">
              {!isAnswered ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 hover:bg-red-500/10 text-red-500 text-xs sm:text-sm"
                    onClick={(e) => handleDifficultySelection(e, 'hard')}
                  >
                    Hard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 hover:bg-yellow-500/10 text-yellow-500 text-xs sm:text-sm"
                    onClick={(e) => handleDifficultySelection(e, 'medium')}
                  >
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500 hover:bg-green-500/10 text-green-500 text-xs sm:text-sm"
                    onClick={(e) => handleDifficultySelection(e, 'easy')}
                  >
                    Easy
                  </Button>
                </>
              ) : (
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Response recorded
                </span>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}