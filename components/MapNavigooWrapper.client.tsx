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
  if (!apiClient && typeof window !== 'undefined') {
    import('@navigoo/map-components').then(({ ApiClient }) => {
      setApiClient(new ApiClient('https://map-backend-reactif.onrender.com'));
    });
  }
}, [apiClient]);

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
        //toast.error("Erreur lors du trace de la route (Verifiez votre connexion)");
        console.error(error);
      }
    };

    fetchRoutes();
  }, [apiClient, startPlaceName, endPlaceName]);

  if (!apiClient) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Chargement de la carte...</p>
    </div>
  );
}

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
