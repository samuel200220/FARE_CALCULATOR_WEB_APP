"use client"

import React from 'react'
import { useEffect, useRef } from 'react';

export default function GlobalAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(console.warn);
      }
      window.removeEventListener('click', playAudio);
    };

    window.addEventListener('click', playAudio);
    return () => window.removeEventListener('click', playAudio);
  }, []);

  return <audio ref={audioRef} src="/alone.mp3" loop />;
}
