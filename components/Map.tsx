'use client';
import React from 'react'
// components/GoogleMap.js

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ 
  center = { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
  zoom = 10,
  height = '400px',
  width = '100%'
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || (() => { throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined'); })(),
        version: 'weekly',
        libraries: ['places']
      });

      const { Map } = await loader.importLibrary('maps');

      const mapOptions = {
        center: center,
        zoom: zoom,
        mapId: 'MY_NEXTJS_MAPID', // Optionnel
      };

      // Créer la carte
      if (mapRef.current) {
        const googleMap = new Map(mapRef.current, mapOptions);
      }

      // Ajouter un marqueur (optionnel)
    };

    initializeMap();
  }, [center, zoom]);

  return <div ref={mapRef} style={{ height, width }} />;
};

export default Map;