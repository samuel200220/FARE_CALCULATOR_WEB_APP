'use client';

import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import ContactIcon from '../ContactIcon';

type Comments={
    id:number;
    name:string;
    message:string;
};
const comment: Comments[]=[
    {id:1, name:"Megane", message:"Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!"},
    {id:2, name:"Stella", message:"Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!,"},
    {id:3, name:"Lionel", message:"Vraiment pratique! En quelques secondes, j'ai pu estimer le prix de mon trajet sans avoir a appeler qui que ce soit. Interface claire, rapide et super utile pour prevoir mon budget avant de bouger. Je recommande a fond!,"}
];
const Section3 = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: string) => {
        const container = scrollRef.current;
        const amount = 300;
        if (!container) return;
    
        if (direction === 'left') {
          container.scrollBy({ left: -amount, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: amount, behavior: 'smooth' });
        }
      };
    
  return (
    <section className='mt-40 mb-0 bg-300 dark:bg-[#0D1B2A] pt-20 pb-20 justify-center items-center flex flex-col'>
        {/* <Input 
            className='bg-white w-100 h-10 px-4 py-2 rounded border border-gray-300 shadow text-center'
            placeholder='Entrer un commentaire'
            type='text'
        /> */}
        {/* <h2 className='text-4xl text-center mb-12 underline decoration-black decoration-2 text-black dark:text-white'>COMMENTAIRES</h2> */}
        <div className="grid w-80 gap-2">
          <h2 className='text-blue-800 font-bold ml-3 dark:text-white'>Aidez nous a nous ameliorer</h2>
            <Textarea className='text-center border border-blue-600 dark:text-white dark:bg-gray-800' placeholder="Votre commentaire" />
            <Button className='w-1/2 ml-20 cursor-pointer bg-blue-500 border border-blue-600 mb-10 dark:bg-800 text-white hover:bg-blue-500 dark:hover:bg-[#0D1B2A] shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'>Envoyer</Button>
        </div>
        <div className="relative w-full items-center justify-center">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 p-4 h-auto w-full justify-center items-center"
      >
        {/* {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="w-72 h-70 bg-white border border-blue-500 rounded text-black flex items-center justify-center font-bold text-xl"
          >
            Bloc {n}
          </div>
        ))} */}
        <div className='flex justify-center items-center gap-12'>
            {
                [...comment].map((comme,index)=>(
                    <div key={index} className='bg-white dark:bg-gray-800 flex-none w-72 h-70 relative overflow-hidden rounded-4xl border justify-center shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:-translate-y-3 hover:shadow-2xl'>
                        <h4 className='text-center mt-2 mb-10 text-blue-500 text-xl font-bold dark:text-white'><span><ContactIcon name={comme.name} /></span>{comme.name}</h4>
                        <p className='text-sm p-4 text-black dark:text-white'>{comme.message}</p>
                    </div>
                ))
            }
        </div>
      </div>

      {/* Left Button */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-500 shadow p-2 rounded-full"
      >
        <ChevronLeft/>
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-500 shadow p-2 rounded-full "
      >
        <ChevronRight />
      </button>
    </div>
    </section>
  )
}

export default Section3