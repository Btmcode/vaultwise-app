
'use client';

import { useEffect } from 'react';

export default function HeroScene() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);

      const background = document.getElementById('interactive-background');
      if (background) {
        background.style.setProperty('--x', `${x}%`);
        background.style.setProperty('--y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      id="interactive-background"
      className="fixed inset-0 z-0 transition-all"
      style={{
        background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), hsla(var(--primary), 0.25), transparent 35vw)',
      }}
    />
  );
}
