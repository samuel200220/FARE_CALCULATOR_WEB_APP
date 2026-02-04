'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Crown, Sparkles, Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ 
  message = "Chargement de la page...", 
  fullScreen = true 
}: LoadingProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const dotText = '.'.repeat(dots);

  return (
    <div className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} z-[9999] flex items-center justify-center`}>
      {/* Overlay avec effet de verre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`absolute inset-0 ${fullScreen ? 'bg-gradient-to-br from-blue-50/80 via-white/80 to-violet-50/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-md' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'}`}
      />

      {/* Contenu du loading */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.5, rotate: -180 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-8"
        >
          <div className="relative w-24 h-24">
            {/* Cercle externe animé */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute inset-0 border-4 border-transparent rounded-full"
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                backgroundSize: '400% 400%',
                animation: 'gradient 8s ease infinite',
              }}
            />
            
            {/* Cercle intermédiaire */}
            <motion.div
              animate={{
                rotate: -360,
                scale: [0.9, 1, 0.9],
              }}
              transition={{
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute inset-4 border-3 border-transparent rounded-full"
              style={{
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)',
                backgroundSize: '400% 400%',
              }}
            />
            
            {/* Centre avec icône */}
            <div className="absolute inset-8 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Crown className="w-10 h-10 text-yellow-500" />
              </motion.div>
            </div>

            {/* Particules flottantes */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 90) * 60,
                  y: Math.sin(i * 90) * 60,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Texte de chargement */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              Farcal
            </h3>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              </motion.div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {message}
                <span className="inline-block w-8 text-left">{dotText}</span>
              </p>
            </div>
          </motion.div>

          {/* Barre de progression animée */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "30%", "70%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-full mx-auto max-w-xs overflow-hidden"
          >
            <motion.div
              animate={{
                x: ["0%", "100%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="h-full w-1/3 bg-gradient-to-r from-white/30 to-transparent"
            />
          </motion.div>

          {/* Indicateurs */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {['Sécurité', 'Rapidité', 'Précision'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Message de patience */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-xs text-gray-500 dark:text-gray-400 mt-4"
          >
            Merci de patienter pendant le chargement
          </motion.p>
        </div>

        {/* Effets visuels supplémentaires */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-300/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}