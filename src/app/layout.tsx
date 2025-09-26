import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  // Metadata is now dynamically generated in [lang]/layout.tsx
  title: 'VaultWise',
  description: 'A modern multi-asset saving platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
       {/* The <body> tag is now managed in the [lang]/layout.tsx file to prevent hydration errors. */}
      <Providers>{children}</Providers>
    </html>
  );
}
