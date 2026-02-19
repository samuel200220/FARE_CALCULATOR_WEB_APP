'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

// Créer un composant séparé pour la logique qui utilise useSearchParams
function RouteLoadingContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Vérifier si on clique sur un lien Next.js interne
      const link = target.closest('a');

      if (link &&
        link.getAttribute('href') &&
        !link.getAttribute('href')?.startsWith('#') &&
        link.getAttribute('target') !== '_blank' &&
        !link.getAttribute('download') &&
        !link.classList.contains('no-loading') &&
        link.getAttribute('href')?.startsWith('/')
      ) {
        setIsLoading(true);
        setProgress(0);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Animation de progression
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Reset quand la route change
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  // Calcul pour la barre circulaire (SVG)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay avec effet de verre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/10 to-amber-50/30 dark:from-slate-950/50 dark:via-slate-900/50 dark:to-slate-950/50 backdrop-blur-sm"
      />

      {/* Contenu au centre */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Standard Spinner */}
        <div className="relative mb-12 flex items-center justify-center">
          <div className="p-4 rounded-full bg-white/10 backdrop-blur-md shadow-lg ring-1 ring-white/20">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>

        {/* Texte avec animation */}
        <div className="text-center space-y-6">


          {/* Points animés (Style minimaliste) */}
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
              />
            ))}
          </div>

        </div>

        {/* Cercles de fond décoratifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <div className="w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[100px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Composant principal avec Suspense
export default function RouteLoading() {
  return (
    <Suspense fallback={null}>
      <RouteLoadingContent />
    </Suspense>
  );
}