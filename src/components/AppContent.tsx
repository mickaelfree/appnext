'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Import NoSSR with dynamic import to disable SSR
const NoSSRWrapper = dynamic(() => import('@/components/NoSSR'), {
  ssr: false
});

interface AppContentProps {
  children: ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  return <NoSSRWrapper>{children}</NoSSRWrapper>;
}