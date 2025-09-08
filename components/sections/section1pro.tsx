"use client";

import React, { useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
// import { Label } from '../ui/label'
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegClock, FaCalculator, FaCar, FaBus, FaCarSide } from 'react-icons/fa';
import { useState } from 'react';
import { useTheme } from 'next-themes';
// import Mapleaf from '../Mapleaf';
// import TextField from '@mui/material/TextField';
// import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
// import LinearBufferButton from '../LinearBufferButton';
// import LinearProgress from "@mui/material/LinearProgress";
// import Box from "@mui/material/Box";
import { FaMoneyBillAlt } from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
//import { BsClock } from 'react-icons/bs';
import 'react-time-picker/dist/TimePicker.css';
//import TimePicker from 'react-time-picker';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaLocationArrow } from 'react-icons/fa';
// import { IconType } from 'react-icons';
// import { LoadScript, Autocomplete } from "@react-google-maps/api";


//import { Libraries } from "@react-google-maps/api";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

//const libraries: Libraries = ["places"];
//const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const predefinedHours = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00"
];
const MapNavigooWrapper = dynamic(() => import('../MapNavigooWrapper.client'), { ssr: false });

const suggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
const destinationSuggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
const Section1pro = ({}) => {

  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  //const [inputValue, setInputValue] = useState("");
  // const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
  //   setAutocomplete(autocompleteInstance);
  // };
  const handlePlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    console.log("Adresse sélectionnée :", place?.formatted_address);
  };
  // const handlePlaceChanged = () => {
  //   if (autocomplete) {
  //     const place = autocomplete.getPlace();
  //     handlePlaceSelected(place);
  //   }
  // };
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
    
      const filtered = destinationSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestionsd(filtered);
    
      setShowSuggestionsEnd(value.trim() !== "");
    
      if (
        destinationSuggestions.some(
          (s) => s.toLowerCase().trim() === value.toLowerCase().trim()
        )
      ) {
        setShowSuggestionsEnd(false);
      }
    };
  // Removed duplicate declaration of start
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  //const [showSuggestions, setShowSuggestions] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStart(value);
  
    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  
    // Affiche suggestions si champ non vide
    setShowSuggestionsStart(value.trim() !== "");
  
    // Masquer les suggestions si l'entrée correspond exactement à une suggestion
    if (
      suggestions.some(
        (s) => s.toLowerCase().trim() === value.toLowerCase().trim()
      )
    ) {
      setShowSuggestionsStart(false);
    }
  };
  const handleSelect = (value: string) => {
    setStart(value);
    //setShowSuggestions(false);
    setShowSuggestionsStart(false);
  };
  // Removed duplicate declaration of hour
  const [showDropdown, setShowDropdown] = useState(false);

  // const handleSelectHour = (value: string) => {
  //   setHour(value);
  //   setShowDropdown(false);
  // };
  //const [customOffer, setCustomOffer] = useState('');
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
    //const isDark = theme === 'dark';
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

  const [showCards, setShowCards] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const [showCustomDiv, setShowCustomDiv] = useState(false);

  const enregistrerCalcul = async () => {
    if (!estConnecte || !result) return;
  
    const idUtilisateur = localStorage.getItem("idUtilisateur");
    if (!idUtilisateur || !/^[0-9a-fA-F\-]{36}$/.test(idUtilisateur)) {
      toast.error("ID utilisateur invalide");
      return;
    }
  
    const body = {
    key: {
      id_utilisateur: idUtilisateur,
      timestamp: new Date().toISOString()
    },
    lieu_depart: start,
    lieu_arrivee: end,
    heure_prise_en_charge: hour.length === 5 ? hour + ":00" : hour,
    distance_km: result?.distance,
    cout_estime: result?.cost,
    tarif_officiel: result?.mint_cost
  };
  
    try {
      const res = await fetch("http://localhost:8080/api/calculs-utilisateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("Erreur HTTP", res.status, errText);
        toast.error("Erreur lors de l'enregistrement du calcul : " + res.status);
      } else {
        toast.success("Calcul enregistré avec succès !");
      }
    } catch (err) {
      console.error("Erreur réseau", err);
      console.error("Erreur de connexion au backend local");
    }
  };

  const handleCost = async () => {
    setIsLoading(true);
      setProgress(0);
      setBuffer(10);
    
  
    setError('');
    try {
      const res = await fetch('https://fare-calculator.onrender.com/cost', {
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
      await enregistrerCalcul();
    } catch (err) {
      setError((err as Error).message);
    }finally{
      setIsLoading(false);
    }
  };
  
  const [errors, setErrors] = useState<{ start?: string; end?: string; hour?: string }>({});
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: typeof errors = {};
  
      if (!start.trim()) newErrors.start = 'Le champ Départ est requis.';
      if (!end.trim()) newErrors.end = 'Le champ Destination est requis.';
      if (!hour) newErrors.hour = "L'heure doit être sélectionnée.";
  
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
        setIsLoading(true);
        handleCost();
      }
    };
  return (
    <section className='w-full h-[850px] p-4 justify-center items-center flex mb-4 mt-0'>
      <div className='lg:w-4xl sm:w-4xl md:w-4xl w-[320px] h-full relative mt-6 lg:ml-6 sm:ml-6 md:ml-6 ml-1 rounded-3xl justify-start pt-10 items-center flex flex-col gap-4 shadow-lg bg-white dark:bg-[#0D1B2A] overflow-hidden transition-all duration-700 ease-in-out '>
      <h3 className='dark:text-white text-2xl sm:text-4xl md:text-2xl lg:text-4xl font-bold text-black'>{t('fareCalculator')}</h3>
              <form
                    onSubmit={handleSubmit}
                    className="space-y-5 max-w-md w-full mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow"
                  >
                    {/* Champ Départ */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-blue-600 text-lg" />
                      </div>
                      <Input
                        value={start}
                        onChange={handleChange}
                        onBlur={() => setShowSuggestionsStart(false)}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                  errors.start ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                }`}
                        placeholder={f("go")}
                      />
                      {errors.start && <p className="text-red-600 text-sm mt-1">{errors.start}</p>}
                      {showSuggestionsStart && (
                        <ul onMouseDown={(e) => e.preventDefault()}
                        className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-40 overflow-y-auto">
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
                          ) : (
                            <li className="dark:text-white px-4 py-2 text-gray-500">Aucune suggestion</li>
                          )}
                        </ul>
                      )}
                    </div>
              
                    {/* Champ Destination */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLocationArrow className="text-blue-600 text-lg" />
                      </div>
                      <Input
                        value={end}
                        onChange={handleChanged}
                        onBlur={() => setShowSuggestionsEnd(false)}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                  errors.end ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                }`}
                        placeholder={f("arrive")}
                      />
                      {errors.end && <p className="text-red-600 text-sm mt-1">{errors.end}</p>}
                      {showSuggestionsEnd && (
                        <ul onMouseDown={(e) => e.preventDefault()}
                        className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-40 overflow-y-auto">
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
              
                    {/* Select Heure */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRegClock className="text-blue-600" />
                      </div>
                      <select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border appearance-none ${
                  errors.hour ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                }`}
                      >
                        <option value="">{f("time")}</option>
                        {predefinedHours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      {errors.hour && <p className="text-red-600 text-sm mt-1">{errors.hour}</p>}
                    </div>
              
                    {/* Bouton Calculer */}
                    <Button
                      type="submit"
                      // onClick={handleCost}
                      disabled={isLoading}
                      className="text-white dark:bg-gray-800 dark:text-white dark:hover:bg-green-800 bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                      <FaCalculator className="mr-2" />
                      {isLoading ? t('calculating') : t('calculateFare')}
                    </Button>
                  </form>
                  {showCards && (
    <div className="w-full flex justify-center flex-wrap gap-4 mt-6">
      {/* Carte 1 */}
      <Link href={'https://rideandgo.vercel.app/'} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
        <FaCar className="text-orange-500 text-3xl mb-2" />
        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_ride')}</p>
      </div>
      </Link>

      {/* Carte 2 */}
      <Link href={'https://lets-go-liart-phi.vercel.app/'} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
        <FaBus className="text-orange-500 text-3xl mb-2" />
        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('travel_agency')}</p>
      </div>
      </Link>

      {/* Carte 3 */}
      <Link href={'https://easy-rental-git-review-admin-reseaus-projects.vercel.app/'} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
        <FaCarSide className="text-orange-500 text-3xl mb-2" />
        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_rental')}</p>
      </div>
      </Link>
    </div>
  )}
                    {/* <LinearBufferButton /> */}
                    {error && <p className="text-red-500 mt-2">Problème de connexion au serveur</p>}
                {/* <h5>Vous avez utilise {utilisations} fois. Veullez vous connectez</h5> */}
                {result && !showCustomDiv && (
                <div className={`lg:w-120 sm:w-120 md:w-120 w-[260px] h-auto relative p-4 dark:bg-gray-800 rounded-md border border-gray-200 bg-white shadow-sm space-y-4 lg:text-sm md:text-sm sm:text-sm overflow-auto transition-all duration-700 ease-in-out ${show ? 'opacity-100 mt-0' : 'opacity-0'}`}>
                  
                  <div className="flex items-center gap-2 font-semibold text-lg text-blue-900">
                    <FaMoneyBillAlt />
                    <span className='dark:text-white'>{t('estimationTitle')}</span>
                  </div>

                  <div className="flex justify-between gap-2">
                    <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-3">
                      <div className="flex items-center gap-1 font-medium text-blue-700">
                        <MdOutlineDirectionsWalk />
                        <span className='text-blue-700 dark:text-white'>{t('distance')}</span>
                      </div>
                      <div className="text-xl font-bold text-black dark:text-white">
                        {result.distance.toFixed(2)} km
                      </div>
                    </div>
                  </div>

                  <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                    <span className='text-blue-700 dark:text-white'>{t('estimatedCost')}</span>
                    <span className="font-bold text-blue-700 dark:text-white">{result.cost.toFixed(0)} FCFA</span>
                  </div>

                  <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                    <span className='text-blue-700 dark:text-white'>{t('officialFare')}</span>
                    <span className="font-bold text-blue-700 dark:text-white">{result.mint_cost} FCFA</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <Button
                      onClick={() => setShowCustomDiv(true)}
                      className="bg-green-600 text-white w-full h-12 lg:hidden sm:hidden md:hidden hover:bg-green-800"
                    >
                      {t('viewRoute')}
                    </Button>

                    <Button
                      onClick={() => {
                        setResult(null);
                        setShow(false);
                        setShowCards(true);
                      }}
                      className="bg-blue-600 text-white w-full h-12 hover:bg-blue-800"
                    >
                      Refaire un calcul
                    </Button>
                  </div>

                  <div className='relative items-center flex flex-wrap justify-center gap-4'>
                    <Link href={'https://rideandgo.vercel.app/'} target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                        <FaCar className="text-orange-500 text-3xl mb-2" />
                        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">Besoin d&apos;une course?</p>
                      </div>
                    </Link>
                    <Link href={'https://lets-go-liart-phi.vercel.app/'} target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                        <FaBus className="text-orange-500 text-3xl mb-2" />
                        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">Besoin d&apos;une agence de voyage?</p>
                      </div>
                    </Link>
                    <Link href={'https://easy-rental-git-review-admin-reseaus-projects.vercel.app/'} target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                        <FaCarSide className="text-orange-500 text-3xl mb-2" />
                        <p className="text-center text-gray-800 dark:text-white text-sm font-medium">Besoin d&apos;une location?</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
                                
                                                {result && showCustomDiv && (
                                                  <div className="lg:w-120 sm:w-120 md:w-120 w-[260px] h-auto relative p-4 dark:bg-gray-800 rounded-md border border-gray-200 bg-white shadow-sm space-y-4 lg:text-sm md:text-sm sm:text-sm overflow-hidden transition-all duration-700 ease-in-out">
                                                    {/* <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-white">Détails Supplémentaires</h2>
                                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                      Ce div personnalisé vous permet d'afficher d'autres informations : statistiques, conseils, analyse des coûts, etc.
                                                    </p> */}
                                                    <div className="lg:hidden sm:hidden md:hidden rounded-2xl w-full h-full relative z-10 mt-0">
                                                                          {/* <Mapleaf /> */}
                                                                          {/* <MapNavigoo/> */}
                                                                          <MapNavigooWrapper startPlaceName={start} endPlaceName={end} />
                                                                    </div>
                                                    <Button 
                                                      onClick={() => {
                                                        setShowCustomDiv(false);
                                                        setResult(null);
                                                        setShow(false);
                                                      }} 
                                                      className="bg-blue-600 hover:bg-blue-800 text-white w-full h-12"
                                                    >
                                                      Refaire un calcul
                                                    </Button>
                                                  </div>
                                                )}
      </div>
      <div className="hidden lg:block mr-5 rounded-2xl ml-4 relative w-full h-full z-10 mt-6">
            {/* <Mapleaf /> */}
            <MapNavigooWrapper startPlaceName={start} endPlaceName={end} />
      </div>                
    </section>
  )
}

export default Section1pro
