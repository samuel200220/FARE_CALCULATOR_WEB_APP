"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  FaRegClock, FaCalculator, FaCar, FaBus, FaCarSide,
  FaMoneyBillAlt, FaMapMarkerAlt, FaLocationArrow,
  FaCloudRain, FaRoad, FaCalendarAlt, FaCarCrash,
  FaSuitcase, FaHardHat, FaArrowRight, FaArrowLeft,
  FaChartLine, FaArrowsAlt, FaInfoCircle, FaChevronDown,
  FaSun, FaCloudSun, FaCloud, FaMoon, FaCloudMoon, FaExclamationTriangle
} from 'react-icons/fa';
import { MdOutlineDirectionsWalk } from 'react-icons/md';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const dayPeriodsMapping = {
  morning: "08:00",
  midday: "12:00",
  afternoon: "16:00",
  evening: "20:00",
  night: "02:00"
};

const getPeriodIcon = (period: string) => {
  switch (period) {
    case 'morning': return <FaCloudSun className="text-orange-400" />;
    case 'midday': return <FaSun className="text-yellow-400" />;
    case 'afternoon': return <FaCloud className="text-blue-200" />;
    case 'evening': return <FaCloudMoon className="text-purple-400" />;
    case 'night': return <FaMoon className="text-gray-400" />;
    default: return null;
  }
};

const MapNavigoo = dynamic(() => import('../../components/carte').then((mod) => mod.default), {
  ssr: false,
});

