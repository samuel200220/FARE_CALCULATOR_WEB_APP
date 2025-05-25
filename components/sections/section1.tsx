"use client";

import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegCalendarAlt, FaRegClock, FaCalculator } from 'react-icons/fa';
import Map from '../Map'
import { useState } from 'react';
import { useTheme } from 'next-themes';

const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const Section1 = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [hour, setHour] = useState('');
  interface Result {
    start: string;
    end: string;
    distance: number;
    cost: number;
    mint_cost: number;
  }

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const handleCost = async () => {
    setError('');
    try {
      const res = await fetch('https://rideandgo.onrender.com/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, hour }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Erreur de calcul');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };
//   const [backgroundImage, setBackgroundImage] = useState('/theme.png');

//     useEffect(() => {
//         const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//         setBackgroundImage(isDark ? '/theme_sombre.png' : '/theme.png');
//     }, []);
  return (
    <section className='w-full h-[70vh] p-0 justify-center items-center flex flex-col mb-4 mt-0'>
         {/* <div className='w-full h-full relative'>
            <img src="/theme_sombre.png" alt="Logo sombre"
                className="hidden dark:block w-full h-96 mt-50 " />
        </div> */}

        <div className="block relative w-full h-full mt-0">
            {/* Image de fond */}
            <div
                className="absolute inset-0 bg-cover bg-center w-full h-screen"
                style={{
                    backgroundImage: `url(${isDark ? '/theme_sombre.png' : '/theme.png'})`,
                  }}
            />
            <div className="absolute inset-0 bg-black/50 h-screen dark:hidden" />

            {/* Voile noir fondu au-dessus de l'image */}
            {/* <div className="absolute inset-0 bg-black/50 h-screen" /> */}

            {/* Contenu au-dessus de l'image + fondu */}
            {/* <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl font-bold">Mon composant</h1>
                <p>Le contenu ici s'affiche au-dessus de l'image + fondu.</p>
            </div> */}
            <div className='flex justify-center items-center z-10 h-screen'>
            <div className='w-full p-4 rounded relative h-screen mt-52'>
                <div className='w-auto h-96 rounded-3xl justify-center items-center flex flex-col gap-4'>
                    <h4 className='text-center text-white'>CALCULEZ LES TARIFS POUR N'IMPORTE QUELLE DESTINATION AVEC FARE CALCULATOR</h4>
                    <Input
                        value={start} onChange={(e) => setStart(e.target.value)} 
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Lieu de depart'
                    />
                    <Input 
                        value={end} onChange={(e) => setEnd(e.target.value)}
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Lieu de depot'
                    />
                    <Input 
                        value={hour} onChange={(e) => setHour(e.target.value)}
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Heure de prise en charge (HH:MM)'
                    />
                    <div className='justify-center items-center flex gap-6'>
                        <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegClock /></span>Maintenant</Button>
                    </div>
                    <div className='justify-center items-center flex gap-6'>
                        <RadioGroup defaultValue="Ramassage" className='justify-center items-center flex gap-20'>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="default" id="r1" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                                <Label htmlFor="r1" className='text-white dark:text-white font-bold'>Ramassage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Depot" id="r2" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                                <Label htmlFor="r2" className='text-white dark:text-white dark:font-bold'>Depot</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button
                    onClick={handleCost} 
                    className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaCalculator /></span>Calculer tarif</Button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {result && (
                    <div className="mt-4 p-4 border rounded bg-gray-100">
                    <p><strong>Départ :</strong> {result.start}</p>
                    <p><strong>Arrivée :</strong> {result.end}</p>
                    <p><strong>Distance :</strong> {result.distance.toFixed(2)} km</p>
                    <p><strong>Tarif estimé :</strong> {result.cost.toFixed(0)} FCFA</p>
                    {/* <p><strong>Minimum :</strong> {result.mint_cost} FCFA</p> */}
                    </div>
                )}
            </div>
            <div className="relative w-full h-[400px] mr-5 mt-0 rounded-2xl">
                 {/* <img
                    src="/planifier.jpg"
                    alt="Fond"
                    className="w-full h-full object-cover"
                /> */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
                 <Map 
                    center={yaoundeLocation}
                    zoom={12}
                />
            </div>

            </div>

            
        </div>

        {/* <div className="relative w-full h-full mt-0 dark:hidden">
            <div
                className="absolute inset-0 bg-cover bg-center w-full h-screen"
                style={{ backgroundImage: "url('/theme.png')" }}
            />

            <div className="absolute inset-0 bg-black/50 h-screen" />

            <div className='flex justify-center items-center z-10 h-screen'>
            <div className='w-full p-4 rounded relative h-screen mt-52'>
                <div className='w-auto h-96 rounded-3xl justify-center items-center flex flex-col gap-4 dark:bg-orange-700'>
                    <h4 className='text-center text-white'>CALCULEZ LES TARIFS POUR N'IMPORTE QUELLE DESTINATION AVEC FARE CALCULATOR</h4>
                    <Input 
                        value={start} onChange={(e) => setStart(e.target.value)}
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Lieu de depart'
                    />
                    <Input 
                        value={end} onChange={(e) => setEnd(e.target.value)}
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Lieu de depot'
                    />
                    <Input 
                        value={hour} onChange={(e) => setHour(e.target.value)}
                        className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                        placeholder='Heure de prise en charge (HH:MM)'
                    />
                    <div className='justify-center items-center flex gap-6'>
                        <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegClock /></span>Maintenant</Button>
                    </div>
                    <div className='justify-center items-center flex gap-6'>
                        <RadioGroup defaultValue="Ramassage" className='justify-center items-center flex gap-20'>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="default" id="r1" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                                <Label htmlFor="r1" className='text-white'>Ramassage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Depot" id="r2" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                                <Label htmlFor="r2" className='text-white'>Depot</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button
                    onClick={handleCost}
                    className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaCalculator /></span>Cout calcule</Button>
                </div>
            </div>
            <div className="relative w-full h-[400px] mr-5 rounded-2xl">
                 <Map 
                    center={yaoundeLocation}
                    zoom={12}
                />
            </div>

            </div>

            
        </div> */}

                
    </section>
  )
}

export default Section1
