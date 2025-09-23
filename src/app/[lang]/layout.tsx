import type { Metadata } from 'next';
import { getDictionary } from '@/app/dictionaries';

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
      <body>{children}</body>
    </html>
  );
}
