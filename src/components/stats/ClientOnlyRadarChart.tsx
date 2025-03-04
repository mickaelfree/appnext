'use client';

import { useState, useEffect } from 'react';
import { SkillRadarChart } from './SkillRadarChart';

interface ClientOnlyRadarChartProps {
  labels: string[];
  data: number[];
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  height?: number;
}

export function ClientOnlyRadarChart(props: ClientOnlyRadarChartProps) {
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
        <p className="text-muted-foreground">Loading skill chart...</p>
      </div>
    );
  }

  // Rend le graphique une fois monté côté client
  return <SkillRadarChart {...props} />;
}