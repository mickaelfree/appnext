'use client';

import { useState, useEffect } from 'react';
import { ProgressChart } from './ProgressChart';

interface ClientOnlyChartProps {
  type: 'line' | 'bar';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  title?: string;
  height?: number;
}

export function ClientOnlyChart(props: ClientOnlyChartProps) {
  // State pour détecter si on est côté client
  const [isMounted, setIsMounted] = useState(false);

  // Effect qui s'exécute uniquement côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ne rend le composant que côté client
  if (!isMounted) {
    return (
      <div 
        className="h-80 w-full bg-muted rounded-md flex items-center justify-center"
        style={{ height: props.height || 300 }}
      >
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  // Rend le graphique une fois monté côté client
  return <ProgressChart {...props} />;
}