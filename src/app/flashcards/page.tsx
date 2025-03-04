'use client';

import { useState } from 'react';
import { Navbar } from "@/components/ui/navbar";
import { FlashcardComponent } from '@/components/flashcard/FlashcardComponent';
import { AddFlashcardForm } from '@/components/flashcard/AddFlashcardForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuArrowRight, LuCheck } from 'react-icons/lu';
import Link from "next/link";

// Mock data for demonstration
const mockFlashcards = [
  {
    id: 1,
    question: 'What is the difference between var, let, and const in JavaScript?',
    answer: 'var is function-scoped, hoisted, and can be redeclared. let and const are block-scoped. let can be reassigned but not redeclared. const cannot be reassigned or redeclared.',
    category: 'JavaScript',
    nextReviewDate: new Date(),
  },
  {
    id: 2,
    question: 'Explain the CSS Box Model',
    answer: 'The CSS Box Model consists of: content, padding, border, and margin, from inside to outside. It defines how elements are sized and spaced on a page.',
    category: 'CSS',
    nextReviewDate: new Date(),
  },
  {
    id: 3,
    question: 'What is a React Hook?',
    answer: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Examples include useState, useEffect, useContext, etc.',
    category: 'React',
    nextReviewDate: new Date(),
  },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('review');

  const currentCard = mockFlashcards[currentIndex];
  const isSessionComplete = completedCards.length === mockFlashcards.length;

  const handleFlashcardResult = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Ajouter la carte actuelle aux cartes complétées
    setCompletedCards(prev => [...prev, currentCard.id]);
    
    // In a real app, we would update the spaced repetition algorithm here
    // based on the difficulty rating and update the nextReviewDate

    // Move to next card after a short delay
    setTimeout(() => {
      if (currentIndex < mockFlashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1000);
  };

  const handleResetSession = () => {
    setCurrentIndex(0);
    setCompletedCards([]);
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Flashcards</h1>

        <Tabs defaultValue="review" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="my-cards">My Cards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="review" className="pt-6">
            {!isSessionComplete ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Card {currentIndex + 1} of {mockFlashcards.length}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{completedCards.length}</span> completed
                  </div>
                </div>

                <FlashcardComponent 
                  question={currentCard.question}
                  answer={currentCard.answer}
                  onResult={handleFlashcardResult}
                />
              </>
            ) : (
              <Card className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LuCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      You've reviewed all {mockFlashcards.length} cards in this session.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleResetSession}>
                      Start Another Session
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">
                        Return to Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="my-cards" className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Flashcards</h2>
              <AddFlashcardForm onAddCard={(card) => {
                // In a real app, we would save this to the database
                // For now, we'll just console.log it
                console.log('New card:', card);
              }} />
            </div>
            
            <div className="grid gap-4">
              {mockFlashcards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        {card.question.length > 60 ? card.question.substring(0, 60) + '...' : card.question}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                        {card.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-8">
                      <LuArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}