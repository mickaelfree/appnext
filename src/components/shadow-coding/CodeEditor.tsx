'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LuCheck, LuX, LuEye, LuEyeOff, LuRefreshCw } from 'react-icons/lu';

interface CodeEditorProps {
  title: string;
  description: string;
  language: string;
  initialCode: string;
  solutionCode: string;
  onComplete: (success: boolean) => void;
}

export function CodeEditor({ 
  title, 
  description, 
  language, 
  initialCode, 
  solutionCode,
  onComplete
}: CodeEditorProps) {
  const [userCode, setUserCode] = useState(initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setUserCode(value);
    }
  };

  const handleSubmit = () => {
    // In a real app, we would run tests or validate the code here
    // For now, we'll just do a simple string comparison (not ideal in practice)
    const normalizedUserCode = userCode.replace(/\s+/g, ' ').trim();
    const normalizedSolution = solutionCode.replace(/\s+/g, ' ').trim();
    
    const isSuccess = normalizedUserCode === normalizedSolution;
    setSuccess(isSuccess);
    setIsSubmitted(true);
    onComplete(isSuccess);
  };

  const handleReset = () => {
    setUserCode(initialCode);
    setIsSubmitted(false);
    setShowSolution(false);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-xl">{title}</CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="mb-2 sm:mb-4">
            <TabsTrigger value="code">Your Code</TabsTrigger>
            {showSolution && (
              <TabsTrigger value="solution">Solution</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="code" className="min-h-[200px] sm:min-h-80">
            <Editor
              height="250px"
              language={language.toLowerCase()}
              value={userCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                wordWrap: 'on',
                readOnly: isSubmitted
              }}
              theme="vs-dark"
            />
          </TabsContent>
          {showSolution && (
            <TabsContent value="solution" className="min-h-[200px] sm:min-h-80">
              <Editor
                height="250px"
                language={language.toLowerCase()}
                value={solutionCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  wordWrap: 'on',
                  readOnly: true
                }}
                theme="vs-dark"
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-3 sm:p-6 gap-3 sm:gap-0">
        <div>
          {isSubmitted && (
            <div className="flex items-center">
              {success ? (
                <div className="flex items-center text-green-500">
                  <LuCheck className="mr-1 sm:mr-2 h-4 w-4" /> <span className="text-sm sm:text-base">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <LuX className="mr-1 sm:mr-2 h-4 w-4" /> <span className="text-sm sm:text-base">Try again</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={toggleSolution}>
            {showSolution ? (
              <>
                <LuEyeOff className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> 
                <span className="hidden xs:inline">Hide</span> Solution
              </>
            ) : (
              <>
                <LuEye className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> 
                <span className="hidden xs:inline">Show</span> Solution
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={handleReset}>
            <LuRefreshCw className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" /> Reset
          </Button>
          <Button size="sm" className="text-xs sm:text-sm" onClick={handleSubmit} disabled={isSubmitted}>
            Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}