import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  // Metadata artık [lang]/layout.tsx içinde dinamik olarak oluşturulacak
  title: 'VaultWise',
  description: 'A modern multi-asset saving platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning, dil ve tema değiştiricilerinden kaynaklanan
    // kaçınılmaz uyuşmazlıklar için gereklidir.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
          {children}
      </body>
    </html>
  );
}
