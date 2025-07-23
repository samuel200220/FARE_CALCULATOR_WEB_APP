'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// ⚠️ Import dynamique ici du composant MapView depuis la lib Navigoo
const MapView = dynamic(() => import('@navigoo/map-components').then(mod => mod.MapView), { ssr: false });

const MapNavigooWrapper = ({ startPlaceName, endPlaceName }: { startPlaceName: string; endPlaceName: string }) => {
  const [apiClient, setApiClient] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [searchedPlace, setSearchedPlace] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Lazy load ici uniquement côté client
      const { ApiClient } = require('@navigoo/map-components');
      const client = new ApiClient('https://map-backend-reactif.onrender.com');
      setApiClient(client);
    }
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!apiClient || !startPlaceName || !endPlaceName) return;

      try {
        const startPlaces = await apiClient.searchPlaces(startPlaceName);
        const endPlaces = await apiClient.searchPlaces(endPlaceName);

        if (startPlaces.length === 0 || endPlaces.length === 0) {
          toast.error('Aucun lieu trouvé');
          return;
        }

        const start = startPlaces[0];
        const end = endPlaces[0];

        const points = [
          { lat: start.coordinates.lat, lng: start.coordinates.lng },
          { lat: end.coordinates.lat, lng: end.coordinates.lng },
        ];

        const routes = await apiClient.calculateRoute(points, 'driving', start.name, end.name);
        setRoutes(routes);
        setSearchedPlace(end);
      } catch (error) {
        console.error("Erreur de calcul de l'itinéraire :", error);
      }
    };

    fetchRoutes();
  }, [apiClient, startPlaceName, endPlaceName]);

  if (!apiClient) return null;

  return (
    <div className="relative w-full h-full bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-lg flex flex-col items-center justify-center">
      <MapView
      apiClient={apiClient}
      userLocation={userLocation}
      searchedPlace={searchedPlace}
      routes={routes}
      selectedRouteIndex={selectedRouteIndex}
      setSelectedRouteIndex={setSelectedRouteIndex}
    />
    </div>
  );
};

export default MapNavigooWrapper;
