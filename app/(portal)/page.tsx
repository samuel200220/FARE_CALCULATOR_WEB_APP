"use client";

import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/navbar/header';
import Headeracc from '@/components/navbar/headeracc';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaRegCalendarAlt, FaRegClock, FaCalculator } from 'react-icons/fa';
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

export default function LandingPage() {
  const [selectedRideType, setSelectedRideType] = useState('Economy');
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
      {/* <Head>
        <title>FareGo - Estimez vos trajets en quelques clics</title>
        <meta name="description" content="Estimez vos trajets urbains et interurbains en toute simplicité avec FareGo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head> */}
      <Headeracc />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

        {/* <header className="relative z-10 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-orange-500">Fare</span>
                  <span className="text-blue-600">Go</span>
                </div>
              </div>

              
              <nav className="hidden md:flex space-x-8">
                <Link href="/calculateur" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Calculateur
                </Link>
                <Link href="/statistiques" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Statistiques
                </Link>
                <Link href="/apropos" className="text-gray-700 hover:text-orange-500 transition-colors">
                  À propos
                </Link>
              </nav>

              
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors">
                  FR
                </button>
                <Link href="/signin" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Connexion
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </header> */}

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
                  Estimez votre Tarif Urbain ou Interurbain
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                  Avec Fare Calculator, obtenez une estimation rapide du coût de vos trajets au Cameroun. 
                  Transparence, rapidité et simplicité en quelques clics.
                </p>

                {/* App Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href={'/accueilano'}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Commencer Gratuitement
                  </button>
                  </Link>
                  <Link href={'/inscription1'}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Version Standard
                  </button>
                  </Link>
                  <Link href={'/inscriptionpro'}>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Version Pro
                  </button>
                  </Link>
                  {/* <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Disponible sur Google Play
                  </button> */}
                </div>
              </div>

              {/* Right Column - Fare Calculator Form */}
              {/* <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculer un Tarif</h3>
                
              
                <div className="mb-6">
                  <div className="flex space-x-4">
                    {['Économique', 'Confort', 'VIP'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="rideType"
                          value={type}
                          checked={selectedRideType === type}
                          onChange={(e) => setSelectedRideType(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de départ
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Yaoundé"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu d'arrivée
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Douala"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date du trajet
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Calculer le tarif
                </button>
              </div> */}
              
              <div className="bg-white dark:bg-[#0D1B2A] rounded-3xl shadow-lg mt-2 mb-2 p-8 w-full max-w-lg mx-auto">
                <h3 className="dark:text-white text-2xl sm:text-4xl font-bold mb-6 text-center">
                  Calculateur de Tarif
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
                        placeholder="Départ"
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
                        placeholder="Destination"
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
                        <option value="">Sélectionnez l'heure</option>
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
                      className="text-white bg-blue-700 w-full h-12 hover:bg-violet-800 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                      <FaCalculator className="mr-2" />
                      {isLoading ? 'Calcul en cours...' : 'Calculer tarif'}
                    </Button>
                    {error && <p className="text-red-500 text-center mt-2">Problème de connexion au serveur</p>}
                  </form>
                ) : showCustomDiv ? (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                    {/* <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-white">Détails Supplémentaires</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Ce div personnalisé remplace les résultats. Vous pouvez y mettre n'importe quel contenu complémentaire : graphiques, stats, explication des coûts, etc.
                    </p> */}
                    <div className="rounded-2xl w-full h-full relative z-10 mt-0">
                          {/* <Mapleaf /> */}
                          {/* <MapNavigoo/> */}
                          <MapNavigooWrapper startPlaceName={start} endPlaceName={end} />
                    </div>
                    <Button 
                      onClick={() => {
                        setShowCustomDiv(false);
                        setResult(null);
                      }} 
                      className="bg-blue-600 hover:bg-blue-800 text-white w-full h-12 mt-4"
                    >
                      Refaire un calcul
                    </Button>
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
      {/* <EstimationResult
      distance={19.9}
      duration="1h 9min 49s"
      estimatedCost={304.5}
      officialCost={243.6}
    /> */}
      <Accsec />
      <Assec1/>
      <Assec2/>
      <Download/>
      <Footer/>
    </>
  );
}
