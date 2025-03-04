'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LuPause, LuPlay, LuRefreshCw, LuClock } from 'react-icons/lu';

interface CodeTimerProps {
  onTimeUpdate: (elapsedSeconds: number) => void;
  autoStart?: boolean;
  averageTime?: number; // in seconds
  previousAttempts?: number;
}

export function CodeTimer({ 
  onTimeUpdate, 
  autoStart = true,
  averageTime,
  previousAttempts = 0
}: CodeTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [startTime, setStartTime] = useState<number | null>(autoStart ? Date.now() : null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        if (startTime) {
          const newElapsedTime = Math.floor((now - startTime) / 1000);
          setElapsedTime(newElapsedTime);
          onTimeUpdate(newElapsedTime);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, onTimeUpdate]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      if (!startTime) {
        setStartTime(Date.now());
      } else {
        setStartTime(Date.now() - elapsedTime * 1000);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    onTimeUpdate(0);
  };

  // Calculate comparison with average time
  const getComparisonText = () => {
    if (!averageTime || elapsedTime === 0) return null;
    
    const diff = averageTime - elapsedTime;
    if (diff > 0) {
      return `You're ${formatTime(diff)} faster than average`;
    } else if (diff < 0) {
      return `You're ${formatTime(Math.abs(diff))} slower than average`;
    } else {
      return "You're right on average time";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LuClock className="h-5 w-5 mr-2 text-primary" />
            <div className="text-xl font-mono">{formatTime(elapsedTime)}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleStartPause}>
              {isRunning ? <LuPause className="h-4 w-4" /> : <LuPlay className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <LuRefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {previousAttempts > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {previousAttempts} previous {previousAttempts === 1 ? 'attempt' : 'attempts'} 
            {averageTime && ` • Avg: ${formatTime(averageTime)}`}
          </div>
        )}
        
        {getComparisonText() && (
          <div className={`mt-1 text-sm ${elapsedTime < averageTime ? 'text-green-500' : 'text-yellow-500'}`}>
            {getComparisonText()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}