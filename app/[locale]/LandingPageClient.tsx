"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Headeracc from '@/components/navbar/headeracc';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  FaRegClock, FaCalculator, FaBus, FaCar, FaCarSide, 
  FaMoneyBillAlt, FaMapMarkerAlt, FaLocationArrow,
  FaCloudRain, FaRoad, FaCalendarAlt, FaCarCrash,
  FaSuitcase, FaHardHat, FaArrowRight, FaArrowLeft
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import 'react-time-picker/dist/TimePicker.css';
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
import QRCode from "react-qr-code";

// Importer ONNX Runtime
import * as ort from 'onnxruntime-web';

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

export default function LandingPageClient() {
  //Url pour l qrcode
  const url = "https://fare-calculator-web-app-pcto.vercel.app";

  const [step, setStep] = useState(1);
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
  
  const [placeNames, setPlaceNames] = useState<string[]>([]);
  const [showSuggestionsStart, setShowSuggestionsStart] = useState(false);
  const [showSuggestionsEnd, setShowSuggestionsEnd] = useState(false);
  const [filteredSuggestionsStart, setFilteredSuggestionsStart] = useState<string[]>([]);
  const [filteredSuggestionsEnd, setFilteredSuggestionsEnd] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [compteur, setCompteur] = useState(0);
  const [bloque, setBloque] = useState(false);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [estConnecte, setEstConnecte] = useState(false);
  
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [hour, setHour] = useState('');
  
  // Nouvelles variables pour les étapes 2 et 3
  const [jourSemaine, setJourSemaine] = useState('');
  const [jourFerie, setJourFerie] = useState('0');
  const [pluie, setPluie] = useState('0');
  const [etatRoute, setEtatRoute] = useState('bonne');
  const [accident, setAccident] = useState('0');
  const [bagages, setBagages] = useState('non');
  const [routesLarges, setRoutesLarges] = useState('oui');
  const [routesTravaux, setRoutesTravaux] = useState('non');
  
  // Modèle ONNX
  const [onnxSession, setOnnxSession] = useState<ort.InferenceSession | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  
  interface PredictionResult {
    prix_estime_fcfa: number;
    prix_estime_range: string;
    message: string;
    lieux_comms: string;
    official_fare?: number;
  }
  
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ 
    start?: string; 
    end?: string; 
    hour?: string;
    jourSemaine?: string;
    etatRoute?: string;
  }>({});

  // Charger le modèle ONNX au démarrage
  useEffect(() => {
    const loadONNXModel = async () => {
      try {
        setModelLoading(true);
        console.log('Chargement du modèle ONNX...');
        
        const session = await ort.InferenceSession.create('/model.onnx', {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        });
        
        setOnnxSession(session);
        console.log('Modèle ONNX chargé avec succès');
        toast.success('Modèle de prédiction prêt!', { position: 'bottom-right' });
      } catch (err) {
        console.error('Erreur lors du chargement du modèle ONNX:', err);
        toast.error('Modèle non chargé, utilisation du calcul par API', { position: 'bottom-right' });
      } finally {
        setModelLoading(false);
      }
    };

    loadONNXModel();
  }, []);

  // Chargement des noms depuis le fichier texte
  useEffect(() => {
    const loadPlaceNames = async () => {
      try {
        const response = await fetch('/noms.txt');
        if (response.ok) {
          const text = await response.text();
          const names = text
            .split('\n')
            .map(name => {
              let cleanName = name.trim();
              cleanName = cleanName.replace(/,$/, '');
              return cleanName.split(',').map(part => part.trim());
            })
            .flat()
            .filter(name => 
              name && 
              name.length > 0 && 
              name !== 'undefined' && 
              name !== 'null' &&
              !name.includes('Response body') &&
              !name.includes('Server response') &&
              !name.includes('Code Details')
            );
          
          const uniqueNames = [...new Set(names)].sort((a, b) => a.localeCompare(b));
          
          if (uniqueNames.length > 0) {
            setPlaceNames(uniqueNames);
          } else {
            setPlaceNames([
              "mvan", "Melen 8", "Yaoundé", "Douala", "Garoua", "Maroua", "Bafoussam",
              "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba",
              "Limbe", "Kribi", "Mbalmayo", "Edea", "Foumban"
            ]);
          }
        } else {
          setPlaceNames([
            "mvan", "Melen 8", "Yaoundé", "Douala", "Garoua", "Maroua", "Bafoussam",
            "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba",
            "Limbe", "Kribi", "Mbalmayo", "Edea", "Foumban"
          ]);
        }
      } catch (error) {
        setPlaceNames([
          "mvan", "Melen 8", "Yaoundé", "Douala", "Garoua", "Maroua", "Bafoussam",
          "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba",
          "Limbe", "Kribi", "Mbalmayo", "Edea", "Foumban"
        ]);
      }
    };
    loadPlaceNames();
  }, []);

  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');

  // Fonction de prédiction utilisant ONNX
  const preprocessInputForONNX = (data: any): Record<string, ort.Tensor> => {
    const feeds: Record<string, ort.Tensor> = {};

    const makeString = (value: any) =>
      new ort.Tensor('string', [String(value)], [1, 1]);

    const makeFloat = (value: any) =>
      new ort.Tensor('float32', new Float32Array([parseFloat(value)]), [1, 1]);

    feeds['pluie'] = makeString(data.pluie);
    feeds['etat_route'] = makeString(data.etat_route);
    feeds['heure'] = makeString(data.heure);
    feeds['jour_semaine'] = makeString(data.jour_semaine);
    feeds['jour_ferie'] = makeString(data.jour_ferie);
    feeds['bagages'] = makeString(data.bagages);
    feeds['routes_larges'] = makeString(data.routes_larges);
    feeds['routes_travaux'] = makeString(data.routes_travaux);
    feeds['accident'] = makeString(data.accident);
    feeds['depart_osm'] = makeString(data.depart_osm);
    feeds['destination_osm'] = makeString(data.destination_osm);
    feeds['distance_km'] = makeFloat(data.distance_km);

    return feeds;
  };

  const predictWithONNX = async (inputData: any): Promise<number> => {
    if (!onnxSession) {
      throw new Error('Modèle ONNX non chargé');
    }

    try {
      const feeds = preprocessInputForONNX(inputData);
      const missingInputs = onnxSession.inputNames.filter(name => !feeds[name]);
      if (missingInputs.length > 0) {
        missingInputs.forEach(inputName => {
          feeds[inputName] = new ort.Tensor('float32', new Float32Array([0]), [1, 1]);
        });
      }

      const results = await onnxSession.run(feeds);
      const outputName = onnxSession.outputNames[0];
      const output = results[outputName];
      const prediction = output.data[0];
      
      return Number(prediction);
    } catch (error) {
      console.error('Erreur lors de la prédiction ONNX:', error);
      throw error;
    }
  };

  // Fonction de prédiction utilisant l'API externe
  const predictWithAPI = async (predictionData: any): Promise<{prix_estime_fcfa: number}> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://farcal-api-coast.onrender.com/predict', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(predictionData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = 'Erreur serveur';
      try {
        errorText = await response.text();
      } catch {
        errorText = `Erreur HTTP ${response.status}`;
      }
      console.error('Erreur API de prédiction:', errorText);
      throw new Error(`L'API de prédiction n'est pas disponible (${response.status})`);
    }

    const result = await response.json();
    
    if (result.prix_estime_fcfa !== undefined) {
      return result;
    } else {
      throw new Error('Format de réponse invalide');
    }
  };

  // Fonction pour obtenir le tarif officiel (ancienne API)
  const getOfficialFare = async (start: string, end: string, hour: string): Promise<{cost: number, mint_cost: number, distance: number} | null> => {
    try {
      const res = await fetch('https://fare-calculator.onrender.com/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, hour }),
      });

      if (!res.ok) {
        return null;
      }

      return await res.json();
    } catch (err) {
      console.warn('Erreur tarif officiel:', err);
      return null;
    }
  };

  // Recherche de lieux via le backend
  const searchPlaces = async (query: string, type: 'depart' | 'destination') => {
    if (!query || query.trim() === '') {
      if (type === 'depart') {
        setDepartSearchResults([]);
      } else {
        setDestinationSearchResults([]);
      }
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/places?name=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        if (type === 'depart') {
          setDepartSearchResults([]);
        } else {
          setDestinationSearchResults([]);
        }
        return;
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const validPlaces = data.data.filter((place: Place) => 
          place && place.coordinates && place.coordinates.lat && place.coordinates.lng
        );
        
        if (type === 'depart') {
          setDepartSearchResults(validPlaces.slice(0, 5));
        } else {
          setDestinationSearchResults(validPlaces.slice(0, 5));
        }
      }
    } catch (err) {
      if (type === 'depart') {
        setDepartSearchResults([]);
      } else {
        setDestinationSearchResults([]);
      }
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

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStart(value);
    setSelectedDepartPlace(null);

    const filtered = placeNames.filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
    
    setFilteredSuggestionsStart(filtered);
    setShowSuggestionsStart(value.trim() !== "");

    if (value.trim() !== "") {
      searchPlaces(value, 'depart');
    } else {
      setDepartSearchResults([]);
    }

    if (placeNames.some(s => s.toLowerCase().trim() === value.toLowerCase().trim())) {
      setShowSuggestionsStart(false);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEnd(value);
    setSelectedDestinationPlace(null);

    const filtered = placeNames.filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
    
    setFilteredSuggestionsEnd(filtered);
    setShowSuggestionsEnd(value.trim() !== "");

    if (value.trim() !== "") {
      searchPlaces(value, 'destination');
    } else {
      setDestinationSearchResults([]);
    }

    if (placeNames.some(s => s.toLowerCase().trim() === value.toLowerCase().trim())) {
      setShowSuggestionsEnd(false);
    }
  };

  const handleSelectStart = (name: string) => {
    setStart(name);
    setShowSuggestionsStart(false);
    setSelectedDepartPlace(null);
  };

  const handleSelectEnd = (name: string) => {
    setEnd(name);
    setShowSuggestionsEnd(false);
    setSelectedDestinationPlace(null);
  };

  // Calcul de l'itinéraire avec le backend
  const calculateRoute = useCallback(async () => {
    if (!start.trim() || !end.trim()) {
      toast.error("Veuillez entrer un point de départ et une destination");
      return null;
    }

    setIsLoading(true);
    setError('');

    try {
      let startPoint, endPoint;
      
      if (selectedDepartPlace?.coordinates) {
        startPoint = selectedDepartPlace.coordinates;
      } else {
        const searchResponse = await fetch(
          `${backendUrl}/api/places?name=${encodeURIComponent(start)}`
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.success && Array.isArray(searchData.data) && searchData.data.length > 0) {
            const firstPlace = searchData.data[0];
            if (firstPlace.coordinates) {
              startPoint = firstPlace.coordinates;
            } else {
              startPoint = { lat: 3.8480, lng: 11.5021 };
            }
          } else {
            startPoint = { lat: 3.8480, lng: 11.5021 };
          }
        } else {
          startPoint = { lat: 3.8480, lng: 11.5021 };
        }
      }
      
      if (selectedDestinationPlace?.coordinates) {
        endPoint = selectedDestinationPlace.coordinates;
      } else {
        const searchResponse = await fetch(
          `${backendUrl}/api/places?name=${encodeURIComponent(end)}`
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.success && Array.isArray(searchData.data) && searchData.data.length > 0) {
            const firstPlace = searchData.data[0];
            if (firstPlace.coordinates) {
              endPoint = firstPlace.coordinates;
            } else {
              endPoint = { lat: 4.0511, lng: 9.7679 };
            }
          } else {
            endPoint = { lat: 4.0511, lng: 9.7679 };
          }
        } else {
          endPoint = { lat: 4.0511, lng: 9.7679 };
        }
      }

      const requestBody = {
        points: [startPoint, endPoint],
        mode: 'driving',
        startPlaceName: start,
        endPlaceName: end,
      };

      const response = await fetch(`${backendUrl}/api/routes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse du serveur n\'est pas du JSON valide');
      }

      const data = await response.json();
      return handleRouteData(data);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du calcul de l\'itinéraire';
      setError(errorMessage);
      console.error('Route calculation error:', err);
      
      const defaultDistance = Math.random() * 20 + 5;
      const defaultDuration = defaultDistance * 3;
      
      const defaultRoute = {
        distance: defaultDistance * 1000,
        duration: defaultDuration * 60,
        startPlaceName: start,
        endPlaceName: end,
        steps: []
      };
      
      setRoutes([defaultRoute]);
      setSelectedRouteIndex(0);
      
      toast.error("Utilisation de distance par défaut pour continuer le calcul.");
      return defaultRoute;
    } finally {
      setIsLoading(false);
    }
  }, [start, end, selectedDepartPlace, selectedDestinationPlace]);

  const handleRouteData = (data: any) => {
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      setRoutes(data.routes);
      setSelectedRouteIndex(0);
      
      toast.success('Itinéraire calculé avec succès!');
      
      return route;
    } else if (data.error) {
      throw new Error(data.error);
    } else if (data.message) {
      throw new Error(data.message);
    } else {
      const defaultDistance = Math.random() * 20 + 5;
      const defaultDuration = defaultDistance * 3;
      
      toast.error('Utilisation de distance par défaut. Vous pouvez continuer.');
      
      return {
        distance: defaultDistance * 1000,
        duration: defaultDuration * 60,
        routes: []
      };
    }
  };

  const extractDistanceKm = (route: any): number => {
    if (!route) return 0;
    
    if (route.distance !== undefined) {
      return Number(route.distance) / 1000;
    }
    
    return 0;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
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
      const route = await calculateRoute();
      if (route) {
        setStep(2);
      }
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
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!jourSemaine) {
      newErrors.jourSemaine = "Le jour de la semaine est requis.";
    }

    if (!etatRoute) {
      newErrors.etatRoute = "L'état de la route est requis.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentRoute = routes[selectedRouteIndex];
    
    if (!currentRoute) {
      toast.error("Aucun itinéraire disponible. Veuillez recalculer.");
      return;
    }

    const distanceToUse = extractDistanceKm(currentRoute);
    
    setIsLoading(true);
    setError('');

    try {
      const predictionData = {
        accident: accident,
        bagages: bagages,
        depart_osm: start.trim(),
        destination_osm: end.trim(),
        distance_km: parseFloat(distanceToUse.toFixed(2)),
        etat_route: etatRoute,
        heure: hour.split(':')[0],
        jour_ferie: jourFerie,
        jour_semaine: jourSemaine,
        pluie: pluie,
        routes_larges: routesLarges === 'oui' ? 'oui' : 'non',
        routes_travaux: routesTravaux
      };

      let prixEstime: number;
      let predictionSource = '';
      let officialFareResult: any = null;

      // Récupérer le tarif officiel en parallèle
      const officialFarePromise = getOfficialFare(start, end, hour);

      // Essayer d'abord avec ONNX
      if (onnxSession && !modelLoading) {
        try {
          prixEstime = await predictWithONNX(predictionData);
          predictionSource = 'ONNX';
        } catch (onnxError) {
          console.warn('Erreur ONNX, utilisation de l\'API:', onnxError);
          
          // Fallback à l'API
          try {
            const apiResult = await predictWithAPI(predictionData);
            prixEstime = apiResult.prix_estime_fcfa;
            predictionSource = 'API (fallback)';
          } catch (apiError) {
            console.warn('Erreur API, utilisation du calcul local:', apiError);
            prixEstime = calculateLocalEstimation(predictionData);
            predictionSource = 'local (fallback)';
          }
        }
      } else {
        // Si ONNX n'est pas chargé, utiliser l'API directement
        try {
          const apiResult = await predictWithAPI(predictionData);
          prixEstime = apiResult.prix_estime_fcfa;
          predictionSource = 'API (modèle non chargé)';
        } catch (apiError) {
          console.warn('Erreur API, utilisation du calcul local:', apiError);
          prixEstime = calculateLocalEstimation(predictionData);
          predictionSource = 'local (modèle non chargé)';
        }
      }

      // Récupérer le tarif officiel
      try {
        officialFareResult = await officialFarePromise;
      } catch (err) {
        console.warn('Tarif officiel non disponible:', err);
      }

      // Calcul de la fourchette de prix
      const prixArrondi = Math.round(prixEstime);
      const prixMin = Math.round(prixArrondi * 0.85);
      const prixMax = Math.round(prixArrondi * 1.15);
      
      const result = {
        prix_estime_fcfa: prixArrondi,
        prix_estime_range: `${prixMin} - ${prixMax} FCFA`,
        message: `Prédiction ${predictionSource}`,
        lieux_comms: `Trajet de ${start} à ${end}`,
        official_fare: officialFareResult?.mint_cost || 0
      };
      
      setPredictionResult(result);
      
      if (estConnecte) {
        const utilisateurId = localStorage.getItem("utilisateurId") || 'anonymous';
        await enregistrerCalcul({
          utilisateurId,
          lieuDepart: start,
          lieuArrivee: end,
          heurePriseEnCharge: hour,
          distanceKm: distanceToUse,
          coutEstime: prixArrondi,
          tarifOfficiel: officialFareResult?.mint_cost || 0,
        });
      }
      
      toast.success('Prédiction calculée avec succès!');

    } catch (err: any) {
      console.error('Erreur complète de prédiction:', err);
      
      let errorType = 'réseau';
      if (err.name === 'AbortError') {
        errorType = 'timeout';
        toast.error("L'API met trop de temps à répondre. Utilisation d'une estimation locale.");
      } else if (err.message?.includes('NetworkError') || err.message?.includes('Failed to fetch') || err.message?.includes('CORS')) {
        errorType = 'connexion';
        toast.error("Impossible de contacter le serveur. Utilisation d'une estimation locale.");
      } else {
        toast.error("Erreur API. Utilisation d'une estimation locale basée sur la distance.");
      }
      
      // Calcul d'estimation locale
      const prixEstime = calculateLocalEstimation({
        distance_km: distanceToUse,
        heure: hour.split(':')[0],
        etat_route: etatRoute,
        pluie: pluie,
        bagages: bagages
      });
      
      const prixArrondi = Math.round(prixEstime);
      const prixMin = Math.round(prixArrondi * 0.85);
      const prixMax = Math.round(prixArrondi * 1.15);
      
      const simulatedResult = {
        prix_estime_fcfa: prixArrondi,
        prix_estime_range: `${prixMin} - ${prixMax} FCFA`,
        message: `Estimation locale basée sur ${distanceToUse.toFixed(2)} km (erreur système)`,
        lieux_comms: `Trajet de ${start} à ${end}`,
        official_fare: 0
      };
      
      setPredictionResult(simulatedResult);
      setError(`⚠️ Calcul local utilisé (erreur ${errorType})`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de calcul local de secours
  const calculateLocalEstimation = (data: any): number => {
    const distance = data.distance_km || 10;
    const hourInt = parseInt(data.heure) || 12;
    const etatRoute = data.etat_route || 'bonne';
    const pluie = data.pluie || '0';
    const bagages = data.bagages || 'non';
    
    const tarifBase = 200;
    const tarifParKm = 150;
    const facteurHeure = (hourInt >= 18 || hourInt <= 6) ? 1.2 : 1;
    const facteurPluie = pluie === '1' ? 1.15 : 1;
    const facteurRoute = etatRoute === 'mauvaise' ? 1.25 : etatRoute === 'moyenne' ? 1.1 : 1;
    const facteurBagages = bagages === 'oui' ? 1.1 : 1;
    
    return Math.round(
      (tarifBase + (distance * tarifParKm)) * 
      facteurHeure * 
      facteurPluie * 
      facteurRoute * 
      facteurBagages
    );
  };

  const resetForm = () => {
    setStep(1);
    setStart('');
    setEnd('');
    setHour('');
    setJourSemaine('');
    setJourFerie('0');
    setPluie('0');
    setEtatRoute('bonne');
    setAccident('0');
    setBagages('non');
    setRoutesLarges('oui');
    setRoutesTravaux('non');
    setPredictionResult(null);
    setRoutes([]);
    setSelectedRouteIndex(0);
    setFilteredSuggestionsStart([]);
    setFilteredSuggestionsEnd([]);
    setShowSuggestionsStart(false);
    setShowSuggestionsEnd(false);
    setError('');
    setSelectedDepartPlace(null);
    setSelectedDestinationPlace(null);
    setDepartSearchResults([]);
    setDestinationSearchResults([]);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'}`}>
              {stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`w-12 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const getCombinedSuggestions = (type: 'start' | 'end') => {
    if (type === 'start') {
      const localSuggestions = filteredSuggestionsStart.slice(0, 5);
      const backendSuggestions = departSearchResults.slice(0, 5);
      return { local: localSuggestions, backend: backendSuggestions };
    } else {
      const localSuggestions = filteredSuggestionsEnd.slice(0, 5);
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
              fill
              className="object-cover rounded-lg"
              priority
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

              {/* Right Column - Calculator */}
              <div className="bg-white dark:bg-[#0D1B2A] rounded-3xl shadow-lg mt-2 mb-2 p-8 w-full max-w-lg mx-auto">
                <h3 className="dark:text-white text-2xl sm:text-4xl font-bold mb-6 text-center">
                    {t('fareCalculator')}
                </h3>

                {modelLoading && (
                  <div className="text-blue-600 text-sm mb-2 text-center">
                    Chargement du modèle de prédiction...
                  </div>
                )}

                {renderStepIndicator()}

                {!predictionResult ? (
                  <>
                    {step === 1 ? (
                      <form onSubmit={handleStep1Submit} className="space-y-5">
                        <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                          <FaMapMarkerAlt />
                          Informations de trajet
                        </h4>

                        {/* Champ Départ */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-blue-600 text-lg" />
                          </div>
                          <Input
                            value={start}
                            onChange={handleStartChange}
                            onFocus={() => {
                              if (start.trim() !== "" && placeNames.length > 0) {
                                const filtered = placeNames.filter(name =>
                                  name.toLowerCase().includes(start.toLowerCase())
                                ).slice(0, 5);
                                setFilteredSuggestionsStart(filtered);
                                setShowSuggestionsStart(true);
                              }
                            }}
                            onBlur={() => setTimeout(() => setShowSuggestionsStart(false), 200)}
                            className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
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
                                  {getCombinedSuggestions('start').backend.map((place: Place) => (
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
                              
                              {getCombinedSuggestions('start').local.length > 0 && (
                                <>
                                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                    Suggestions locales
                                  </li>
                                  {getCombinedSuggestions('start').local.map((name: string, index: number) => (
                                    <li
                                      key={`local-${index}`}
                                      onClick={() => handleSelectStart(name)}
                                      className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                                    >
                                      {name}
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
                            onChange={handleEndChange}
                            onFocus={() => {
                              if (end.trim() !== "" && placeNames.length > 0) {
                                const filtered = placeNames.filter(name =>
                                  name.toLowerCase().includes(end.toLowerCase())
                                ).slice(0, 5);
                                setFilteredSuggestionsEnd(filtered);
                                setShowSuggestionsEnd(true);
                              }
                            }}
                            onBlur={() => setTimeout(() => setShowSuggestionsEnd(false), 200)}
                            className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border ${
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
                                  {getCombinedSuggestions('end').backend.map((place: Place) => (
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
                              
                              {getCombinedSuggestions('end').local.length > 0 && (
                                <>
                                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                                    Suggestions locales
                                  </li>
                                  {getCombinedSuggestions('end').local.map((name: string, index: number) => (
                                    <li
                                      key={`local-${index}`}
                                      onClick={() => handleSelectEnd(name)}
                                      className="dark:text-white px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                                    >
                                      {name}
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
                          className="text-white dark:bg-blue-700 dark:text-white dark:hover:bg-green-800 bg-blue-700 w-full h-12 hover:bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                        >
                          {isLoading ? t('calculating') : 'Suivant'}
                          <FaArrowRight />
                        </Button>
                      </form>
                    ) : step === 2 ? (
                      <form onSubmit={handleStep2Submit} className="space-y-4">
                        <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                          <FaCalendarAlt />
                          Conditions de trajet
                        </h4>

                        {routes.length > 0 && routes[selectedRouteIndex] && (
                          <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                  <MdOutlineDirectionsWalk />
                                  Distance
                                </div>
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                  {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                  <FaRegClock />
                                  Durée
                                </div>
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                  {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-blue-600" />
                          </div>
                          <select
                            value={jourSemaine}
                            onChange={(e) => setJourSemaine(e.target.value)}
                            className={`bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-[7px] border appearance-none ${
                              errors.jourSemaine ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-blue-800'
                            }`}
                          >
                            <option value="">Jour de la semaine</option>
                            <option value="1">Lundi</option>
                            <option value="2">Mardi</option>
                            <option value="3">Mercredi</option>
                            <option value="4">Jeudi</option>
                            <option value="5">Vendredi</option>
                            <option value="6">Samedi</option>
                            <option value="7">Dimanche</option>
                          </select>
                          {errors.jourSemaine && <p className="text-red-600 text-sm mt-1">{errors.jourSemaine}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaCalendarAlt className="text-blue-600" />
                            Jour férié?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="0"
                                checked={jourFerie === '0'}
                                onChange={(e) => setJourFerie(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="1"
                                checked={jourFerie === '1'}
                                onChange={(e) => setJourFerie(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaCloudRain className="text-blue-600" />
                            Pluie?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="0"
                                checked={pluie === '0'}
                                onChange={(e) => setPluie(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="1"
                                checked={pluie === '1'}
                                onChange={(e) => setPluie(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaRoad className="text-blue-600" />
                            État de la route
                          </label>
                          <select
                            value={etatRoute}
                            onChange={(e) => setEtatRoute(e.target.value)}
                            className={`bg-gray-200 dark:bg-gray-800 dark:text-white w-full h-12 px-3 py-2 rounded-[7px] border ${
                              errors.etatRoute ? 'border-red-500 ring-red-500 focus:border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Sélectionner</option>
                            <option value="bonne">Bonne</option>
                            <option value="moyenne">Moyenne</option>
                            <option value="mauvaise">Mauvaise</option>
                          </select>
                          {errors.etatRoute && <p className="text-red-600 text-sm mt-1">{errors.etatRoute}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaCarCrash className="text-blue-600" />
                            Accident sur la route?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="0"
                                checked={accident === '0'}
                                onChange={(e) => setAccident(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="1"
                                checked={accident === '1'}
                                onChange={(e) => setAccident(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={() => setStep(1)}
                            className="bg-gray-500 hover:bg-gray-700 text-white w-1/2 h-12 flex items-center justify-center gap-2"
                          >
                            <FaArrowLeft />
                            Retour
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-700 hover:bg-green-800 text-white w-1/2 h-12 flex items-center justify-center gap-2"
                          >
                            Suivant
                            <FaArrowRight />
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleStep3Submit} className="space-y-4">
                        <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                          <FaSuitcase />
                          Conditions supplémentaires
                        </h4>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaSuitcase className="text-blue-600" />
                            Bagages?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="non"
                                checked={bagages === 'non'}
                                onChange={(e) => setBagages(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="oui"
                                checked={bagages === 'oui'}
                                onChange={(e) => setBagages(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaRoad className="text-blue-600" />
                            Routes larges?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="oui"
                                checked={routesLarges === 'oui'}
                                onChange={(e) => setRoutesLarges(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="non"
                                checked={routesLarges === 'non'}
                                onChange={(e) => setRoutesLarges(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaHardHat className="text-blue-600" />
                            Routes en travaux?
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="non"
                                checked={routesTravaux === 'non'}
                                onChange={(e) => setRoutesTravaux(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Non</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="oui"
                                checked={routesTravaux === 'oui'}
                                onChange={(e) => setRoutesTravaux(e.target.value)}
                                className="text-blue-600"
                              />
                              <span className="dark:text-white">Oui</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="bg-gray-500 hover:bg-gray-700 text-white w-1/2 h-12 flex items-center justify-center gap-2"
                          >
                            <FaArrowLeft />
                            Retour
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-700 hover:bg-green-800 text-white w-1/2 h-12 flex items-center justify-center gap-2"
                          >
                            <FaCalculator />
                            {isLoading ? 'Calcul...' : 'Calculer'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                ) : showCustomDiv ? (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative">
                    <button 
                      onClick={() => {
                        setShowCustomDiv(false);
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                    >
                      &times;
                    </button>

                    {/* Mini formulaire pour recalculer */}
                    <form onSubmit={(e) => { e.preventDefault(); resetForm(); }} className="space-y-4 mb-4 mt-2">
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12"
                      >
                        Nouveau calcul
                      </Button>
                    </form>

                    {/* Carte avec le trajet */}
                    <div className="rounded-2xl w-full h-96 relative z-10 mt-4">
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

                    {/* Résumé sous la carte */}
                    {predictionResult && routes.length > 0 && (
                      <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 space-y-2 mt-4">
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

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                            <div className="text-xs text-gray-500 dark:text-gray-300">Coût estimé</div>
                            <div className="font-bold text-green-600 dark:text-green-400">
                              {predictionResult.prix_estime_fcfa} FCFA
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-lg text-blue-900 dark:text-white">
                      <FaMoneyBillAlt />
                      {t('estimationTitle')}
                    </div>

                    {routes.length > 0 && routes[selectedRouteIndex] && (
                      <div className="flex justify-between gap-2">
                        <div className="flex-1 bg-blue-50 dark:bg-gray-800 rounded p-3">
                          <div className="flex items-center gap-1 font-medium text-blue-700 dark:text-white">
                            <MdOutlineDirectionsWalk />
                            {t('distance')}
                          </div>
                          <div className="text-xl font-bold text-black dark:text-white">
                            {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                          </div>
                          <div className="flex items-center gap-1 font-medium text-blue-700 dark:text-white mt-2">
                            <FaRegClock />
                            Durée
                          </div>
                          <div className="text-xl font-bold text-black dark:text-white">
                            {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                          </div>
                        </div>
                      </div>
                    )}

                    {predictionResult && (
                      <>
                        <div className="border hover:border-blue-500 rounded p-3 flex justify-between font-medium">
                          <span className="text-blue-700 dark:text-white">Coût estimé</span>
                          <span className="font-bold text-blue-700 dark:text-white">{predictionResult.prix_estime_fcfa} FCFA</span>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                          Fourchette: {predictionResult.prix_estime_range}
                        </div>

                      </>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                      {routes.length > 0 && (
                        <Button
                          onClick={() => setShowCustomDiv(true)}
                          className="bg-green-600 text-white w-full h-12 hover:bg-green-800"
                        >
                          {t('viewRoute')}
                        </Button>
                      )}

                      <Button
                        onClick={resetForm}
                        className="bg-blue-600 text-white w-full h-12 hover:bg-blue-800"
                      >
                        {t('recalculate')}
                      </Button>
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Pricing/>
      <Accsec />
      <Download/>
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0D1B2A] transition-colors duration-500 mt-3 mb-20 p-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">QR Code Farcal</h1>
        <QRCode value={url} size={256} />
        <p className="text-4xl mt-4 text-gray-900 dark:text-white">{t('qrcode')}</p>
      </div>
      <Footer/>
    </>
  );
}