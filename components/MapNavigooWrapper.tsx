'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient, GeolocationResult, Place, Route } from '@navigoo/map-components';
import MapNavigooView from './MapNavigooView'; // ✅ nouveau wrapper local

interface MapNavigooWrapperProps {
  startPlaceName: string;
  endPlaceName: string;
}

const MapNavigooWrapper: React.FC<MapNavigooWrapperProps> = ({ startPlaceName, endPlaceName }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [searchedPlace, setSearchedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationResult | null>(null);

  const apiClient = new ApiClient('https://gest-geospatiale.onrender.com');

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!startPlaceName || !endPlaceName) return;

      try {
        const startPlaces = await apiClient.searchPlaces(startPlaceName);
        const endPlaces = await apiClient.searchPlaces(endPlaceName);

        if (startPlaces.length === 0 || endPlaces.length === 0) {
          console.warn('Aucun lieu trouvé');
          return;
        }

        const start = startPlaces[0];
        const end = endPlaces[0];

        if (!start.coordinates || !end.coordinates) {
          console.warn("Coordonnées manquantes");
          return;
        }

        const points = [
          { lat: start.coordinates.lat, lng: start.coordinates.lng },
          { lat: end.coordinates.lat, lng: end.coordinates.lng },
        ];

        const routeResults = await apiClient.calculateRoute(
          points,
          'driving',
          start.name,
          end.name
        );

        setRoutes(routeResults);
        setSearchedPlace(end);
        setSelectedRouteIndex(0);
      } catch (err) {
        console.error('Erreur lors du calcul de l\'itinéraire :', err);
      }
    };

    fetchRoutes();
  }, [startPlaceName, endPlaceName]);

  return (
    <div className="w-full h-full">
      <MapNavigooView
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
