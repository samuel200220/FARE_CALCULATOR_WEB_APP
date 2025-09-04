"use client";

import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/navbar/header';
import Headeracc from '@/components/navbar/headeracc';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaRegCalendarAlt, FaRegClock, FaCalculator, FaBus, FaCar, FaCarSide } from 'react-icons/fa';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
import { enregistrerCalcul } from '@/app/services/calculService';
import dynamic from 'next/dynamic';
import Pricing from '@/components/pricing';
import EstimationResult from '@/components/EstimationResult';
import Accsec from '@/components/sections/accsec';
import Assec1 from '@/components/sections/accsec1';
import Assec2 from '@/components/sections/accsec2';
import Footer from '@/components/navbar/footer';
import Download from '@/components/sections/download';
import { useTranslations } from 'next-intl';

const libraries: Libraries = ["places"];
const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const predefinedHours = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00"
];

const MapNavigooWrapper = dynamic(() => import('@/components/MapNavigooWrapper.client'), { ssr: false });

const suggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
const destinationSuggestions = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Garoua','Melen','Mendong','Obili','Bertoua','Ebolowa','Buea','Limbe','Nkongsamba','Dschang','Bafang','Bamenda','emana','Biyem-Assi','Essos','Akwa','Bonaberi','Bonamoussadi','Bonapriso','Bonanjo','Bonamoussadi Nord','Bonamoussadi Sud','Nsimalen','Mokolo','Simbock','Mvan','Nkolbisson','Nkolmesseng','Eloundem','Carrefour Place','Bastos','Odja'];
// Types pour le backend
interface CreateCalculRequest {
  utilisateurId: string;
  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;
  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;
}

interface CalculResponse {
  idCalcul: string;
  utilisateurId: string;
  dateCalcul: string;
  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;
  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;
}

// Service API
const API_BASE_URL = 'http://localhost:8080/api';

class CalculService {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  static async enregistrerCalcul(request: CreateCalculRequest): Promise<CalculResponse> {
    const response = await fetch(`${API_BASE_URL}/calculs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  static async getHistoriqueUtilisateur(utilisateurId: string): Promise<CalculResponse[]> {
    const response = await fetch(`${API_BASE_URL}/calculs/utilisateur/${utilisateurId}`);
    return this.handleResponse(response);
  }

  static async getDerniersCalculs(utilisateurId: string): Promise<CalculResponse[]> {
    const response = await fetch(`${API_BASE_URL}/calculs/utilisateur/${utilisateurId}/recent`);
    return this.handleResponse(response);
  }

  static async compterCalculs(utilisateurId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/calculs/utilisateur/${utilisateurId}/count`);
    return this.handleResponse(response);
  }
}

