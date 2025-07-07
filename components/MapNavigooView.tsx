'use client';

import React from 'react';
import { ApiClient, GeolocationResult, Place, Route } from '@navigoo/map-components';
import dynamic from 'next/dynamic';

const MapView = dynamic(() =>
  import('@navigoo/map-components').then((mod) => mod.MapView),
  { ssr: false }
);

interface MapNavigooViewProps {
  apiClient: ApiClient;
  userLocation: GeolocationResult | null;
  searchedPlace: Place | null;
  routes: Route[];
  selectedRouteIndex: number;
  setSelectedRouteIndex: (index: number) => void;
}

const MapNavigooView: React.FC<MapNavigooViewProps> = ({
  apiClient,
  userLocation,
  searchedPlace,
  routes,
  selectedRouteIndex,
  setSelectedRouteIndex,
}) => {
  return (
    <MapView
      apiClient={apiClient}
      userLocation={userLocation}
      searchedPlace={searchedPlace}
      routes={routes}
      selectedRouteIndex={selectedRouteIndex}
      setSelectedRouteIndex={setSelectedRouteIndex}
    />
  );
};

export default MapNavigooView;
