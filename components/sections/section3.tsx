'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Send, MessageSquareQuote } from 'lucide-react';
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ContactIcon from '../ContactIcon';
import { motion } from 'framer-motion';

type Comments = {
  id: number;
  name: string;
  message: string;
};

const comment: Comments[] = [
  { id: 1, name: "Megane", message: "Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!" },
  { id: 2, name: "Stella", message: "Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!" },
  { id: 3, name: "Lionel", message: "Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!" }
];

const Section3 = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: string) => {
    const container = scrollRef.current;
    const amount = 400;
    if (!container) return;

    if (direction === 'left') {
      container.scrollBy({ left: -amount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Title & Input Section */}
      <div className="max-w-xl mx-auto mb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <MessageSquareQuote className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Aidez-nous à nous améliorer
          </h2>

          <div className="w-full relative">
            <Textarea
              className="w-full min-h-[120px] p-6 text-lg rounded-[2rem] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="Partagez votre avis avec nous..."
            />
            <div className="mt-4 flex justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="px-10 h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3">
                  <span>Envoyer le message</span>
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-12">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 scrollbar-hide p-8 snap-x snap-mandatory"
        >
          {comment.map((comme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-none w-full md:w-[400px] snap-center"
            >
              <div className="h-full p-8 rounded-[3rem] bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-1 bg-gradient-to-br from-primary to-blue-500 rounded-2xl">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-1">
                      <ContactIcon name={comme.name} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {comme.name}
                    </h4>
                    <div className="flex gap-1 text-amber-400">
                      {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light italic">
                  "{comme.message}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => scroll('left')}
            className="w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all text-slate-600 dark:text-slate-400 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all text-slate-600 dark:text-slate-400 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section3;