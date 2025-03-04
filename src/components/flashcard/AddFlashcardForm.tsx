'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LuPlus } from 'react-icons/lu';

interface AddFlashcardFormProps {
  onAddCard: (card: { question: string; answer: string; category: string }) => void;
}

export function AddFlashcardForm({ onAddCard }: AddFlashcardFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim() || !category.trim()) {
      return;
    }
    
    onAddCard({
      question,
      answer,
      category,
    });
    
    // Reset form
    setQuestion('');
    setAnswer('');
    setCategory('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <LuPlus className="mr-2 h-4 w-4" /> Add New Flashcard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
          <DialogDescription>
            Add a new flashcard to your collection. Fill in the category, question, and answer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="category"
              placeholder="e.g., JavaScript, React, CSS"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">
              Question
            </label>
            <Textarea
              id="question"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="answer" className="text-sm font-medium">
              Answer
            </label>
            <Textarea
              id="answer"
              placeholder="Enter the answer here"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          <CardFooter className="flex justify-end space-x-2 px-0">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Flashcard</Button>
          </CardFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}