// Composant Draggable personnalisé
interface DraggableProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  bounds?: 'parent' | string;
  handle?: string;
  onDrag?: (position: { x: number; y: number }) => void;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  defaultPosition = { x: 0, y: 0 },
  bounds = 'parent',
  handle = '.drag-handle',
  onDrag
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const handleElement = dragRef.current?.querySelector(handle);

    if (handle && handleElement && !handleElement.contains(target) && !target.matches(handle)) {
      return;
    }

    setIsDragging(true);
    const rect = dragRef.current!.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const parent = dragRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();

    let x = e.clientX - parentRect.left - offsetRef.current.x;
    let y = e.clientY - parentRect.top - offsetRef.current.y;

    // Limiter aux limites du parent
    if (bounds === 'parent') {
      x = Math.max(0, Math.min(x, parentRect.width - dragRect.width));
      y = Math.max(0, Math.min(y, parentRect.height - dragRect.height));
    }

    setPosition({ x, y });
    onDrag?.({ x, y });
  }, [isDragging, bounds, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={dragRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: 50
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

const Section1 = ({ }) => {
  const router = useRouter();
  const steps = useTranslations('steps');
  const floating = useTranslations('floatingFrame');
  const result = useTranslations('resultCard');
  const mapT = useTranslations('map');
  const loadingT = useTranslations('loading');
  const suggestionsT = useTranslations('suggestions');
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
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const [isLoading, setIsLoading] = useState(false);
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

  const [onnxSession, setOnnxSession] = useState<ort.InferenceSession | null>(null);
  const [modelLoading, setModelLoading] = useState(false);

  // États pour l'affichage responsive
  const [showMap, setShowMap] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  // Modèle ONNX
  const [currentRouteFinal, setCurrentRouteFinal] = useState<any | null>(null);

  // État pour le cadre flottant (uniquement desktop)
  const [floatingFrame, setFloatingFrame] = useState({
    visible: false,
    isMinimized: false,
    depart: '',
    arrivee: '',
    prixEstime: 0,
    prixRange: '',
    distance: 0,
    duree: 0,
    isCalculating: false
  });

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
        // const response = await fetch('/noms.txt');
        const response = await fetch('/lieux.txt');
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

  // Effet pour mettre à jour les lieux dans le cadre flottant
  useEffect(() => {
    if (floatingFrame.visible) {
      setFloatingFrame(prev => ({
        ...prev,
        depart: start,
        arrivee: end
      }));
    }
  }, [start, end, floatingFrame.visible]);

  // Effet pour le calcul en temps réel du prix (uniquement desktop)
  useEffect(() => {
    const updateLivePrice = async () => {
      if (!floatingFrame.visible || floatingFrame.distance <= 0 || !hour) return;

      setFloatingFrame(prev => ({ ...prev, isCalculating: true }));

      try {
        const predictionData = {
          accident: accident,
          bagages: bagages,
          depart_osm: start.trim(),
          destination_osm: end.trim(),
          distance_km: parseFloat(floatingFrame.distance.toFixed(2)),
          etat_route: etatRoute,
          heure: hour.split(':')[0],
          jour_ferie: jourFerie,
          jour_semaine: jourSemaine,
          pluie: pluie,
          routes_larges: routesLarges === 'oui' ? 'oui' : 'non',
          routes_travaux: routesTravaux
        };

        let prixEstime: number;

        if (onnxSession && !modelLoading) {
          try {
            prixEstime = await predictWithONNX(predictionData);
          } catch {
            prixEstime = calculateLocalEstimation(predictionData);
          }
        } else {
          prixEstime = calculateLocalEstimation(predictionData);
        }

        const prixArrondi = Math.round(prixEstime / 50) * 50;
        const prixMin = Math.round((prixArrondi * 0.85) / 50) * 50;
        const prixMax = Math.round((prixArrondi * 1.15) / 50) * 50;

        setFloatingFrame(prev => ({
          ...prev,
          prixEstime: prixArrondi,
          prixRange: `${prixMin} - ${prixMax} FCFA`,
          isCalculating: false
        }));

      } catch (error) {
        console.error('Erreur de calcul en temps réel:', error);
        setFloatingFrame(prev => ({ ...prev, isCalculating: false }));
      }
    };

    const debounceTimer = setTimeout(updateLivePrice, 500);
    return () => clearTimeout(debounceTimer);
  }, [
    floatingFrame.visible,
    floatingFrame.distance,
    hour,
    jourSemaine,
    jourFerie,
    pluie,
    etatRoute,
    accident,
    bagages,
    routesLarges,
    routesTravaux,
    start,
    end
  ]);

  // Cacher le cadre flottant quand on retourne à l'étape 1
  useEffect(() => {
    if (step === 1) {
      setFloatingFrame(prev => ({ ...prev, visible: false }));
    }
  }, [step]);

  // Afficher automatiquement la carte en step 2 et 3 sur desktop
  useEffect(() => {
    if ((step === 2 || step === 3) && window.innerWidth >= 1024) {
      setShowMap(true);
    }
  }, [step]);

  const t = useTranslations('landing');
  const a = useTranslations('agency');
  const f = useTranslations('form');

  // Effet pour synchroniser les données (distance, durée) quand l'index de la route sélectionnée change
  useEffect(() => {
    if (routes && routes.length > 0 && routes[selectedRouteIndex]) {
      const route = routes[selectedRouteIndex];
      const dist = extractDistanceKm(route);
      const dur = (route.duration || 0) / 60;

      setDistanceKm(dist);
      setDurationMin(dur);

      if (floatingFrame.visible) {
        setFloatingFrame(prev => ({
          ...prev,
          distance: dist,
          duree: dur,
          isCalculating: true
        }));
      }
    }
  }, [selectedRouteIndex, routes, floatingFrame.visible]);

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

  // Fonction pour rechercher des lieux via Mapbox (Fallback)
  const searchMapboxPlace = async (query: string): Promise<Place[]> => {
    if (!MAPBOX_TOKEN) return [];

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=CM`
      );

      if (!response.ok) return [];

      const data = await response.json();
      if (data.features && Array.isArray(data.features)) {
        return data.features.map((feature: any, index: number) => ({
          id: 999000 + index, // IDs fictifs pour Mapbox
          name: feature.place_name,
          coordinates: {
            lat: feature.center[1],
            lng: feature.center[0]
          }
        }));
      }
      return [];
    } catch (err) {
      console.error('Erreur Mapbox Geocoding:', err);
      return [];
    }
  };

  // Fonction de prédiction utilisant l'API externe
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

      let results: Place[] = [];
      if (data.success && Array.isArray(data.data)) {
        results = data.data.filter((place: Place) =>
          place && place.coordinates && place.coordinates.lat && place.coordinates.lng
        );
      }

      // FALLBACK: Si pas de résultats locaux, interroger Mapbox
      if (results.length === 0) {
        console.log(`Aucun résultat local pour "${query}", essai Mapbox...`);
        results = await searchMapboxPlace(query);
      }

      if (type === 'depart') {
        setDepartSearchResults(results.slice(0, 5));
        // Mettre à jour searchedPlace pour afficher un marqueur immédiat si c'est le premier point
        if (results.length > 0) setSearchedPlace(results[0]);
      } else {
        setDestinationSearchResults(results.slice(0, 5));
        if (results.length > 0) setSearchedPlace(results[0]);
      }
    } catch (err) {
      console.log(`Erreur recherche, tentative fallback Mapbox pour "${query}"`);
      const results = await searchMapboxPlace(query);
      if (type === 'depart') {
        setDepartSearchResults(results);
      } else {
        setDestinationSearchResults(results);
      }
    }
  };

  const handlePlaceSelect = (place: Place, type: 'depart' | 'destination') => {
    if (type === 'depart') {
      setStart(place.name);
      setSelectedDepartPlace(place);
      setSearchedPlace(place); // Marqueur sur la carte
      setDepartSearchResults([]);
      setShowSuggestionsStart(false);
    } else {
      setEnd(place.name);
      setSelectedDestinationPlace(place);
      setSearchedPlace(place); // Marqueur sur la carte
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
              // Tentative Mapbox si pas de coordonnées
              const mapboxResults = await searchMapboxPlace(start);
              startPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 3.8480, lng: 11.5021 };
            }
          } else {
            // Tentative Mapbox si pas de résultats locaux
            const mapboxResults = await searchMapboxPlace(start);
            startPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 3.8480, lng: 11.5021 };
          }
        } else {
          // Tentative Mapbox en cas d'erreur API
          const mapboxResults = await searchMapboxPlace(start);
          startPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 3.8480, lng: 11.5021 };
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
              // Tentative Mapbox
              const mapboxResults = await searchMapboxPlace(end);
              endPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 4.0511, lng: 9.7679 };
            }
          } else {
            // Tentative Mapbox
            const mapboxResults = await searchMapboxPlace(end);
            endPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 4.0511, lng: 9.7679 };
          }
        } else {
          // Tentative Mapbox
          const mapboxResults = await searchMapboxPlace(end);
          endPoint = mapboxResults.length > 0 ? mapboxResults[0].coordinates : { lat: 4.0511, lng: 9.7679 };
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

      // Mettre à jour le cadre flottant (desktop)
      const distanceKm = (route.distance || 0) / 1000;
      const durationMin = (route.duration || 0) / 60;

      setFloatingFrame({
        visible: true,
        isMinimized: false,
        depart: start,
        arrivee: end,
        prixEstime: 0, // Sera calculé par l'effet en temps réel
        prixRange: '',
        distance: distanceKm,
        duree: durationMin,
        isCalculating: true
      });

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

    // Vérifier si les lieux sont identiques (case-insensitive, trim)
    if (start.trim().toLowerCase() === end.trim().toLowerCase()) {
      toast.error("Le lieu de départ et la destination doivent être différents", {
        position: 'top-right',
      });
      return;
    }

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
        // Afficher la carte automatiquement sur desktop
        if (window.innerWidth >= 1024) {
          setShowMap(true);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
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
      const prixArrondi = Math.round(prixEstime / 50) * 50;
      const prixMin = Math.round((prixArrondi * 0.85) / 50) * 50;
      const prixMax = Math.round((prixArrondi * 1.15) / 50) * 50;

      const result = {
        prix_estime_fcfa: prixArrondi,
        prix_estime_range: `${prixMin} - ${prixMax} FCFA`,
        message: `Prédiction ${predictionSource}`,
        lieux_comms: `Trajet de ${start} à ${end}`
      };

      setPredictionResult(result);
      //const utilisateurId = localStorage.getItem("utilisateurId") || 'anonymous';
      try {
        await enregistrerCalcul({
          lieuDepart: start,
          lieuArrivee: end,
          heurePriseEnCharge: hour,
          distanceKm: distanceToUse,
          coutEstime: prixArrondi,
          tarifOfficiel: 0,
          jourSemaine,
          jourFerie,
          pluie,
          etatRoute,
          accident,
          bagages,
          routesLarges,
          routesTravaux
        });
        console.log('Calcul enregistré avec succès');
        toast.success('Calcul enregistré dans votre historique');
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du calcul:', error);
        toast.error('Erreur lors de l\'enregistrement du calcul');
      }

      //       if (estConnecte) {

      // }

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

      const prixArrondi = Math.round(prixEstime / 50) * 50;
      const prixMin = Math.round((prixArrondi * 0.85) / 50) * 50;
      const prixMax = Math.round((prixArrondi * 1.15) / 50) * 50;

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

    const rawPrice = (tarifBase + (distance * tarifParKm)) *
      facteurHeure *
      facteurPluie *
      facteurRoute *
      facteurBagages;

    return Math.round(rawPrice / 50) * 50;
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
    setShowMap(false);
    // Réinitialiser le cadre flottant
    setFloatingFrame({
      visible: false,
      isMinimized: false,
      depart: '',
      arrivee: '',
      prixEstime: 0,
      prixRange: '',
      distance: 0,
      duree: 0,
      isCalculating: false
    });
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
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step === stepNum
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
              <div className={`w-8 h-1 transition-all duration-500 ${step > stepNum
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

  // Composant pour afficher les résultats de manière élégante
  const ResultCard = ({ predictionResult }: { predictionResult: PredictionResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* En-tête avec titre */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaMoneyBillAlt className="text-white text-xl" />
            <h3 className="text-xl font-bold text-white">{result('title')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-blue-200 text-sm" />
            <span className="text-blue-100 text-sm font-medium">{result('predictionAI')}</span>
          </div>
        </div>
      </div>

      {/* Corps de la carte */}
      <div className="p-6">
        {/* Prix principal */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
            {predictionResult.prix_estime_fcfa} FCFA
          </div>
          <div className="text-gray-600 dark:text-gray-300 mt-2">
            {result('estimatedRange')}: <span className="font-semibold">{predictionResult.prix_estime_range}</span>
          </div>
        </div>

        {/* Détails du trajet */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">{result('departure')}</div>
              <div className="font-medium dark:text-white">{start}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaLocationArrow className="text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">{result('arrival')}</div>
              <div className="font-medium dark:text-white">{end}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaRegClock className="text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">{result('time')}</div>
              <div className="font-medium dark:text-white">{hour}</div>
            </div>
          </div>
        </div>

        {/* Métriques distance/durée */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineDirectionsWalk className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-gray-600 dark:text-gray-300">{result('distance')}</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {routes[0]?.distance ? `${(routes[0].distance / 1000).toFixed(1)} km` : 'N/A'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FaRegClock className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-gray-600 dark:text-gray-300">{result('duration')}</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {routes[0]?.duration ? `${(routes[0].duration / 60).toFixed(0)} min` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{result('predictionDetails')}</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{result('source')}:</span>
              <span className="font-medium dark:text-white">{predictionResult.message}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{result('trip')}:</span>
              <span className="font-medium dark:text-white">{predictionResult.lieux_comms}</span>
            </div>
          </div>
        </div>

        {/* Bouton Nouveau calcul */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={() => setStep(3)}
            className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white"
          >
            <FaArrowLeft /> {steps('step3.back')}
          </Button>
          <Button
            onClick={resetForm}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg"
          >
            {result('newCalculation')}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="w-full min-h-[900px] flex justify-center items-start pt-10 px-4 bg-transparent mb-10">
      {/* Main Container */}
      <div className={`
        relative w-full max-w-7xl 
        bg-white/80 dark:bg-[#0D1B2A]/90 backdrop-blur-xl 
        rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5
        transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${step === 1 ? 'max-w-xl h-auto p-8 lg:p-12 mt-20' : 'h-full p-6'}
      `}>

        {/* Header inside Card */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            {t('fareCalculator')}
          </h3>

          {/* Bouton vers la page de contribution */}
          <button
            onClick={() => router.push('/contribution')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-800 dark:hover:to-blue-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-slow border border-blue-400/30"
            title="Accéder au dashboard de contribution"
          >
            <FaChartLine className="text-base animate-bounce-slow" />
            <span className="hidden sm:inline text-sm font-bold">
              {loadingT('contributeData')}
            </span>
          </button>
        </div>

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
            {loadingT('model')}
          </motion.div>
        )}

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            // ÉTAPE 1: RECHERCHE
            <motion.form
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleStep1Submit}
              className="space-y-6"
            >
              {/* Champ Départ */}
              <div className="relative group z-30">
                <div className="absolute left-4 top-3.5 text-blue-500">
                  <FaMapMarkerAlt />
                </div>
                <Input
                  value={start}
                  onChange={handleStartChange}
                  className={`pl-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 transition-all ${errors.start
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-transparent hover:border-blue-500/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                  placeholder={f("go")}
                  id="start"
                />
                {errors.start && <p className="text-red-600 text-sm mt-1 ml-1">{errors.start}</p>}

                {showSuggestionsStart && (
                  <ul className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    {getCombinedSuggestions('start').backend.length > 0 && (
                      <>
                        <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                          {suggestionsT('recommendedPlaces')}
                        </li>
                        {getCombinedSuggestions('start').backend.map((place: Place) => (
                          <li
                            key={place.id}
                            onClick={() => handlePlaceSelect(place, 'depart')}
                            className="dark:text-white px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer flex items-center gap-2"
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
                          {suggestionsT('localSuggestions')}
                        </li>
                        {getCombinedSuggestions('start').local.map((name: string, index: number) => (
                          <li
                            key={`local-${index}`}
                            onClick={() => { setStart(name); setShowSuggestionsStart(false); }}
                            className="dark:text-white px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                          >
                            {name}
                          </li>
                        ))}
                      </>
                    )}

                    {getCombinedSuggestions('start').backend.length === 0 && getCombinedSuggestions('start').local.length === 0 && (
                      <li className="dark:text-white px-4 py-2 text-gray-500">{suggestionsT('noSuggestions')}</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Champ Destination */}
              <div className="relative group z-20">
                <div className="absolute left-4 top-3.5 text-blue-500">
                  <FaLocationArrow />
                </div>
                <Input
                  value={end}
                  onChange={handleEndChange}
                  className={`pl-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-2 transition-all ${errors.end
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-transparent hover:border-blue-500/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                  placeholder={f("arrive")}
                  id="end"
                />
                {errors.end && <p className="text-red-600 text-sm mt-1 ml-1">{errors.end}</p>}

                {showSuggestionsEnd && (
                  <ul className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    {getCombinedSuggestions('end').backend.length > 0 && (
                      <>
                        <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                          {suggestionsT('recommendedPlaces')}
                        </li>
                        {getCombinedSuggestions('end').backend.map((place: Place) => (
                          <li
                            key={place.id}
                            onClick={() => handlePlaceSelect(place, 'destination')}
                            className="dark:text-white px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer flex items-center gap-2"
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
                          {suggestionsT('localSuggestions')}
                        </li>
                        {getCombinedSuggestions('end').local.map((name: string, index: number) => (
                          <li
                            key={`local-${index}`}
                            onClick={() => { setEnd(name); setShowSuggestionsEnd(false); }}
                            className="dark:text-white px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                          >
                            {name}
                          </li>
                        ))}
                      </>
                    )}

                    {getCombinedSuggestions('end').backend.length === 0 && getCombinedSuggestions('end').local.length === 0 && (
                      <li className="dark:text-white px-4 py-2 text-gray-500">{suggestionsT('noSuggestions')}</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Heure */}
              <div className="relative group z-10">
                <div className="absolute left-4 top-3.5 text-blue-500">
                  <FaRegClock />
                </div>
                <Select
                  value={hour}
                  onValueChange={(value) => setHour(value)}
                >
                  <SelectTrigger
                    className={`w-full pl-10 pr-10 h-12 rounded-[7px] bg-gray-200 dark:bg-gray-800 dark:text-white text-[16px] border ${errors.hour
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 hover:border-purple-800 focus:border-purple-800'
                      }`}
                  >
                    <SelectValue placeholder={f("time")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-[7px] shadow-xl p-1">
                    {Object.entries(dayPeriodsMapping).map(([period, averageHour]) => (
                      <SelectItem
                        key={period}
                        value={averageHour}
                        className="rounded-md px-4 py-3 cursor-pointer transition-colors focus:bg-purple-100 dark:focus:bg-purple-900 focus:text-purple-900 dark:focus:text-purple-100 text-[16px]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">
                            {getPeriodIcon(period)}
                          </div>
                          <span className="font-medium">{f(`dayPeriods.${period}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hour && <p className="text-red-600 text-sm mt-1 ml-1">{errors.hour}</p>}
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
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-lg font-medium shadow-xl shadow-blue-500/20 transform hover:-translate-y-1 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    {t('calculating')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {steps('step1.next')} <FaArrowRight />
                  </span>
                )}
              </Button>

              {/* Cartes de services (toujours visibles en step 1) */}
              {showCards && (
                <div className="w-full flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link href={'https://rideandgo.vercel.app/'} target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer w-48">
                      <FaCar className="text-orange-500 text-4xl mb-3" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_ride')}</p>
                    </div>
                  </Link>

                  <Link href={'https://lets-go-liart-phi.vercel.app/'} target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer w-48">
                      <FaBus className="text-orange-500 text-4xl mb-3" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('travel_agency')}</p>
                    </div>
                  </Link>

                  <Link href={'https://easy-rental-git-review-admin-reseaus-projects.vercel.app/'} target="_blank" rel="noopener noreferrer">
                    <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1B263B] dark:to-[#0D1B2A] rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer w-48">
                      <FaCarSide className="text-orange-500 text-4xl mb-3" />
                      <p className="text-center text-gray-800 dark:text-white text-sm font-medium">{a('need_rental')}</p>
                    </div>
                  </Link>
                </div>
              )}
            </motion.form>
          ) : step === 2 ? (
            // ÉTAPE 2: FORMULAIRE AVEC CARTE
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-6 h-full"
            >
              {/* PANEL GAUCHE: FORMULAIRE */}
              <div className={`w-full ${showMap ? 'lg:w-1/2' : 'lg:w-full'} space-y-5 lg:pr-2 lg:overflow-y-auto lg:max-h-[700px] custom-scrollbar`}>
                <motion.form
                  key="step2-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleStep2Submit}
                  className="space-y-5 bg-white/50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                    <FaCalendarAlt />
                    {steps('step2.title')}
                  </h4>

                  {/* Distance et durée */}
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
                            {result('distance')}
                          </div>
                          <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                            {(routes[selectedRouteIndex].distance / 1000).toFixed(2)} km
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <FaRegClock />
                            {result('duration')}
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
                      className={`w-full pl-10 h-12 rounded-xl bg-white dark:bg-gray-800 border-2 transition-all dark:text-white ${errors.jourSemaine
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                    >
                      <option value="">{steps('step2.dayOfWeek')}</option>
                      <option value="1">{steps('step2.days.monday')}</option>
                      <option value="2">{steps('step2.days.tuesday')}</option>
                      <option value="3">{steps('step2.days.wednesday')}</option>
                      <option value="4">{steps('step2.days.thursday')}</option>
                      <option value="5">{steps('step2.days.friday')}</option>
                      <option value="6">{steps('step2.days.saturday')}</option>
                      <option value="7">{steps('step2.days.sunday')}</option>
                    </select>
                    {errors.jourSemaine && <p className="text-red-600 text-sm mt-1 ml-1">{errors.jourSemaine}</p>}
                  </div>

                  {/* Toggles pour Étape 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <ToggleButton
                      label={steps('step2.publicHoliday')}
                      icon={<FaCalendarAlt />}
                      value={jourFerie}
                      setValue={setJourFerie}
                      activeValue="1"
                      inactiveValue="0"
                    />
                    <ToggleButton
                      label={steps('step2.rain')}
                      icon={<FaCloudRain />}
                      value={pluie}
                      setValue={setPluie}
                      activeValue="1"
                      inactiveValue="0"
                    />
                    <ToggleButton
                      label={steps('step2.accident')}
                      icon={<FaCarCrash />}
                      value={accident}
                      setValue={setAccident}
                      activeValue="1"
                      inactiveValue="0"
                    />
                  </div>

                  {/* État de la route */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRoad className="text-blue-600 text-lg" />
                    </div>
                    <select
                      value={etatRoute}
                      onChange={(e) => setEtatRoute(e.target.value)}
                      className={`w-full pl-10 h-12 rounded-xl bg-white dark:bg-gray-800 border-2 transition-all dark:text-white ${errors.etatRoute
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                    >
                      <option value="">{steps('step2.roadCondition')}</option>
                      <option value="bonne">{steps('step2.roadConditions.good')}</option>
                      <option value="moyenne">{steps('step2.roadConditions.average')}</option>
                      <option value="mauvaise">{steps('step2.roadConditions.bad')}</option>
                    </select>
                    {errors.etatRoute && <p className="text-red-600 text-sm mt-1 ml-1">{errors.etatRoute}</p>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white"
                    >
                      <FaArrowLeft /> {steps('step2.back')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white"
                    >
                      {steps('step2.next')} <FaArrowRight />
                    </Button>
                  </div>
                </motion.form>
              </div>

              {/* PANEL DROIT: CARTE */}
              {(showMap || window.innerWidth >= 1024) && (
                <div className={`w-full lg:w-1/2 relative min-h-[500px] flex flex-col gap-4`}>
                  {/* Bouton pour cacher la carte sur mobile */}
                  <div className="lg:hidden flex justify-end">
                    <Button
                      onClick={() => setShowMap(false)}
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕ {('mapT.hideMap')}
                    </Button>
                  </div>

                  {/* Conteneur de la carte */}
                  <div className="flex-1 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative z-0 min-h-[400px]">
                    <MapNavigoo
                      userLocation={userLocation}
                      searchedPlace={searchedPlace}
                      routes={routes}
                      selectedRouteIndex={selectedRouteIndex}
                      setSelectedRouteIndex={setSelectedRouteIndex}
                    />

                    {/* Cadre flottant déplaçable pour la carte (uniquement desktop) */}
                    {floatingFrame.visible && window.innerWidth >= 1024 && (
                      <Draggable
                        bounds="parent"
                        handle=".drag-handle"
                        defaultPosition={{ x: 20, y: 20 }}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            width: floatingFrame.isMinimized ? 'auto' : 320,
                            padding: floatingFrame.isMinimized ? 8 : 24
                          }}
                          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 cursor-move select-none overflow-hidden"
                        >
                          {floatingFrame.isMinimized ? (
                            <div className="drag-handle flex items-center gap-2 px-2 py-1">
                              <button
                                onClick={() => setFloatingFrame(prev => ({ ...prev, isMinimized: false }))}
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm"
                              >
                                <FaCalculator className="text-lg" />
                                <span>{floating('title')}</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              {/* En-tête avec zone de drag */}
                              <div className="drag-handle flex items-center justify-between mb-4 cursor-move">
                                <div className="flex items-center gap-2">
                                  <FaArrowsAlt className="text-gray-400 text-sm" />
                                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaCalculator className="text-blue-600" />
                                    {floating('title')}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => setFloatingFrame(prev => ({ ...prev, isMinimized: true }))}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                  title="Réduire"
                                >
                                  −
                                </button>
                              </div>

                              <div className="space-y-4">
                                {/* Lieux */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{floating('departure')}:</span>
                                    <span className="text-gray-900 dark:text-white truncate">{floatingFrame.depart}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <FaLocationArrow className="text-blue-500" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{floating('arrival')}:</span>
                                    <span className="text-gray-900 dark:text-white truncate">{floatingFrame.arrivee}</span>
                                  </div>
                                </div>

                                {/* Distance et durée */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
                                      <MdOutlineDirectionsWalk />
                                      {floating('distance')}
                                    </div>
                                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                      {floatingFrame.distance.toFixed(2)} km
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
                                      <FaRegClock />
                                      {floating('duration')}
                                    </div>
                                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                      {floatingFrame.duree.toFixed(0)} min
                                    </div>
                                  </div>
                                </div>

                                {/* Prix estimé */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                      {floating('estimatedPrice')}
                                    </div>
                                    {floatingFrame.isCalculating ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                          className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400">{floating('calculating')}</span>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                          {floatingFrame.prixEstime.toLocaleString()} FCFA
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                          {floatingFrame.prixRange}
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {floating('priceUpdateInfo')}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </Draggable>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            // ÉTAPE 3: RÉSULTATS AVEC CARTE
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-6 h-full"
            >
              {/* PANEL GAUCHE: RÉSULTATS OU FORMULAIRE */}
              <div className={`w-full ${showMap ? 'lg:w-1/2' : 'lg:w-full'} space-y-5 lg:pr-2 lg:overflow-y-auto lg:max-h-[700px] custom-scrollbar`}>
                {predictionResult ? (
                  // Affichage des résultats
                  <ResultCard predictionResult={predictionResult} />
                ) : (
                  // Formulaire step 3
                  <motion.form
                    key="step3-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleStep3Submit}
                    className="space-y-5 bg-white/50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <FaSuitcase />
                      {steps('step3.title')}
                    </h4>

                    {/* Toggles pour Étape 3 */}
                    <div className="grid grid-cols-2 gap-3">
                      <ToggleButton
                        label={steps('step3.luggage')}
                        icon={<FaSuitcase />}
                        value={bagages}
                        setValue={setBagages}
                        activeValue="oui"
                        inactiveValue="non"
                      />
                      <ToggleButton
                        label={steps('step3.wideRoads')}
                        icon={<FaRoad />}
                        value={routesLarges}
                        setValue={setRoutesLarges}
                        activeValue="oui"
                        inactiveValue="non"
                      />
                      <ToggleButton
                        label={steps('step3.roadWorks')}
                        icon={<FaHardHat />}
                        value={routesTravaux}
                        setValue={setRoutesTravaux}
                        activeValue="oui"
                        inactiveValue="non"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white"
                      >
                        <FaArrowLeft /> {steps('step3.back')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white"
                      >
                        <FaCalculator /> {isLoading ? loadingT('model') : steps('step3.calculate')}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </div>

              {/* PANEL DROIT: CARTE */}
              {(showMap || window.innerWidth >= 1024) && (
                <div className={`w-full lg:w-1/2 relative min-h-[500px] flex flex-col gap-4`}>
                  {/* Bouton pour cacher la carte sur mobile */}
                  <div className="lg:hidden flex justify-end">
                    <Button
                      onClick={() => setShowMap(false)}
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕ {('mapT.hideMap')}
                    </Button>
                  </div>

                  {/* Conteneur de la carte */}
                  <div className="flex-1 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative z-0 min-h-[400px]">
                    <MapNavigoo
                      userLocation={userLocation}
                      searchedPlace={searchedPlace}
                      routes={routes}
                      selectedRouteIndex={selectedRouteIndex}
                      setSelectedRouteIndex={setSelectedRouteIndex}
                    />

                    {/* Cadre flottant déplaçable pour la carte (uniquement desktop) */}
                    {floatingFrame.visible && window.innerWidth >= 1024 && (
                      <Draggable
                        bounds="parent"
                        handle=".drag-handle"
                        defaultPosition={{ x: 20, y: 20 }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80 cursor-move select-none"
                        >
                          {/* En-tête avec zone de drag */}
                          <div className="drag-handle flex items-center justify-between mb-4 cursor-move">
                            <div className="flex items-center gap-2">
                              <FaArrowsAlt className="text-gray-400 text-sm" />
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FaCalculator className="text-blue-600" />
                                {floating('title')}
                              </h3>
                            </div>
                            <button
                              onClick={() => setFloatingFrame(prev => ({ ...prev, visible: false }))}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-2"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-4">
                            {/* Lieux */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">{floating('departure')}:</span>
                                <span className="text-gray-900 dark:text-white truncate">{floatingFrame.depart}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FaLocationArrow className="text-blue-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">{floating('arrival')}:</span>
                                <span className="text-gray-900 dark:text-white truncate">{floatingFrame.arrivee}</span>
                              </div>
                            </div>

                            {/* Distance et durée */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  <MdOutlineDirectionsWalk />
                                  {floating('distance')}
                                </div>
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                  {floatingFrame.distance.toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  <FaRegClock />
                                  {floating('duration')}
                                </div>
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                  {floatingFrame.duree.toFixed(0)} min
                                </div>
                              </div>
                            </div>

                            {/* Prix estimé */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="text-center">
                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  {floating('estimatedPrice')}
                                </div>
                                {floatingFrame.isCalculating ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400">{floating('calculating')}</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                      {floatingFrame.prixEstime.toLocaleString()} FCFA
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {floatingFrame.prixRange}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Draggable>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mt-2 text-sm text-center max-w-md"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Bouton toggle pour afficher/cacher la carte sur mobile */}
      {step > 1 && !showMap && window.innerWidth < 1024 && (
        <Button
          onClick={() => setShowMap(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl lg:hidden"
        >
          {mapT('map.showMap')}
        </Button>
      )}
    </section>
  )
}

// Composant ToggleButton réutilisable
const ToggleButton = ({
  label,
  icon,
  value,
  setValue,
  activeValue = '1',
  inactiveValue = '0'
}: any) => {
  const isActive = value === activeValue;

  return (
    <div
      onClick={() => setValue(isActive ? inactiveValue : activeValue)}
      className={`
        cursor-pointer p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 border
        ${isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 transform scale-[1.02]'
          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-[1.02]'}
      `}
    >
      <div className="text-lg">{icon}</div>
      <span className="text-xs font-medium text-center">{label}</span>
    </div>
  )
}

export default Section1