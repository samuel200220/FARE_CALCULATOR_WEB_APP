'use client';

import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Section6 = () => {
  return (
    <section className="hidden lg:flex py-24 flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl text-center px-4"
      >
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Contactez-Nous
        </h2>

        <div className="space-y-4">
          <Input
            className="h-16 px-6 rounded-[1.5rem] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
            placeholder="Votre message..."
            type="text"
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-bold rounded-[1.5rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg">
              <span>Envoyer le message</span>
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Section6;