"use client";

import React, { useEffect, useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { 
  FaRegClock, FaCalculator, FaCar, FaBus, FaCarSide, 
  FaMoneyBillAlt, FaMapMarkerAlt, FaLocationArrow, 
  FaCloudRain, FaRoad, FaCalendarAlt, FaCarCrash, 
  FaSuitcase, FaHardHat, FaArrowRight, FaArrowLeft, 
  FaChartLine
} from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Route, Place } from '@/lib/types';
import { enregistrerCalcul } from '@/app/services/calculService';
import { event } from "@/lib/gtag";

// Importer ONNX Runtime
import * as ort from 'onnxruntime-web';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchedPlace, setSearchedPlace] = useState<any>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);

  const [placeNames, setPlaceNames] = useState<string[]>([]);
  
  const [showSuggestionsStart, setShowSuggestionsStart] = useState(false);
  const [showSuggestionsEnd, setShowSuggestionsEnd] = useState(false);
  const [filteredSuggestionsStart, setFilteredSuggestionsStart] = useState<string[]>([]);
  const [filteredSuggestionsEnd, setFilteredSuggestionsEnd] = useState<string[]>([]);
  
  // États pour la recherche de lieux avec coordonnées
  const [departSearchResults, setDepartSearchResults] = useState<Place[]>([]);
  const [destinationSearchResults, setDestinationSearchResults] = useState<Place[]>([]);
  const [selectedDepartPlace, setSelectedDepartPlace] = useState<Place | null>(null);
  const [selectedDestinationPlace, setSelectedDestinationPlace] = useState<Place | null>(null);
  
  const backendUrl = 'https://map-backend-reactif.onrender.com';
  
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
  const [currentRouteFinal, setCurrentRouteFinal] = useState<any | null>(null);


  interface PredictionResult {
    prix_estime_fcfa: number;
    prix_estime_range: string;
    message: string;
    lieux_comms: string;
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
        toast.success('Modèle de prédiction prêt!');
      } catch (err) {
        console.error('Erreur lors du chargement du modèle ONNX:', err);
        toast.error('Modèle non chargé, utilisation du calcul par API');
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
            console.log(`${uniqueNames.length} noms chargés depuis noms.txt`);
          } else {
            console.warn("Le fichier noms.txt est vide ou mal formaté");
            setPlaceNames([
              "mvan", "Melen 8", "Yaoundé", "Douala", "Garoua", "Maroua", "Bafoussam",
              "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba",
              "Limbe", "Kribi", "Mbalmayo", "Edea", "Foumban"
            ]);
          }
        } else {
          console.error("Impossible de charger noms.txt");
          setPlaceNames([
            "mvan", "Melen 8", "Yaoundé", "Douala", "Garoua", "Maroua", "Bafoussam",
            "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba",
            "Limbe", "Kribi", "Mbalmayo", "Edea", "Foumban"
          ]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des noms:", error);
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

const preprocessInputForONNX = (data: any): Record<string, ort.Tensor> => {
  const feeds: Record<string, ort.Tensor> = {};

  // Tensor string standardisé
  const makeString = (value: any) =>
    new ort.Tensor('string', [String(value)], [1, 1]);

  // Tensor float pour la distance
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

  // Distance = FLOAT32
  feeds['distance_km'] = makeFloat(data.distance_km);

  return feeds;
};

// Fonction de prédiction utilisant ONNX
const predictWithONNX = async (inputData: any): Promise<number> => {
  if (!onnxSession) {
    throw new Error('Modèle ONNX non chargé');
  }

  try {
    console.log("Noms des inputs ONNX:", onnxSession.inputNames);
    
    // Préparer les tenseurs d'entrée
    const feeds = preprocessInputForONNX(inputData);
    
    // Vérifier que tous les inputs requis sont présents
    const missingInputs = onnxSession.inputNames.filter(name => !feeds[name]);
    if (missingInputs.length > 0) {
      console.warn('Inputs manquants:', missingInputs);
      
      // Créer des tenseurs par défaut pour les inputs manquants
      missingInputs.forEach(inputName => {
        feeds[inputName] = new ort.Tensor('float32', new Float32Array([0]), [1, 1]);
      });
    }

    console.log('Feeds préparés:', Object.keys(feeds));
    
    const results = await onnxSession.run(feeds);
    
    // Récupérer la prédiction
    const outputName = onnxSession.outputNames[0];
    const output = results[outputName];
    
    // Extraire la valeur prédite
    const prediction = output.data[0];
    
    console.log('Prédiction ONNX:', prediction);
    
    return Number(prediction);
  } catch (error) {
    console.error('Erreur lors de la prédiction ONNX:', error);
    throw error;
  }
};

// Fonction de prédiction utilisant l'API externe
const predictWithAPI = async (predictionData: any): Promise<number> => {
  console.log('Données envoyées à l\'API de prédiction:', JSON.stringify(predictionData, null, 2));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

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
  console.log('Statut de réponse de l API de prédiction:', response.status);

  if (!response.ok) {
    let errorText = 'Erreur serveur';
    try {
      errorText = await response.text();
    } catch {
      errorText = `Erreur HTTP ${response.status}`;
    }
    console.error('Erreur API de prédiction:', errorText);
    throw new Error(`L API de prédiction n'est pas disponible (${response.status})`);
  }

  const result = await response.json();
  console.log('Résultat de prédiction:', result);
  
  if (result.prix_estime_fcfa !== undefined) {
    return result.prix_estime_fcfa;
  } else {
    throw new Error('Format de réponse invalide');
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

    console.log('Calcul de l itinéraire avec:', { start, end });

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

      console.log('Points utilisés:', { startPoint, endPoint });

      const requestBody = {
        points: [startPoint, endPoint],
        mode: 'driving',
        startPlaceName: start,
        endPlaceName: end,
      };

      console.log('Données envoyées à l API routes:', requestBody);

      const response = await fetch(`${backendUrl}/api/routes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Statut de réponse POST:', response.status);

      if (!response.ok) {
        let errorText = 'Erreur serveur';
        try {
          errorText = await response.text();
        } catch {
          errorText = `Statut HTTP: ${response.status}`;
        }
        console.error('Erreur POST détaillée:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse du serveur nest pas du JSON valide');
      }

      const data = await response.json();
      return handleRouteData(data);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du calcul de l itinéraire';
      setError(errorMessage);
      console.error('Route calculation error:', err);
      
      const defaultDistance = Math.random() * 20 + 5;
      const defaultDuration = defaultDistance * 3;
      
      setDistanceKm(defaultDistance);
      setDurationMin(defaultDuration);
      
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
    console.log('Données de route reçues:', data);
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      console.log("ROUTE STRUCTURE:", JSON.stringify(route, null, 2));
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
      
      setDistanceKm(defaultDistance);
      setDurationMin(defaultDuration);
      
      //toast.error('Utilisation de distance par défaut. Vous pouvez continuer.');
      
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

  console.warn("Aucune distance valide trouvée:", route);
  return 0;
};

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!start.trim()) {
      newErrors.start = 'Le champ Départ est requis.';
    }

    if (!end.trim()) {
      newErrors.end = 'Le champ Destination est requis.';
    }

    if (!hour) {
      newErrors.hour = "L'heure doit être sélectionnée.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;


    try {
      setIsLoading(true);
      const route = await calculateRoute();
      if (route) {
        setStep(2);
        setShowCards(false);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }

    // if (!estConnecte) {
    //   const nouveauCompteur = compteur + 1;
    //   localStorage.setItem("compteurUtilisation", nouveauCompteur.toString());
    //   setCompteur(nouveauCompteur);

    //   if (nouveauCompteur >= 3) {
    //     setBloque(true);
    //     setAfficherMessage(true);
    //   }
    // }
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

console.log("ROUTE SELECTED:", currentRoute);

const distanceToUse = extractDistanceKm(currentRoute);

console.log("DISTANCE USED (KM):", distanceToUse);
    
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

      console.log('Données pour la prédiction:', JSON.stringify(predictionData, null, 2));

      let prixEstime: number;
      let predictionSource = '';
      let apiResult: any = null;

      // Essayer d'abord avec ONNX
      if (onnxSession && !modelLoading) {
        try {
          prixEstime = await predictWithONNX(predictionData);
          predictionSource = 'ONNX';
          console.log('Prédiction ONNX réussie:', prixEstime);
        } catch (onnxError) {
          console.warn('Erreur ONNX, utilisation de lAPI:', onnxError);
          
          // Fallback à l'API
          try {
            prixEstime = await predictWithAPI(predictionData);
            predictionSource = 'API (fallback)';
            console.log('Prédiction API réussie:', prixEstime);
          } catch (apiError) {
            console.warn('Erreur API, utilisation du calcul local:', apiError);
            prixEstime = calculateLocalEstimation(predictionData);
            predictionSource = 'local (fallback)';
          }
        }
      } else {
        // Si ONNX n'est pas chargé, utiliser l'API directement
        try {
          prixEstime = await predictWithAPI(predictionData);
          predictionSource = 'API (modèle non chargé)';
          console.log('Prédiction API réussie:', prixEstime);
        } catch (apiError) {
          console.warn('Erreur API, utilisation du calcul local:', apiError);
          prixEstime = calculateLocalEstimation(predictionData);
          predictionSource = 'local (modèle non chargé)';
        }
      }

      // Calcul de la fourchette de prix
      const prixArrondi = Math.round(prixEstime);
      const prixMin = Math.round(prixArrondi * 0.85);
      const prixMax = Math.round(prixArrondi * 1.15);
      
      const result = {
        prix_estime_fcfa: prixArrondi,
        prix_estime_range: `${prixMin} - ${prixMax} FCFA`,
        message: `Prédiction ${predictionSource}`,
        lieux_comms: `Trajet de ${start} à ${end}`
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
          tarifOfficiel: 0,
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
        lieux_comms: `Trajet de ${start} à ${end}`
      };
      
      setPredictionResult(simulatedResult);
      setError(`⚠️ Calcul local utilisé (erreur ${errorType})`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de calcul local de secours (uniquement si ONNX et API échouent)
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
    setDistanceKm(null);
    setDurationMin(null);
    setShowCards(true);
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
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: step === stepNum ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step === stepNum 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              {stepNum}
              {step === stepNum && (
                <motion.div 
                  layoutId="stepIndicator"
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
            {stepNum < 3 && (
              <div className={`w-8 h-1 transition-all duration-500 ${
                step > stepNum 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
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
    <section className='w-full h-[900px] p-4 justify-center items-center flex mb-4 mt-0'>
      <div className='lg:w-4xl sm:w-4xl md:w-4xl w-[320px] h-full relative mt-6 lg:ml-6 sm:ml-6 md:ml-6 ml-1 rounded-3xl justify-start pt-10 items-center flex flex-col gap-4 shadow-lg bg-white dark:bg-[#0D1B2A] overflow-hidden transition-all duration-700 ease-in-out border-gray-200'>
        <h3 className='dark:text-white text-2xl sm:text-4xl md:text-2xl lg:text-4xl font-bold text-black'>{t('fareCalculator')}</h3>

        {/* Bouton vers la page de contribution */}
        <button
          onClick={() => router.push('/contribution')}
          className="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-800 dark:hover:to-blue-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-slow border border-blue-400/30"
          title="Accéder au dashboard de contribution"
        >
          <FaChartLine className="text-base animate-bounce-slow" />
          <span className="hidden mb-0 mt-0 sm:inline text-sm font-bold">
            Contribuer
          </span>
        </button>
        
        {renderStepIndicator()}
        
        {modelLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"
            />
            Chargement du modèle de prédiction...
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <form
              onSubmit={handleStep1Submit}
              className="space-y-5 max-w-md w-full mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow"
            >
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
                  className={`bg-white/70 dark:bg-gray-800/70 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 group ${
                    errors.start 
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-300/50 hover:border-blue-500/50 focus:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500/50'
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
                  className={`bg-white/70 dark:bg-gray-800/70 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 group ${
                    errors.end 
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-300/50 hover:border-blue-500/50 focus:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500/50'
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
                  className={`bg-white/70 dark:bg-gray-800/70 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 group ${
                    errors.hour 
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-300/50 hover:border-blue-500/50 focus:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500/50'
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
                className="relative text-white w-full h-12 shadow-xl transform transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-700 hover:via-blue-600 hover:to-emerald-600 dark:from-blue-700 dark:via-blue-600 dark:to-emerald-600 dark:hover:from-blue-800 dark:hover:via-blue-700 dark:hover:to-emerald-700 overflow-hidden group"
              >
                {/* Effet de brillance subtile */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                
                {/* Effet de pulsation douce pour l'icône */}
                <motion.span 
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute right-4"
                >
                  <FaArrowRight className="text-white/80" />
                </motion.span>
                
                <span className="relative z-10 font-medium text-sm">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span>
                      {t('calculating')}
                    </span>
                  ) : 'Suivant'}
                </span>
              </Button>
            </form>
          ) : step === 2 ? (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep2Submit}
              className="space-y-5 max-w-md w-full mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow"
            >
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                <FaCalendarAlt />
                Conditions de trajet
              </h4>

              {routes.length > 0 && routes[selectedRouteIndex] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4 border border-blue-100 dark:border-blue-800/30"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <MdOutlineDirectionsWalk />
                        Distance
                      </div>
                      <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <FaRegClock />
                        Durée
                      </div>
                      <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Jour de la semaine */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-blue-600 text-lg" />
                </div>
                <select
                  value={jourSemaine}
                  onChange={(e) => setJourSemaine(e.target.value)}
                  className={`bg-white/70 dark:bg-gray-800/70 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 group ${
                    errors.jourSemaine 
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-300/50 hover:border-blue-500/50 focus:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500/50'
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

              {/* Jour férié */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaCalendarAlt className="text-blue-600" />
                  Jour férié ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="0"
                      checked={jourFerie === '0'}
                      onChange={(e) => setJourFerie(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="1"
                      checked={jourFerie === '1'}
                      onChange={(e) => setJourFerie(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                </div>
              </div>

              {/* Pluie */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaCloudRain className="text-blue-600" />
                  Pluie ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="0"
                      checked={pluie === '0'}
                      onChange={(e) => setPluie(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="1"
                      checked={pluie === '1'}
                      onChange={(e) => setPluie(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                </div>
              </div>

              {/* État de la route */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRoad className="text-blue-600 text-lg" />
                </div>
                <select
                  value={etatRoute}
                  onChange={(e) => setEtatRoute(e.target.value)}
                  className={`bg-white/70 dark:bg-gray-800/70 dark:text-white text-[16px] w-full h-12 pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 group ${
                    errors.etatRoute 
                      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-300/50 hover:border-blue-500/50 focus:border-blue-500 dark:border-gray-700/50 dark:hover:border-blue-500/50'
                  }`}
                >
                  <option value="">État de la route</option>
                  <option value="bonne">Bonne</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="mauvaise">Mauvaise</option>
                </select>
                {errors.etatRoute && <p className="text-red-600 text-sm mt-1">{errors.etatRoute}</p>}
              </div>

              {/* Accident */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaCarCrash className="text-blue-600" />
                  Accident sur la route ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="0"
                      checked={accident === '0'}
                      onChange={(e) => setAccident(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="1"
                      checked={accident === '1'}
                      onChange={(e) => setAccident(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="relative text-white w-1/2 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 dark:from-violet-700 dark:to-violet-600 dark:hover:from-violet-800 dark:hover:to-violet-700 overflow-hidden group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <FaArrowLeft />
                  <span className="relative z-10">Retour</span>
                </Button>
                <Button
                  type="submit"
                  className="relative text-white w-1/2 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-700 dark:to-emerald-600 dark:hover:from-blue-800 dark:hover:to-emerald-700 overflow-hidden group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">Suivant</span>
                  <FaArrowRight />
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep3Submit}
              className="space-y-5 max-w-md w-full mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow"
            >
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                <FaSuitcase />
                Conditions supplémentaires
              </h4>

              {/* Bagages */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaSuitcase className="text-blue-600" />
                  Bagages ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="non"
                      checked={bagages === 'non'}
                      onChange={(e) => setBagages(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="oui"
                      checked={bagages === 'oui'}
                      onChange={(e) => setBagages(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                </div>
              </div>

              {/* Routes larges */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaRoad className="text-blue-600" />
                  Routes larges ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="oui"
                      checked={routesLarges === 'oui'}
                      onChange={(e) => setRoutesLarges(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="non"
                      checked={routesLarges === 'non'}
                      onChange={(e) => setRoutesLarges(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                </div>
              </div>

              {/* Routes en travaux */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FaHardHat className="text-blue-600" />
                  Routes en travaux ?
                </label>
                <div className="flex gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="non"
                      checked={routesTravaux === 'non'}
                      onChange={(e) => setRoutesTravaux(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Non</span>
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value="oui"
                      checked={routesTravaux === 'oui'}
                      onChange={(e) => setRoutesTravaux(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">Oui</span>
                  </motion.label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="relative text-white w-1/2 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 dark:from-violet-700 dark:to-violet-600 dark:hover:from-violet-800 dark:hover:to-violet-700 overflow-hidden group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <FaArrowLeft />
                  <span className="relative z-10">Retour</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative text-white w-1/2 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 dark:from-blue-700 dark:to-emerald-600 dark:hover:from-blue-800 dark:hover:to-emerald-700 overflow-hidden group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <FaCalculator />
                  <span className="relative z-10">
                    {isLoading ? 'Calcul...' : 'Calculer'}
                  </span>
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {showCards && step === 1 && (
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

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mt-2 text-sm text-center max-w-md"
          >
            {error}
          </motion.p>
        )}
        
        {predictionResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-md mx-auto mt-6"
          >
            <div className="relative p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-xl space-y-5 overflow-hidden">
              {/* Effet de fond */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-500 rounded-full opacity-10 blur-3xl" />
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FaMoneyBillAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 dark:text-white">
                  Résultat de la prédiction
                </h3>
              </div>

              <div className="text-center space-y-4 relative z-10">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {predictionResult.prix_estime_fcfa} FCFA
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Fourchette estimée: <span className="font-semibold">{predictionResult.prix_estime_range}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 italic pt-2 border-t border-gray-200 dark:border-gray-700">
                  {predictionResult.lieux_comms}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {routes.length > 0 && (
                  <Button
                    onClick={() => setShowCustomDiv(true)}
                    className="relative text-white h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 overflow-hidden group lg:hidden"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10">Voir l'itinéraire</span>
                  </Button>
                )}

                <Button
                  onClick={resetForm}
                  className="relative h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 dark:from-emerald-700 dark:to-emerald-600 dark:hover:from-emerald-800 dark:hover:to-emerald-700 overflow-hidden group"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-white">Nouveau calcul</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Carte pour petits écrans - masquée sur grands écrans */}
        {routes.length > 0 && routes[selectedRouteIndex] && showCustomDiv && (
          <div className="w-full max-w-md mx-auto mt-4 lg:hidden">
            <div className="relative p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <div className="rounded-xl w-full h-[300px] relative z-10">
                <MapNavigoo
                  userLocation={userLocation}
                  searchedPlace={searchedPlace}
                  routes={routes}
                  selectedRouteIndex={selectedRouteIndex}
                  setSelectedRouteIndex={setSelectedRouteIndex}
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-300">Distance</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-300">Durée</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {(routes[selectedRouteIndex].duration / 60).toFixed(0)} min
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowCustomDiv(false)}
                className="relative w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 text-white">Retour aux résultats</span>
              </Button>
            </div>
          </div>
        )}

      </div>
      
      {/* Carte pour grands écrans */}
      <div className="hidden lg:block mr-5 mt-6 rounded-2xl ml-4 relative w-full h-full z-10">
        <div className="relative w-full h-full bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-lg px-4 flex flex-col items-center justify-center">
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