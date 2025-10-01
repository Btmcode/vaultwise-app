
'use client';

// Bu sayfa artık sadece dil tespiti ve yönlendirme için bir giriş noktasıdır.
// Middleware bu işin çoğunu halleder, ancak JS'nin etkin olmadığı durumlar
// veya doğrudan erişimler için bir yedek olarak görev yapabilir.
// Asıl içerik [lang]/page.tsx dosyasındadır.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Tarayıcının dilini alıp yönlendirme yap.
    // Middleware bunu zaten yapıyor olmalı, bu bir güvenlik ağı.
    const userLang = navigator.language.split('-')[0];
    const lang = userLang === 'en' ? 'en' : 'tr';
    router.replace(`/${lang}`);
  }, [router]);

  return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
