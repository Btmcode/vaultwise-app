'use client';

import { LivePricesProvider } from '@/hooks/useLivePrices';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LivePricesProvider>
      {children}
    </LivePricesProvider>
  );
}
