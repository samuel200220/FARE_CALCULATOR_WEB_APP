"use client";

import React, { useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegCalendarAlt, FaRegClock, FaCalculator } from 'react-icons/fa';
import Map from '../Map'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Mapleaf from '../Mapleaf';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LinearBufferButton from '../LinearBufferButton';
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const Section1 = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const progressRef = useRef<() => void>(() => {});
  
  useEffect(() => {
      progressRef.current = () => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsLoading(false);
            setBuffer(10);
            return 0;
          }
  
          if (prevProgress % 5 === 0) {
            setBuffer((prevBuffer) => {
              const newBuffer = prevBuffer + 1 + Math.random() * 10;
              return newBuffer > 100 ? 100 : newBuffer;
            });
          }
  
          return prevProgress + 1;
        });
      };
    }, []);
  useEffect(() => {
      if (!isLoading) return;
  
      const timer = setInterval(() => {
        progressRef.current();
      }, 100);
  
      return () => {
        clearInterval(timer);
      };
    }, [isLoading]);
  
  const [compteur, setCompteur] = useState(0);
  const [bloque, setBloque] = useState(false);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [estConnecte, setEstConnecte] = useState(false);

useEffect(() => {
  const connecte = localStorage.getItem("estConnecte") === "true";
  setEstConnecte(connecte);
}, []);

  // useEffect(() => {
  //   const compteurStocke = parseInt(localStorage.getItem("compteurUtilisation") || "0", 10);
  //   setCompteur(compteurStocke);
  //   if (compteurStocke >= 3) {
  //     setBloque(true);
  //     setAfficherMessage(true);
  //   }
  // }, []);
  useEffect(() => {
    if (estConnecte) {
      setBloque(false); // Si connecté, pas de blocage
      return; // Ignore le reste
    }
  
    const compteurStocke = parseInt(localStorage.getItem("compteurUtilisation") || "0", 10);
    setCompteur(compteurStocke);
  
    if (compteurStocke >= 3) {
      setBloque(true);
      setAfficherMessage(true);
    } else {
      setBloque(false);
    }
  }, [estConnecte]);
  

  // useEffect(() => {
  //   if (afficherMessage) {
  //     toast.error("Vous avez atteint la limite de 3 utilisations. Veuillez vous enregistrer pour continuer.", {
  //       duration: 5000,
  //       position: 'top-center',
  //       style: {
  //         backgroundColor: '#f87171',
  //         color: '#fff',
  //         fontSize: '16px',
  //         padding: '16px',
  //         borderRadius: '8px',
  //       },
  //     });
  //   }
  // }, [afficherMessage]);

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

  // const handleCost = async () => {
  //   const nouveauCompteur = compteur + 1;
  //   setCompteur(nouveauCompteur);
  //   localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());

  //   if (nouveauCompteur >= 3) {
  //     setBloque(true);
  //     setAfficherMessage(true);
  //   }

  //   console.log("Action du bouton effectuée !");
  //   setError('');
  //   try {
  //     const res = await fetch('https://rideandgo.onrender.com/cost', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ start, end, hour }),
  //     });

  //     if (!res.ok) {
  //       const data = await res.json();
  //       throw new Error(data.detail || 'Erreur de calcul');
  //     }

  //     const data = await res.json();
  //     setResult(data);
  //   } catch (err) {
  //     setError((err as Error).message);
  //   }
  // };
  const handleCost = async () => {
    setIsLoading(true);
      setProgress(0);
      setBuffer(10);
    
    // if (!estConnecte) {
    //   let nouveauCompteur = compteur + 1;
  
    //   if (nouveauCompteur >= 3) {
    //     setBloque(true);
    //     setAfficherMessage(true);
    //     localStorage.removeItem("compteurUtilisation");
    //     nouveauCompteur = 0;
    //   } else {
    //     localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());
    //   }
  
    //   setCompteur(nouveauCompteur);
    // }
    // if (compteur >= 3) {
    //   toast.error("Vous avez atteint la limite de 3 utilisations. Veuillez vous enregistrer pour continuer.", {
    //     duration: 5000,
    //     position: 'top-center',
    //     style: {
    //       backgroundColor: '#f87171',
    //       color: '#fff',
    //       fontSize: '16px',
    //       padding: '16px',
    //       borderRadius: '8px',
    //     },
    //   });
    //   return;
    // }
  
    // const nouveauCompteur = compteur + 1;
    // setCompteur(nouveauCompteur);
    // localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());
  
    // if (nouveauCompteur >= 3) {
    //   setBloque(true);
    //   toast.error("Vous avez atteint la limite de 3 utilisations. Veuillez vous enregistrer pour continuer.", {
    //     duration: 5000,
    //     position: 'top-center',
    //     style: {
    //       backgroundColor: '#f87171',
    //       color: '#fff',
    //       fontSize: '16px',
    //       padding: '16px',
    //       borderRadius: '8px',
    //     },
    //   });
    // }
  
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
  
  return (
    <section className='w-full h-[70vh] p-4 justify-center items-center flex mb-4 mt-0'>
      <div className='w-4xl h-full relative mt-6 ml-6 rounded-3xl justify-start items-center flex flex-col gap-4 shadow-lg bg-white dark:bg-blue-900'>
                    <Input
                        value={start} onChange={(e) => setStart(e.target.value)} 
                        className="bg-white text-[18px] relative w-120 h-12 px-4 py-2 mt-6 rounded-[7px] border border-gray-300 hover:border-blue-800 "
                        placeholder='Départ'
                    />
                    <Input 
                        value={end} onChange={(e) => setEnd(e.target.value)}
                        className='bg-white w-120 h-12 px-4 py-2 rounded-[7px] border border-gray-300 hover:border-blue-800'
                        placeholder='Dépot'
                    />
                    <Input 
                        value={hour} onChange={(e) => setHour(e.target.value)}
                        className='bg-white w-120 h-12 px-4 py-2 rounded-[7px] border border-gray-300 hover:border-blue-800'
                        placeholder='Heure de prise en charge (HH:MM)'
                    />
                    {/* <div className='justify-center items-center flex gap-6'>
                        <Button className='text-black bg-white w-54 h-10 cursor-pointer hover:bg-green-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-10 cursor-pointer hover:bg-green-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegClock /></span>Maintenant</Button>
                    </div> */}
                    {/* <div className='justify-center items-center flex gap-6'>
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
                    </div> */}
                    <Button
                    onClick={handleCost} disabled={isLoading}
                    className='text-white bg-blue-500 w-54 h-10 cursor-pointer hover:bg-blue-800 dark:hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl mb-3' ><span><FaCalculator /></span>{isLoading ? "Chargement..." : "Calculer tarif"}</Button>
                    {/* <LinearBufferButton /> */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                {/* <h5>Vous avez utilise {utilisations} fois. Veullez vous connectez</h5> */}
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
      <div className="mr-5 rounded-2xl p-4 relative w-full h-full mt-0">
            <Mapleaf />
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
