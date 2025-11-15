"use client";

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Headeracc from '@/components/navbar/headeracc';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaRegClock, FaCalculator, FaBus, FaCar, FaCarSide } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import 'react-time-picker/dist/TimePicker.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaLocationArrow } from 'react-icons/fa';
import { enregistrerCalcul } from '@/app/services/calculService';
import dynamic from 'next/dynamic';
import Pricing from '@/components/pricing';
import Accsec from '@/components/sections/accsec';
import Footer from '@/components/navbar/footer';
import Download from '@/components/sections/download';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { Place, Route } from '@/lib/types';
import { event } from "@/lib/gtag";

const predefinedHours = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00"
];

const MapNavigooWrapper = dynamic(() => import('@/components/MapNavigooWrapper.client'), { ssr: false });

const MapNavigoo = dynamic(() => import('../../components/carte').then((mod) => mod.default), {
  ssr: false,
});

export default function LandingPageClient() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [searchedPlace, setSearchedPlace] = useState<Place | null>(null);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  
    // États pour la recherche de lieux
    const [departSearchResults, setDepartSearchResults] = useState<Place[]>([]);
    const [destinationSearchResults, setDestinationSearchResults] = useState<Place[]>([]);
    const [selectedDepartPlace, setSelectedDepartPlace] = useState<Place | null>(null);
    const [selectedDestinationPlace, setSelectedDestinationPlace] = useState<Place | null>(null);
  
    const backendUrl = 'https://map-backend-reactif.onrender.com';
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  useEffect(() => {
        const loadSuggestions = async () => {
          try {
            const response = await fetch("/noms.txt");
            const text = await response.text();
    
            // Découpe par ligne et nettoie les espaces vides
            const noms = text
              .split("\n")
              .map((n) => n.trim())
              .filter((n) => n.length > 0);
    
            setSuggestions(noms);
            setDestinationSuggestions(noms);
          } catch (error) {
            console.error("Erreur lors du chargement de noms.txt :", error);
          }
        };
    
        loadSuggestions();
      }, []);

  // Recherche de lieux via le backend
    const searchPlaces = async (query: string, type: 'depart' | 'destination') => {
      if (!query || query.trim() === '') return;
  
      try {
        const response = await fetch(`${backendUrl}/api/places?name=${encodeURIComponent(query)}`);
        const data = await response.json();
  
        if (response.ok && data.success) {
          const validPlaces = data.data.filter((place: Place) => place.coordinates !== null);
          if (type === 'depart') {
            setDepartSearchResults(validPlaces);
          } else {
            setDestinationSearchResults(validPlaces);
          }
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };

  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');

  const [showSuggestionsStart, setShowSuggestionsStart] = useState(false);
  const [showSuggestionsEnd, setShowSuggestionsEnd] = useState(false);
  const [show, setShow] = useState(false);
  const [showCards, setShowCards] = useState(true);

  const handleSelectd = (value: string) => {
    setEnd(value);
    setShowSuggestionsEnd(false);
  };
  const [filteredSuggestionsd, setFilteredSuggestionsd] = useState<string[]>([]);

  const handlePlaceSelect = (place: Place, type: 'depart' | 'destination') => {
      if (type === 'depart') {
        setStart(place.name);
        setSelectedDepartPlace(place);
        setDepartSearchResults([]);
        setShowSuggestionsStart(false);
      } else {
        setEnd(place.name);
        setSelectedDestinationPlace(place);
        setDestinationSearchResults([]);
        setShowSuggestionsEnd(false);
      }
      setRoutes([]);
      setSelectedRouteIndex(0);
    };

  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEnd(value);
      setSelectedDestinationPlace(null);
  
      const filtered = destinationSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestionsd(filtered);
      setShowSuggestionsEnd(value.trim() !== "");
  
      // Recherche parallèle dans le backend
      if (value.trim() !== "") {
        searchPlaces(value, 'destination');
      } else {
        setDestinationSearchResults([]);
      }
  
      if (destinationSuggestions.some((s) => s.toLowerCase().trim() === value.toLowerCase().trim())) {
        setShowSuggestionsEnd(false);
      }
    };

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setStart(value);
  setSelectedDepartPlace(null); // Réinitialiser la sélection

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredSuggestions(filtered);
  setShowSuggestionsStart(value.trim() !== "");

  // Recherche parallèle dans le backend
  if (value.trim() !== "") {
    searchPlaces(value, 'depart');
  } else {
    setDepartSearchResults([]);
  }

  // Masquer si correspondance exacte
  if (suggestions.some((s) => s.toLowerCase().trim() === value.toLowerCase().trim())) {
    setShowSuggestionsStart(false);
  }
};
  
  const [isLoading, setIsLoading] = useState(false);

  const [compteur, setCompteur] = useState(0);
  const [bloque, setBloque] = useState(false);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [estConnecte, setEstConnecte] = useState(false);

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

  // Calcul de l'itinéraire avec le backend
    const calculateRoute = useCallback(async () => {
      // if (!selectedDepartPlace || !selectedDestinationPlace) {
      //   toast.error("Veuillez sélectionner un point de départ et une destination valides");
      //   return;
      // }
  
      setIsLoading(true);
      setError('');
  
      try {
        if (!selectedDepartPlace || !selectedDestinationPlace) {
          throw new Error('Veuillez sélectionner un point de départ et une destination valides');
        }
  
        const startPoint = selectedDepartPlace.coordinates;
        const endPoint = selectedDestinationPlace.coordinates;
  
        if (!startPoint || !endPoint) {
          throw new Error('Coordonnées invalides');
        }
  
        const response = await fetch(`${backendUrl}/api/routes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            points: [startPoint, endPoint],
            mode: 'driving',
            startPlaceName: selectedDepartPlace.name,
            endPlaceName: selectedDestinationPlace.name,
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.routes) {
          setRoutes(data.routes);
          setSelectedRouteIndex(0);
          
          // Calculer aussi le coût si nécessaire
          if (hour) {
            await handleCost();
          }
        } else {
          setError(data.error || 'Erreur lors du calcul de l\'itinéraire');
        }
      } catch (err) {
        setError('Erreur lors du calcul de l\'itinéraire');
        console.error('Route calculation error:', err);
      } finally {
        setIsLoading(false);
      }
    }, [selectedDepartPlace, selectedDestinationPlace, hour]);

  const handleCost = async () => {
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

    if (Object.keys(newErrors).length > 0) return;

    if (!estConnecte && compteur >= 3) {
      toast.error("Vous avez atteint la limite de 3 utilisations. Veuillez vous enregistrer pour continuer.", {
        duration: 5000,
        position: 'top-center',
        style: {
          backgroundColor: '#f87171',
          color: '#fff',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      await calculateRoute();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }

    if (!estConnecte) {
      const nouveauCompteur = compteur + 1;
      localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());
      setCompteur(nouveauCompteur);

      if (nouveauCompteur >= 3) {
        setBloque(true);
        setAfficherMessage(true);
      }
    }
    setShowCards(false);
  };

  // Combiner les résultats de suggestions locales et backend
  const getCombinedSuggestions = (type: 'start' | 'end') => {
    if (type === 'start') {
      const localSuggestions = filteredSuggestions.slice(0, 5);
      const backendSuggestions = departSearchResults.slice(0, 5);
      return { local: localSuggestions, backend: backendSuggestions };
    } else {
      const localSuggestions = filteredSuggestionsd.slice(0, 5);
      const backendSuggestions = destinationSearchResults.slice(0, 5);
      return { local: localSuggestions, backend: backendSuggestions };
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
            <Image
              src="/acc.jpg"
              alt="Illustration calcul tarif"

              fill  // occupe tout le conteneur parent (nécessite position: relative)
              className="object-cover rounded-lg"
              priority // optionnel (pour charger plus vite les images critiques)
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-2">
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
                        onBlur={() => setTimeout(() => setShowSuggestionsStart(false), 200)}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                        errors.start ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                        }`}
                        placeholder={f("go")}
                        id="start"
                        />
                      {errors.start && <p className="text-red-600 text-sm mt-1">{errors.start}</p>}
                      {showSuggestionsStart && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-60 overflow-y-auto">
                                        {getCombinedSuggestions('start').backend.length > 0 && (
                                          <>
                                            <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                              Lieux recommandés
                                            </li>
                                            {getCombinedSuggestions('start').backend.map((place) => (
                                              <li
                                                key={place.id}
                                                onClick={() => handlePlaceSelect(place, 'depart')}
                                                className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-2"
                                              >
                                                <FaMapMarkerAlt className="text-blue-500 text-sm" />
                                                <span>{place.name}</span>
                                              </li>
                                            ))}
                                          </>
                                        )}
                                        
                                        {getCombinedSuggestions('start').backend.length === 0 && getCombinedSuggestions('start').local.length === 0 && (
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
                        onBlur={() => setTimeout(() => setShowSuggestionsEnd(false), 200)}
                        className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[18px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
                        errors.end ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                        }`}
                        placeholder={f("arrive")}
                        id="end"
                      />
                      {errors.end && <p className="text-red-600 text-sm mt-1">{errors.end}</p>}
                      {showSuggestionsEnd && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-[7px] shadow-lg max-h-60 overflow-y-auto">
                                        {getCombinedSuggestions('end').backend.length > 0 && (
                                          <>
                                            <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                              Lieux recommandés
                                            </li>
                                            {getCombinedSuggestions('end').backend.map((place) => (
                                              <li
                                                key={place.id}
                                                onClick={() => handlePlaceSelect(place, 'destination')}
                                                className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-2"
                                              >
                                                <FaLocationArrow className="text-blue-500 text-sm" />
                                                <span>{place.name}</span>
                                              </li>
                                            ))}
                                          </>
                                        )}
                                        
                                        {getCombinedSuggestions('end').backend.length === 0 && getCombinedSuggestions('end').local.length === 0 && (
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
                        onClick={() =>
                          event({
                            action: "click_calcul",
                            category: "interaction",
                            label: "Bouton Calculer",
                          })
                        }
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
                        id="start"
                      />
                      {showSuggestionsStart && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg max-h-40 overflow-y-auto">
                          {getCombinedSuggestions('start').backend.length > 0 && (
                                            <>
                                              <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                                Lieux recommandés
                                              </li>
                                              {getCombinedSuggestions('start').backend.map((place) => (
                                                <li
                                                  key={place.id}
                                                  onClick={() => handlePlaceSelect(place, 'depart')}
                                                  className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-2"
                                                >
                                                  <FaMapMarkerAlt className="text-blue-500 text-sm" />
                                                  <span>{place.name}</span>
                                                </li>
                                              ))}
                                            </>
                                          )}
                                          
                                          {getCombinedSuggestions('start').backend.length === 0 && getCombinedSuggestions('start').local.length === 0 && (
                                            <li className="dark:text-white px-4 py-2 text-gray-500">Aucune suggestion</li>
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
                        id="end"
                      />
                      {showSuggestionsEnd && (
                        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow-lg max-h-40 overflow-y-auto">
                          {getCombinedSuggestions('end').backend.length > 0 && (
                                            <>
                                              <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                                Lieux recommandés
                                              </li>
                                              {getCombinedSuggestions('end').backend.map((place) => (
                                                <li
                                                  key={place.id}
                                                  onClick={() => handlePlaceSelect(place, 'destination')}
                                                  className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-2"
                                                >
                                                  <FaLocationArrow className="text-blue-500 text-sm" />
                                                  <span>{place.name}</span>
                                                </li>
                                              ))}
                                            </>
                                          )}
                                          
                                          {getCombinedSuggestions('end').backend.length === 0 && getCombinedSuggestions('end').local.length === 0 && (
                                            <li className="dark:text-white px-4 py-2 text-gray-500">Aucune suggestion</li>
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
                         onClick={() =>
                          event({
                            action: "click_calcul",
                            category: "interaction",
                            label: "Bouton Calculer",
                          })
                        }
                        className="text-white bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                        >
                        <FaCalculator className="mr-2" />
                        {isLoading ? t('calculating') : t('calculateFare')}
                    </Button>

                  </form>

                  {/* Carte avec le trajet */}
                  <div className="rounded-2xl w-full h-96 relative z-10 mt-4">
                    {/* <MapNavigooWrapper startPlaceName={start} endPlaceName={end} /> */}
                    <div className="relative w-full h-full bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-lg flex flex-col items-center justify-center">
                      <MapNavigoo
                      userLocation={userLocation}
                      searchedPlace={searchedPlace}
                      routes={routes}
                      selectedRouteIndex={selectedRouteIndex}
                      setSelectedRouteIndex={setSelectedRouteIndex}
                    />
                    </div>
                  </div>

                </div>

                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-lg text-blue-900 dark:text-white">
                      <FaMoneyBillAlt />
                      {t('estimationTitle')} {/* "Notre estimation" */}
                    </div>

                    <div className="flex justify-between gap-2">
                      <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-3">
                        <div className="flex items-center gap-1 font-medium text-blue-700 dark:text-white">
                          <MdOutlineDirectionsWalk />
                          {t('distance')} {/* "Distance" */}
                        </div>
                        <div className="text-xl font-bold text-black dark:text-white">
                          {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                        </div>
                        <div className="flex items-center gap-1 font-medium text-blue-700 dark:text-white">
                          <MdOutlineDirectionsWalk />
                          Duree {/* "Duree" */}
                        </div>
                        <div className="text-xl font-bold text-black dark:text-white">
                          {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                        </div>
                      </div>
                    </div>

                    <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                      <span className="text-blue-700 dark:text-white">{t('estimatedCost')}</span> {/* "Coût Estimé" */}
                      <span className="font-bold text-blue-700 dark:text-white">{result.cost.toFixed(0)} FCFA</span>
                    </div>

                    <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                      <span className="text-blue-700 dark:text-white">{t('officialFare')}</span> {/* "Tarif Officiel" */}
                      <span className="font-bold text-blue-700 dark:text-white">{result.mint_cost} FCFA</span>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        onClick={() => setShowCustomDiv(true)}
                        className="bg-green-600 text-white w-full h-12 hover:bg-green-800"
                      >
                        {t('viewRoute')} {/* "Visualiser le trajet" */}
                      </Button>

                      <Button
                        onClick={() => setResult(null)}
                        className="bg-blue-600 text-white w-full h-12 hover:bg-blue-800"
                      >
                        {t('recalculate')} {/* "Refaire un calcul" */}
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

