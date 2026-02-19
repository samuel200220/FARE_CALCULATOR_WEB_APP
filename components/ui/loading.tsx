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
        className={`absolute inset-0 ${fullScreen ? 'bg-gradient-to-br from-blue-50/90 via-white/90 to-amber-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 backdrop-blur-xl' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'}`}
      />

      {/* Contenu du loading */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="relative w-28 h-28">
            {/* Cercles orbitaux animés */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border border-dotted border-amber-500/20 rounded-full"
            />

            {/* Centre avec icône Crown (Style Pro) */}
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/20 ring-4 ring-white dark:ring-slate-800 overflow-hidden group">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>

              {/* Reflet brillant passager */}
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </div>

            {/* Particules d'éclat (Sparkles) */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * (Math.PI / 180)) * 55,
                  y: Math.sin(i * 60 * (Math.PI / 180)) * 55,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Texte de chargement */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              FAR<span className="text-blue-600">CAL</span>
            </h3>

            <div className="flex flex-col items-center gap-3">
              <p className="text-slate-600 dark:text-slate-400 font-bold text-lg flex items-center gap-2">
                {message}
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Barre de progression premium */}
          <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
            />
          </div>

          {/* Badges de confiance */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: 'Sécurité SSL', color: 'text-blue-500' },
              { label: 'Calcul Précis', color: 'text-amber-500' },
              { label: 'IA Performante', color: 'text-slate-500' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text', 'bg')}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Effets de profondeur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}