export default function LandingPageClient() {
  const [selectedRideType, setSelectedRideType] = useState('Economy');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState("");
  // const t = useTranslations();
  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');
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

// useEffect(() => {
//   const connecte = localStorage.getItem("estConnecte") === "true";
//   setEstConnecte(connecte);
// }, []);

//   useEffect(() => {
//     if (estConnecte) {
//       setBloque(false); // Si connecté, pas de blocage
//       return; // Ignore le reste
//     }
  
//     const compteurStocke = parseInt(localStorage.getItem("compteurUtilisation") || "0", 10);
//     setCompteur(compteurStocke);
  
//     if (compteurStocke >= 3) {
//       setBloque(true);
//       setAfficherMessage(true);
//     } else {
//       setBloque(false);
//     }
//   }, [estConnecte]);
  

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

  const [showCustomDiv, setShowCustomDiv] = useState(false);

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
      if (estConnecte) {
        const utilisateurId = localStorage.getItem("utilisateurId") || 'anonymous';

        await enregistrerCalcul({
          utilisateurId,
          lieuDepart: start,
          lieuArrivee: end,
          heurePriseEnCharge: hour,
          distanceKm: data.distance,
          coutEstime: data.cost,
          tarifOfficiel: data.mint_cost,
        });
      }

      setShow(true);
    } catch (err) {
      setError((err as Error).message);
    }finally{
      setIsLoading(false);
    }
  };
  const [errors, setErrors] = useState<{ start?: string; end?: string; hour?: string }>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors: typeof errors = {};
  if (!start.trim()) {
    newErrors.start = 'Le champ Départ est requis.';
  } else if (/^\d+$/.test(start.trim())) {
    newErrors.start = 'Le champ Départ ne peut pas contenir uniquement des chiffres.';
  }

  if (!end.trim()) {
    newErrors.end = 'Le champ Destination est requis.';
  } else if (/^\d+$/.test(end.trim())) {
    newErrors.end = 'Le champ Destination ne peut pas contenir uniquement des chiffres.';
  }

  if (!hour) {
    newErrors.hour = "L'heure doit être sélectionnée.";
  }

  setErrors(newErrors);

  // Si erreurs de validation, arrêter ici
  if (Object.keys(newErrors).length > 0) return;

  // Gestion limite pour utilisateur non connecté
  if (!estConnecte && compteur >= 3) {
    toast.error("Vous avez atteint la limite de 3 utilisations. Veuillez vous enregistrer pour continuer.", {
      duration: 5000,
      position: 'top-center',
      style: {
        backgroundColor: '#fff',
        color: '#f87171',
        fontSize: '16px',
        padding: '16px',
        borderRadius: '8px',
      },
    });
    return;
  }

  try {
    setIsLoading(true);
    setProgress(0);
    setBuffer(10);
    await handleCost(); // ta fonction de calcul existante
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setIsLoading(false);
  }

  // Incrémentation compteur si utilisateur anonyme
  if (!estConnecte) {
    const nouveauCompteur = compteur + 1;
    localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());
    setCompteur(nouveauCompteur);

    if (nouveauCompteur >= 3) {
      setBloque(true);
      setAfficherMessage(true);
    }
  }
};

  return (
    <>
      <Headeracc />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">


        {/* Hero Section */}
        <main className="relative min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <img 
              src="/acc.jpg" 
              alt="Illustration calcul tarif" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    {t('heroTitle')}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                    {t('heroDescription')}
                </p>

                {/* App Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href={'/accueilano'}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                        {t('startFree')}
                    </button>
                    </Link>
                    <Link href={'/inscription1'}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                        {t('standardVersion')}
                    </button>
                    </Link>
                    <Link href={'/inscriptionpro'}>
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                        {t('proVersion')}
                    </button>
                    </Link>

                  {/* <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Disponible sur Google Play
                  </button> */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <a href="https://lets-go-liart-phi.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <div className="ml-18 lg:ml-0 sm:ml-0 w-[200px] lg:w-[180px] sm:w-[180px] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer">
                      <FaBus className="text-orange-500 text-3xl mb-2" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">
                        {a('travel_agency')}
                      </p>
                    </div>
                  </a>

                  <a href="https://rideandgo.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <div className="ml-20 lg:ml-0 sm:ml-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                      <FaCar className="text-orange-500 text-3xl mb-2" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_ride')}</p>
                    </div>
                  </a>

                  <a href="https://easy-rental-git-review-admin-reseaus-projects.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <div className="ml-20 lg:ml-0 sm:ml-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                      <FaCarSide className="text-orange-500 text-3xl mb-2" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_rental')}</p>
                    </div>
                  </a>
                </div>

              </div>

              
              <div className="bg-white dark:bg-[#0D1B2A] rounded-3xl shadow-lg mt-2 mb-2 p-8 w-full max-w-lg mx-auto">
                <h3 className="dark:text-white text-2xl sm:text-4xl font-bold mb-6 text-center">
                    {t('fareCalculator')}
                </h3>

                {!result ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Champ Départ */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-blue-600 text-lg" />
                      </div>
                      <Input
                        value={start}
                        onChange={handleChange}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                          errors.start ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                        }`}
                        placeholder={f("go")}
                      />
                      {errors.start && <p className="text-red-600 text-sm mt-1">{errors.start}</p>}
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
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                          errors.end ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                        }`}
                        placeholder={f("arrive")}
                      />
                      {errors.end && <p className="text-red-600 text-sm mt-1">{errors.end}</p>}
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

                    {/* Sélection Heure */}
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
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      {errors.hour && <p className="text-red-600 text-sm mt-1">{errors.hour}</p>}
                    </div>

                    {/* Bouton Calculer */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="text-white bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                        >
                        <FaCalculator className="mr-2" />
                        {isLoading ? t('calculating') : t('calculateFare')}
                    </Button>
                    {error && <p className="text-red-500 text-center mt-2">Problème de connexion au serveur</p>}
                  </form>
                ) : showCustomDiv ? (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative">
  
                  {/* Bouton fermer (croix en haut à droite) */}
                  <button 
                    onClick={() => {
                      setShowCustomDiv(false);
                    }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                  >
                    &times;
                  </button>

                  {/* Mini Formulaire pour recalculer sans sortir du mode carte */}
                  {/* <h3 className="text-xl font-bold text-blue-700 dark:text-white mb-4 text-center">
                    Recalculer un Trajet
                  </h3> */}

                  <form onSubmit={handleSubmit} className="space-y-4 mb-4 mt-2">
                    {/* Champ Départ */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-blue-600" />
                      </div>
                      <Input
                        value={start}
                        onChange={handleChange}
                        className="bg-gray-200 dark:bg-gray-800 dark:text-white w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder={f("go")}
                      />
                      {showSuggestionsStart && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg max-h-40 overflow-y-auto">
                          {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((s, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelect(s)}
                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer dark:text-white"
                              >
                                {s}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500 dark:text-white">Aucune suggestion</li>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Champ Destination */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLocationArrow className="text-blue-600" />
                      </div>
                      <Input
                        value={end}
                        onChange={handleChanged}
                        className="bg-gray-200 dark:bg-gray-800 dark:text-white w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder={f("arrive")}
                      />
                      {showSuggestionsEnd && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg max-h-40 overflow-y-auto">
                          {filteredSuggestionsd.length > 0 ? (
                            filteredSuggestionsd.map((s, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelectd(s)}
                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer dark:text-white"
                              >
                                {s}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500 dark:text-white">Aucune suggestion</li>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Heure */}
                    <div className='relative'>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRegClock className="text-blue-600" />
                      </div>
                    <select
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] w-full h-10 pl-10 pr-4 py-2 rounded-[7px] border appearance-none ${
                          errors.hour ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                        }`}
                    >
                      <option value="">{f("time")}</option>
                      {predefinedHours.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    </div>

                    {/* Bouton Calculer */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="text-white bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                        >
                        <FaCalculator className="mr-2" />
                        {isLoading ? t('calculating') : t('calculateFare')}
                    </Button>

                  </form>

                  {/* Carte avec le trajet */}
                  <div className="rounded-2xl w-full h-96 relative z-10 mt-4">
                    <MapNavigooWrapper startPlaceName={start} endPlaceName={end} />
                  </div>

                </div>

                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-lg text-blue-900 dark:text-white">
                      <FaMoneyBillAlt />
                      Notre estimation
                    </div>

                    <div className="flex justify-between gap-2">
                      <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-3">
                        <div className="flex items-center gap-1 font-medium text-blue-700 dark:text-white">
                          <MdOutlineDirectionsWalk />
                          Distance
                        </div>
                        <div className="text-xl font-bold text-black dark:text-white">
                          {result.distance.toFixed(2)} km
                        </div>
                      </div>
                    </div>

                    <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                      <span className="text-blue-700 dark:text-white">Coût Estimé</span>
                      <span className="font-bold text-blue-700 dark:text-white">{result.cost.toFixed(0)} FCFA</span>
                    </div>

                    <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                      <span className="text-blue-700 dark:text-white">Tarif Officiel</span>
                      <span className="font-bold text-blue-700 dark:text-white">{result.mint_cost} FCFA</span>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        onClick={() => setShowCustomDiv(true)}
                        className="bg-green-600 text-white w-full h-12 hover:bg-green-800"
                      >
                        Visualiser le trajet
                      </Button>

                      <Button
                        onClick={() => setResult(null)}
                        className="bg-blue-600 text-white w-full h-12 hover:bg-blue-800"
                      >
                        Refaire un calcul
                      </Button>
                    </div>
                  </div>
                )}


              </div>

            </div>
          </div>
        </main>
      </div>
      <Pricing/>
      <Accsec />
      {/* <Assec1/>
      <Assec2/> */}
      <Download/>
      <Footer/>
    </>
  );
}
