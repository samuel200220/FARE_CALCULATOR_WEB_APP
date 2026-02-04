'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

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
        className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/80 to-violet-50/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-md"
      />
      
      {/* Contenu au centre */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Cercle de progression principal */}
        <div className="relative mb-8">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Cercle de fond */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            
            {/* Cercle de progression avec dégradé */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Icône au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-12 h-12 text-yellow-500" />
            </motion.div>
          </div>

          {/* Définition du dégradé */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Texte avec animation */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chargement en cours
          </h3>
          
          {/* Pourcentage */}
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            {progress}%
          </div>

          {/* Points animés */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Message subtil */}
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            La patience est une vertu de l'esprit...
          </p>
        </div>

        {/* Cercle externe animé */}
        <div className="absolute">
          <div className="w-48 h-48 border-4 border-blue-200/30 dark:border-blue-500/20 rounded-full animate-ping" />
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