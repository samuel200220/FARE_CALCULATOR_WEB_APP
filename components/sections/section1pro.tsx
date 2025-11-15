"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FaRegClock, FaCalculator, FaCar, FaBus, FaCarSide, FaMoneyBillAlt, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Place, Route } from '@/lib/types';
import { enregistrerCalcul } from '@/app/services/calculService';
import { event } from "@/lib/gtag";


const predefinedHours = [
  "06:00", "07:00", "08:00", "09:00",
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00"
];

const MapNavigoo = dynamic(() => import('../../components/carte').then((mod) => mod.default), {
  ssr: false,
});

const Section1pro = ({}) => {
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

  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');
  
  const [show, setShow] = useState(false);
  const [showSuggestionsStart, setShowSuggestionsStart] = useState(false);
  const [showSuggestionsEnd, setShowSuggestionsEnd] = useState(false);
  const [filteredSuggestionsd, setFilteredSuggestionsd] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compteur, setCompteur] = useState(0);
  const [bloque, setBloque] = useState(false);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [estConnecte, setEstConnecte] = useState(false);
  const [showCards, setShowCards] = useState(true);

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
  const [errors, setErrors] = useState<{ start?: string; end?: string; hour?: string }>({});

  const progressRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStart(value);
    setSelectedDepartPlace(null);

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

    if (suggestions.some((s) => s.toLowerCase().trim() === value.toLowerCase().trim())) {
      setShowSuggestionsStart(false);
    }
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

  const handleSelect = (value: string) => {
    setStart(value);
    setShowSuggestionsStart(false);
  };

  const handleSelectd = (value: string) => {
    setEnd(value);
    setShowSuggestionsEnd(false);
  };

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


    try {
      setIsLoading(true);
      await calculateRoute();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
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
    <section className='w-full h-[850px] p-4 justify-center items-center flex mb-4 mt-0'>
      <div className='lg:w-4xl sm:w-4xl md:w-4xl w-[320px] h-full relative mt-6 lg:ml-6 sm:ml-6 md:ml-6 ml-1 rounded-3xl justify-start pt-10 items-center flex flex-col gap-4 shadow-lg bg-white dark:bg-[#0D1B2A] overflow-hidden transition-all duration-700 ease-in-out'>
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
                
                {/* {getCombinedSuggestions('start').local.length > 0 && (
                  <>
                    <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                      Suggestions
                    </li>
                    {getCombinedSuggestions('start').local.map((s, index) => (
                      <li
                        key={`local-${index}`}
                        onClick={() => handleSelect(s)}
                        className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                  </>
                )} */}
                
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
                
                {/* {getCombinedSuggestions('end').local.length > 0 && (
                  <>
                    <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                      Suggestions
                    </li>
                    {getCombinedSuggestions('end').local.map((s, index) => (
                      <li
                        key={`local-${index}`}
                        onClick={() => handleSelectd(s)}
                        className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                  </>
                )} */}
                
                {getCombinedSuggestions('end').backend.length === 0 && getCombinedSuggestions('end').local.length === 0 && (
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
            disabled={isLoading}
            onClick={() =>
              event({
                action: "click_calcul",
                category: "interaction",
                label: "Bouton Calculer",
              })
            }
            className="text-white dark:bg-blue-700 dark:text-white dark:hover:bg-green-800 bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
          >
            <FaCalculator className="mr-2" />
            {isLoading ? t('calculating') : t('calculateFare')}
          </Button>
        </form>

        {showCards && (
          <div className="w-full flex justify-center flex-wrap gap-4 mt-6">
            <Link href={'https://rideandgo.vercel.app/'} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                <FaCar className="text-orange-500 text-3xl mb-2" />
                <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_ride')}</p>
              </div>
            </Link>

            <Link href={'https://lets-go-liart-phi.vercel.app/'} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                <FaBus className="text-orange-500 text-3xl mb-2" />
                <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('travel_agency')}</p>
              </div>
            </Link>

            <Link href={'https://easy-rental-git-review-admin-reseaus-projects.vercel.app/'} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-xl shadow-md w-[180px] hover:scale-105 transition-transform cursor-pointer">
                <FaCarSide className="text-orange-500 text-3xl mb-2" />
                <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_rental')}</p>
              </div>
            </Link>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">Problème de connexion au serveur</p>}
        
        {/* Affichage des résultats avec itinéraires */}
        {result && routes.length > 0 && !showCustomDiv && (
          <div className={`lg:w-120 sm:w-120 md:w-120 w-[260px] h-auto relative p-4 dark:bg-gray-800 rounded-md border border-gray-200 bg-white shadow-sm space-y-4 lg:text-sm md:text-sm sm:text-sm overflow-auto transition-all duration-700 ease-in-out ${show ? 'opacity-100 mt-0' : 'opacity-0'}`}>
            <div className="flex items-center gap-2 font-semibold text-lg text-blue-900">
              <FaMoneyBillAlt />
              <span className='dark:text-white'>{t('estimationTitle')}</span>
            </div>

            {/* Informations de l'itinéraire sélectionné */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
              {/* <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Itinéraire {selectedRouteIndex + 1} / {routes.length}</span>
                {routes.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRouteIndex(Math.max(0, selectedRouteIndex - 1))}
                      disabled={selectedRouteIndex === 0}
                      className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 text-xs"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setSelectedRouteIndex(Math.min(routes.length - 1, selectedRouteIndex + 1))}
                      disabled={selectedRouteIndex === routes.length - 1}
                      className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 text-xs"
                    >
                      →
                    </button>
                  </div>
                )}
              </div> */}
              
              <div className="flex justify-between gap-2">
                <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-0">
                  <div className="flex items-center gap-1 font-medium text-blue-700">
                  <MdOutlineDirectionsWalk className="flex items-center gap-1 font-medium text-blue-700" />
                  <span className="text-blue-700 dark:text-white">{t('distance')}:</span>
                </div>
                <div className="text-xl font-bold text-black dark:text-white">{(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km</div>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-0">
                  <div className="flex items-center gap-1 font-medium text-blue-700">
                  <FaRegClock className="flex items-center gap-1 font-medium text-blue-700" />
                  <span className="text-blue-700 dark:text-white">Durée:</span>
                </div>
                <span className="text-xl justify-end font-bold text-black dark:text-white">{(routes[selectedRouteIndex].duration / 60).toFixed(0)} min</span>
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
                  setRoutes([]);
                  setSelectedRouteIndex(0);
                }}
                className="bg-blue-600 text-white w-full h-12 hover:bg-blue-800"
              >
                Refaire un calcul
              </Button>
            </div>

            {/* Étapes détaillées de l'itinéraire */}
            {/* {routes[selectedRouteIndex].steps && routes[selectedRouteIndex].steps.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-sm mb-3 dark:text-white">Instructions détaillées:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {routes[selectedRouteIndex].steps.map((step, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm dark:text-white">{step.instruction || 'Continuer tout droit'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(step.distance / 1000).toFixed(2)} km - {(step.duration / 60).toFixed(0)} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

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

        {/* Vue carte mobile */}
        {result && routes.length > 0 && showCustomDiv && (
          <div className="lg:w-120 sm:w-120 md:w-120 w-[260px] h-auto relative p-4 dark:bg-gray-800 rounded-md border border-gray-200 bg-white shadow-sm space-y-4 lg:text-sm md:text-sm sm:text-sm overflow-hidden transition-all duration-700 ease-in-out">
            <div className="lg:hidden sm:hidden md:hidden rounded-2xl w-full h-[400px] relative z-10 mt-0">
              <MapNavigoo
                userLocation={userLocation}
                searchedPlace={searchedPlace}
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                setSelectedRouteIndex={setSelectedRouteIndex}
              />
            </div>
            
            {/* Résumé de l'itinéraire sous la carte */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Itinéraire {selectedRouteIndex + 1} / {routes.length}
                </span>
                {routes.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRouteIndex(Math.max(0, selectedRouteIndex - 1))}
                      disabled={selectedRouteIndex === 0}
                      className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 text-sm font-bold"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setSelectedRouteIndex(Math.min(routes.length - 1, selectedRouteIndex + 1))}
                      disabled={selectedRouteIndex === routes.length - 1}
                      className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 text-sm font-bold"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-300">Distance</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-300">Durée</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-300">Coût estimé</div>
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {result.cost.toFixed(0)} FCFA
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-300">Tarif officiel</div>
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {result.mint_cost} FCFA
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                setShowCustomDiv(false);
                setResult(null);
                setShow(false);
                setRoutes([]);
                setSelectedRouteIndex(0);
              }} 
              className="bg-blue-600 hover:bg-blue-800 text-white w-full h-12"
            >
              Refaire un calcul
            </Button>
          </div>
        )}

      </div>
      
      {/* Carte desktop - toujours visible */}
      <div className="hidden lg:block mr-5 mt-6 rounded-2xl ml-4 relative w-full h-full z-10">
        <div  className="relative w-full h-full bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-lg px-4 flex flex-col items-center justify-center">
          <MapNavigoo
          userLocation={userLocation}
          searchedPlace={searchedPlace}
          routes={routes}
          selectedRouteIndex={selectedRouteIndex}
          setSelectedRouteIndex={setSelectedRouteIndex}
        />
        </div>
      </div>                
    </section>
  )
}

export default Section1pro