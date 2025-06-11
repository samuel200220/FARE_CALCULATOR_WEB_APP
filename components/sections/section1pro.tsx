"use client";

import React, { useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegCalendarAlt, FaRegClock, FaCalculator } from 'react-icons/fa';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import Mapleaf from '../Mapleaf';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LinearBufferButton from '../LinearBufferButton';
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { FaMoneyBillAlt } from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import { BsClock } from 'react-icons/bs';
import 'react-time-picker/dist/TimePicker.css';
import TimePicker from 'react-time-picker';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaFlagCheckered,FaLocationArrow,FaChevronDown } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { LoadScript, Autocomplete } from "@react-google-maps/api";


import { Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];
const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const predefinedHours = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00"
];

const suggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
const destinationSuggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
const Section1pro = ({}) => {

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState("");
  const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };
  const handlePlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    console.log("Adresse sélectionnée :", place?.formatted_address);
  };
  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      handlePlaceSelected(place);
    }
  };
  const [show, setShow] = useState(false);
  // Removed duplicate declaration of result
  const [showSuggestionsStart, setShowSuggestionsStart] = useState(false);
  const [showSuggestionsEnd, setShowSuggestionsEnd] = useState(false);
  const handleSelectd = (value: string) => {
    setEnd(value);
    //setShowSuggestions(false);
    setShowSuggestionsEnd(false);
  };
  const [filteredSuggestionsd, setFilteredSuggestionsd] = useState<string[]>([]);
  // Removed duplicate declaration of end
  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEnd(value);
    setShowSuggestionsEnd(true);
    setShowSuggestionsStart(false);

    if (value.length > 0) {
      const filtered = destinationSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestionsd(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  // Removed duplicate declaration of start
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStart(value);
    setShowSuggestionsEnd(false);
    setShowSuggestionsStart(true);

    if (value.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  const handleSelect = (value: string) => {
    setStart(value);
    //setShowSuggestions(false);
    setShowSuggestionsStart(false);
  };
  // Removed duplicate declaration of hour
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectHour = (value: string) => {
    setHour(value);
    setShowDropdown(false);
  };
  const [customOffer, setCustomOffer] = useState('');
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

  const handleCost = async () => {
    setIsLoading(true);
      setProgress(0);
      setBuffer(10);
    
  
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
      setShow(true);
    } catch (err) {
      setError((err as Error).message);
    }finally{
      setIsLoading(false);
    }
  };
  
  return (
    <section className='w-full h-[850px] p-4 justify-center items-center flex mb-4 mt-0'>
      <div className='lg:w-4xl sm:w-4xl md:w-4xl w-[320px] h-full relative mt-6 lg:ml-6 sm:ml-6 md:ml-6 ml-1 rounded-3xl justify-start pt-10 items-center flex flex-col gap-4 shadow-lg bg-white dark:bg-[#0D1B2A] overflow-hidden transition-all duration-700 ease-in-out '>
      <h3 className='dark:text-white text-2xl sm:text-4xl md:text-2xl lg:text-4xl font-bold text-black'>Calculateur de Tarif</h3>
              <div className="relative mt-6 lg:w-120 sm:w-120 md:w-120 w-[260px]">
                {/* Icône positionnée à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-blue-600 text-lg" />
                </div>
                <Input
                  value={start}
                  onChange={handleChange}    
                  className="bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border border-gray-300 hover:border-blue-800"
                  placeholder="Départ"
                />

                {/* Suggestions */}
                {showSuggestionsStart && (
                  <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((s, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect(s)}
                          className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                        >
                          {s}
                        </li>
                      ))
                    ) 
                    : 
                    (
                      <li className="dark:text-white px-4 py-2 text-gray-500">Aucune suggestion</li>
                    )
                    }
                  </ul>
                )}
              </div>
              <div className="relative mt-4 lg:w-120 sm:w-120 md:w-120 w-[260px]">
                {/* Icône positionnée à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLocationArrow className="text-blue-600 text-lg" />
                </div>

                <Input
                  value={end}
                  onChange={handleChanged}
                  className="bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border border-gray-300 hover:border-blue-800"
                  placeholder="Destination"
                />

                {/* Suggestions */}
                {showSuggestionsEnd && (
                  <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestionsd.length > 0 ? (
                      filteredSuggestionsd.map((s, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectd(s)}
                          className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                        >
                          {s}
                        </li>
                      ))
                    ) : (
                      <li className="dark:text-white px-4 py-2 text-gray-500">Aucune suggestion</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="relative lg:w-120 sm:w-120 md:w-120 w-[260px] mt-4">
      {/* Icône à gauche */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaRegClock className="text-blue-600 text-lg" />
      </div>

      {/* Icône à droite */}
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaChevronDown className="text-gray-500" />
      </div>

      {/* Input */}
      <Input
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        onClick={() => setShowDropdown(false)} // ferme si on clique dans input
        className="bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-10 py-2 rounded-[7px] border border-gray-300 hover:border-blue-800"
        placeholder="Heure de prise en charge (HH:MM)"
      />

      {/* Menu déroulant */}
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto">
          {predefinedHours.map((h) => (
            <li
              key={h}
              onClick={() => handleSelectHour(h)}
              className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
                    {/* <input
  type="time"
  value={hour}
  onChange={(e) => setHour(e.target.value)}
  className="bg-white w-60 h-12 dark:bg-gray-800 px-4 py-2 dark:text-white rounded-[7px] border border-gray-300 hover:border-blue-800 cursor-pointer"
/> */}

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
                    className='text-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800 bg-blue-700 w-54 h-10 hover:bg-blue-800 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl mb-3' ><span><FaCalculator /></span>{isLoading ? "Calcul en cours..." : "Calculer tarif"}</Button>
                    {/* <LinearBufferButton /> */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                {/* <h5>Vous avez utilise {utilisations} fois. Veullez vous connectez</h5> */}
                {result && (
                    <div className={`lg:w-120 sm:w-120 md:w-120 w-[260px] h-96 relative p-4 dark:bg-gray-800 rounded-md border border-gray-200 bg-white shadow-sm space-y-4 lg:text-sm md:text-sm sm:text-sm overflow-hidden transition-all duration-700 ease-in-out 
        ${show ? 'max-h-96 opacity-100 mt-0' : 'max-h-0 opacity-0'}`}>
                      {/* Title */}
                      <div className="flex items-center gap-2 font-semibold text-lg text-blue-900">
                        <FaMoneyBillAlt />
                        <span className='dark:text-white'>Notre estimation</span>
                      </div>

                      {/* Distance & Duration */}
                      <div className="flex justify-between gap-2">
                        <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-3">
                          <div className="flex items-center gap-1 font-medium text-blue-700">
                            <MdOutlineDirectionsWalk />
                            <span className='text-blue-700 dark:text-white'>Distance</span>
                          </div>
                          <div className="text-xl font-bold text-black dark:text-white">{result.distance.toFixed(2)} km</div>
                        </div>
                        {/* <div className="flex-1 bg-blue-50 rounded p-3">
                          <div className="flex items-center gap-1 font-medium text-blue-700">
                            <BsClock />
                            <span>Duree</span>
                          </div>
                          <div className="text-xl font-bold">1h 9min 49s</div>
                        </div> */}
                      </div>

                      {/* Our Estimate */}
                      <div className="border hover:border-blue-500 rounded p-3 space-y-2">
                        <div className="flex justify-between font-medium">
                          <span className='text-blue-700 dark:text-white'>Cout Estime</span>
                          <span className="font-bold text-blue-700 dark:text-white">{result.cost.toFixed(0)} FCFA</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                          Commander
                        </button>
                      </div>

                      {/* Official Rate */}
                      <div className="border hover:border-blue-500 w-full relative mt-6 rounded p-3 space-y-2">
                        <div className="flex justify-between font-medium">
                          <span className='text-blue-700 dark:text-white'>Tarif officiel</span>
                          <span className="font-bold text-blue-700 dark:text-white">{result.mint_cost} FCFA</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                          Commander
                        </button>
                      </div>

                      {/* Custom Offer */}
                      {/* <div className="border border-blue-200 bg-blue-50 p-3 rounded space-y-2">
                        <label className="font-medium text-blue-800 flex items-center gap-1">
                          <span>🧭</span> Proposer votre prix
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Your offer"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={customOffer}
                            onChange={(e) => setCustomOffer(e.target.value)}
                          />
                          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                            Commader
                          </button>
                        </div>
                      </div> */}
                    </div>
                )}
      </div>
      <div className="hidden lg:block mr-5 rounded-2xl p-4 relative w-full h-full z-10 mt-0">
            <Mapleaf />
      </div>                
    </section>
  )
}

export default Section1pro
