import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";

export async function generateMetadata({
  params,
}: {
  params: { lang: 'tr' | 'en' };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: 'tr' | 'en' };
}>) {
  return (
    <html lang={params.lang} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
