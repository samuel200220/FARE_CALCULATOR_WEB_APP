'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parse } from 'wellknown';
import { Place, Route } from '../lib/types';

interface CarteProps {
  userLocation?: { latitude: number; longitude: number } | null;
  searchedPlace?: Place | null;
  routes?: Route[];
  selectedRouteIndex: number;
  setSelectedRouteIndex: (index: number) => void;
}

export default function Carte({ userLocation, searchedPlace, routes, selectedRouteIndex, setSelectedRouteIndex }: CarteProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);
  const routePolylinesRef = useRef<L.Polyline[]>([]);

  const backendUrl = 'https://map-backend-reactif.onrender.com';

  const parseWKTLineString = (wkt: string): [number, number][] => {
    try {
      const geo = parse(wkt);
      if (geo && geo.type === 'LineString' && Array.isArray(geo.coordinates)) {
        return geo.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
      }
    } catch (error) {
      console.error('wellknown parsing failed:', error);
    }
    const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
    if (match) {
      const coords = match[1]
        .split(',')
        .map(coord => {
          const [lng, lat] = coord.trim().split(' ').map(Number);
          return [lat, lng] as [number, number];
        });
      return coords;
    }
    return [];
  };

  const fetchClosestPlace = async (lat: number, lng: number): Promise<Place | null> => {
    try {
      const response = await fetch(`${backendUrl}/api/places/closest?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        return data.data as Place;
      }
      return null;
    } catch (error) {
      console.error('Error fetching closest place:', error);
      return null;
    }
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const maxZoom = 16;
      mapRef.current = L.map(mapContainerRef.current, {
        center: [7.365, 12.3], // Centre approximatif du Cameroun
        zoom: 7, // Zoom ajusté pour voir l'ensemble du Cameroun
        minZoom: 6,
        maxZoom: maxZoom,
        maxBounds: [
          [1.65, 8.4], // Coin sud-ouest du Cameroun
          [13.08, 16.2], // Coin nord-est du Cameroun
        ],
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: maxZoom,
        tileSize: 256,
        zoomOffset: 0,
      }).addTo(mapRef.current);

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      routeLayerRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const closestPlace = await fetchClosestPlace(lat, lng);
        const placeName = closestPlace?.name || 'Position sélectionnée';

        if (clickMarkerRef.current) {
          mapRef.current?.removeLayer(clickMarkerRef.current);
          clickMarkerRef.current = null;
        } else {
          clickMarkerRef.current = L.marker([lat, lng], { icon: L.icon({ iconUrl: '/M3.png', iconSize: [24, 41] }) })
            .addTo(mapRef.current!)
            .bindPopup(`
              <b>${placeName}</b><br>
              Lat: ${lat.toFixed(6)}<br>
              Lng: ${lng.toFixed(6)}
            `)
            .openPopup();
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyer les couches précédentes
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
      clickMarkerRef.current = null;
    }

    routePolylinesRef.current = [];

    // Fonction pour centrer la carte sur un point avec un marqueur
    const centerOnPoint = async (lat: number, lng: number, placeName: string, zoom: number = 16) => {
      let displayName = placeName;
      if (placeName === 'Votre position') {
        const closestPlace = await fetchClosestPlace(lat, lng);
        displayName = closestPlace?.name || placeName;
      }
      
      // Supprimer l'ancien marqueur s'il existe
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      
      mapRef.current!.setView([lat, lng], zoom, { animate: true });
      markerRef.current = L.marker([lat, lng], { icon: L.icon({ iconUrl: '/M2.png', iconSize: [24, 41] }) })
        .addTo(mapRef.current!)
        .bindPopup(`
          <b>${displayName}</b><br>
          Lat: ${lat.toFixed(6)}<br>
          Lng: ${lng.toFixed(6)}
        `)
        .openPopup();
    };

    if (routes && routes.length > 0) {
      // Gérer les itinéraires
      let allCoordinates: [number, number][] = [];
      routes.forEach((route, index) => {
        const coordinates: [number, number][] = [];
        route.steps.forEach((step) => {
          const latLngs = parseWKTLineString(step.geometry);
          if (latLngs.length > 0) {
            coordinates.push(...latLngs);
          } else {
            console.error('Invalid geometry for step:', step.geometry);
          }
        });

        if (coordinates.length > 0) {
          // Définir la couleur : vert pour la route sélectionnée, noir pour les autres
          const color = index === selectedRouteIndex ? 'green' : 'black';
          const weight = index === selectedRouteIndex ? 5 : 3;
          const opacity = index === selectedRouteIndex ? 1.0 : 0.5;

          const polyline = L.polyline(coordinates, { color, weight, opacity })
            .addTo(routeLayerRef.current!)
            .on('click', (e: L.LeafletMouseEvent) => {
              // Stopper la propagation pour éviter le clic sur la carte
              L.DomEvent.stopPropagation(e);
              // Mettre à jour l'index de la route sélectionnée
              setSelectedRouteIndex(index);
              // Mettre à jour les couleurs des polylines
              routePolylinesRef.current.forEach((pl, i) => {
                pl.setStyle({
                  color: i === index ? 'green' : 'black',
                  weight: i === index ? 5 : 3,
                  opacity: i === index ? 1.0 : 0.5,
                });
              });
              // Afficher un popup au centre de la route
              const bounds = polyline.getBounds();
              const center = bounds.getCenter();
              L.popup()
                .setLatLng(center)
                .setContent(`
                  <b>Route ${index + 1}</b><br>
                  Distance: ${route.distance.toFixed(2)} m<br>
                  Durée: ${(route.duration / 60).toFixed(2)} min<br>
                  Départ: ${route.startPlaceName || 'Départ'}<br>
                  Destination: ${route.endPlaceName || 'Destination'}
                `)
                .openOn(mapRef.current!);
            });

          routePolylinesRef.current.push(polyline);
          allCoordinates = [...allCoordinates, ...coordinates];

          // Ajouter des marqueurs pour la première route uniquement
          if (index === selectedRouteIndex) {
            const startPoint = coordinates[0];
            const endPoint = coordinates[coordinates.length - 1];
            (async () => {
              let startPlaceName = route.startPlaceName || 'Départ';
              if (route.startPlaceName === 'Votre position') {
                const closestStartPlace = await fetchClosestPlace(startPoint[1], startPoint[0]);
                startPlaceName = closestStartPlace?.name || route.startPlaceName;
              }
              L.marker(startPoint, { icon: L.icon({ iconUrl: '/M4.png', iconSize: [24, 41] }) })
                .addTo(routeLayerRef.current!)
                .bindPopup(`
                  <b>${startPlaceName}</b><br>
                  Lat: ${startPoint[0].toFixed(6)}<br>
                  Lng: ${startPoint[1].toFixed(6)}
                `);
              L.marker(endPoint, { icon: L.icon({ iconUrl: '/M1.png', iconSize: [24, 41] }) })
                .addTo(routeLayerRef.current!)
                .bindPopup(`
                  <b>${route.endPlaceName || 'Destination'}</b><br>
                  Lat: ${endPoint[0].toFixed(6)}<br>
                  Lng: ${endPoint[1].toFixed(6)}
                `);
            })();
          }
        }
      });

      if (allCoordinates.length > 0) {
        mapRef.current!.fitBounds(L.latLngBounds(allCoordinates));
      }
    } else if (searchedPlace && searchedPlace.coordinates) {
      const { lat, lng } = searchedPlace.coordinates;
      centerOnPoint(lat, lng, searchedPlace.name);
    } else if (userLocation) {
      const { latitude, longitude } = userLocation;
      centerOnPoint(latitude, longitude, 'Votre position');
    } else {
      mapRef.current!.setView([7.365, 12.3], 7, { animate: true });
    }
  }, [userLocation, searchedPlace, routes, selectedRouteIndex, setSelectedRouteIndex]);

  return <div className="w-full h-screen relative z-0" ref={mapContainerRef} />;
}