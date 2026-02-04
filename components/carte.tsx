'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Map, Marker, Source, Layer, Popup, MapRef, LngLatBoundsLike, MapMouseEvent, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place, Route } from '../lib/types';

interface CarteProps {
  userLocation?: { latitude: number; longitude: number } | null;
  searchedPlace?: Place | null;
  routes?: Route[];
  selectedRouteIndex: number;
  setSelectedRouteIndex: (index: number) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Carte({ userLocation, searchedPlace, routes, selectedRouteIndex, setSelectedRouteIndex }: CarteProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 3.8480, // Center on Yaoundé
    longitude: 11.5021,
    zoom: 12
  });

  const [popupInfo, setPopupInfo] = useState<{
    lng: number;
    lat: number;
    name: string;
    type: 'depart' | 'destination';
  } | null>(null);

  // Convert routes into GeoJSON for Mapbox
  const routeData = useMemo(() => {
    if (!routes || routes.length === 0) return null;

    const features = routes.map((route, index) => {
      const coordinates: [number, number][] = [];
      route.steps.forEach((step) => {
        // Mapbox and standard GeoJSON use [lng, lat]
        const match = step.geometry.match(/LINESTRING\s*\(([^)]+)\)/);
        if (match) {
          const coords = match[1]
            .split(',')
            .map(coord => {
              const cleaned = coord.trim().split(/\s+/);
              if (cleaned.length >= 2) {
                const lng = parseFloat(cleaned[0]);
                const lat = parseFloat(cleaned[1]);
                if (!isNaN(lng) && !isNaN(lat)) {
                  return [lng, lat] as [number, number];
                }
              }
              return null;
            })
            .filter((c): c is [number, number] => c !== null);
          coordinates.push(...coords);
        }
      });

      return {
        type: 'Feature' as const,
        properties: {
          index,
          isSelected: index === selectedRouteIndex,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates
        }
      };
    });

    return {
      type: 'FeatureCollection' as const,
      features
    };
  }, [routes, selectedRouteIndex]);

  // Extract start and end points for the selected route
  const routePoints = useMemo(() => {
    if (!routes || routes.length === 0 || !routes[selectedRouteIndex]) {
      console.log('Map debug: No routes or selected route index invalid');
      return null;
    }

    const route = routes[selectedRouteIndex];
    const firstStep = route.steps[0];
    const lastStep = route.steps[route.steps.length - 1];

    if (!firstStep || !lastStep) {
      console.log('Map debug: First or last step missing');
      return null;
    }

    const parseFirstPoint = (wkt: string): [number, number] | null => {
      const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
      if (match) {
        const firstCoord = match[1].split(',')[0].trim().split(/\s+/);
        if (firstCoord.length >= 2) {
          return [parseFloat(firstCoord[0]), parseFloat(firstCoord[1])];
        }
      }
      return null;
    };

    const parseLastPoint = (wkt: string): [number, number] | null => {
      const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
      if (match) {
        const coords = match[1].split(',');
        const lastCoord = coords[coords.length - 1].trim().split(/\s+/);
        if (lastCoord.length >= 2) {
          return [parseFloat(lastCoord[0]), parseFloat(lastCoord[1])];
        }
      }
      return null;
    };

    const start = parseFirstPoint(firstStep.geometry);
    const end = parseLastPoint(lastStep.geometry);

    if (!start || !end) {
      console.log('Map debug: Parsing failed for start or end point', { start, end });
      return null;
    }

    console.log('Map debug: Route points calculated', { start, end });

    return {
      start: { lng: start[0], lat: start[1], name: route.startPlaceName || 'Départ' },
      end: { lng: end[0], lat: end[1], name: route.endPlaceName || 'Arrivée' }
    };
  }, [routes, selectedRouteIndex]);

  // Handle map click
  const handleMapClick = (e: MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    console.log('Map debug: Clicked at:', lat, lng);
    setPopupInfo(null); // Close popup on map click
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  // Effect to handle camera moves (fitBounds etc)
  useEffect(() => {
    if (!mapRef.current) return;

    if (routes && routes.length > 0) {
      const allCoords: [number, number][] = [];
      routes.forEach(route => {
        route.steps.forEach(step => {
          const match = step.geometry.match(/LINESTRING\s*\(([^)]+)\)/);
          if (match) {
            match[1].split(',').forEach(coord => {
              const cleaned = coord.trim().split(/\s+/);
              if (cleaned.length >= 2) {
                const lng = parseFloat(cleaned[0]);
                const lat = parseFloat(cleaned[1]);
                if (!isNaN(lng) && !isNaN(lat)) {
                  allCoords.push([lng, lat]);
                }
              }
            });
          }
        });
      });

      if (allCoords.length > 0) {
        const bounds = allCoords.reduce((acc, coord) => {
          return [
            Math.min(acc[0], coord[0]),
            Math.min(acc[1], coord[1]),
            Math.max(acc[2], coord[0]),
            Math.max(acc[3], coord[1])
          ];
        }, [allCoords[0][0], allCoords[0][1], allCoords[0][0], allCoords[0][1]]);

        mapRef.current.fitBounds(
          [bounds[0], bounds[1], bounds[2], bounds[3]] as LngLatBoundsLike,
          { padding: 80, duration: 1000 }
        );
      }
    } else if (searchedPlace && searchedPlace.coordinates) {
      mapRef.current.flyTo({
        center: [searchedPlace.coordinates.lng, searchedPlace.coordinates.lat],
        zoom: 14,
        duration: 2000
      });
    } else if (userLocation) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 2000
      });
    }
  }, [userLocation, searchedPlace, routes]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500 p-4 text-center">
        Erreur: Token Mapbox manquant. Veuillez ajouter NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN dans votre fichier .env
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative z-0">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Route Layers */}
        {routeData && (
          <Source id="route-source" type="geojson" data={routeData}>
            <Layer
              id="route-layer-inactive"
              type="line"
              filter={['!', ['get', 'isSelected']]}
              paint={{
                'line-color': '#4B5563', // gray-600
                'line-width': 4,
                'line-opacity': 0.4
              }}
            />
            <Layer
              id="route-layer-active"
              type="line"
              filter={['get', 'isSelected']}
              paint={{
                'line-color': '#10b981', // green-500
                'line-width': 6,
                'line-opacity': 1.0
              }}
            />
          </Source>
        )}

        {/* Departure/Arrival Markers */}
        {routePoints && (
          <>
            <Marker
              longitude={routePoints.start.lng}
              latitude={routePoints.start.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ ...routePoints.start, type: 'depart' });
              }}
            >
              <div className="flex flex-col items-center cursor-pointer group" style={{ zIndex: 10 }}>
                <img src="/M4.png" alt="Départ" className="w-8 h-11 transition-transform group-hover:scale-110" />
                <div className="bg-blue-600 text-white px-2 py-0.5 rounded shadow text-[10px] font-bold mt-1 uppercase tracking-wider">Départ</div>
              </div>
            </Marker>

            <Marker
              longitude={routePoints.end.lng}
              latitude={routePoints.end.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ ...routePoints.end, type: 'destination' });
              }}
            >
              <div className="flex flex-col items-center cursor-pointer group" style={{ zIndex: 10 }}>
                <img src="/M1.png" alt="Destination" className="w-8 h-11 transition-transform group-hover:scale-110" />
                <div className="bg-red-600 text-white px-2 py-0.5 rounded shadow text-[10px] font-bold mt-1 uppercase tracking-wider">Arrivée</div>
              </div>
            </Marker>
          </>
        )}

        {/* User Location Marker (fallback if no route) */}
        {userLocation && !routePoints && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <img src="/M2.png" alt="User Location" className="w-8 h-11" />
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mt-1">Vous</div>
            </div>
          </Marker>
        )}

        {/* Searched Place Marker (if no route) */}
        {searchedPlace && searchedPlace.coordinates && !routePoints && (
          <Marker
            longitude={searchedPlace.coordinates.lng}
            latitude={searchedPlace.coordinates.lat}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <img src="/M3.png" alt="Searched Location" className="w-8 h-11" />
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold mt-1 truncate max-w-[100px]">{searchedPlace.name}</div>
            </div>
          </Marker>
        )}

        {/* Popups */}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="z-50"
          >
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-gray-900 border-b pb-1 mb-1">
                {popupInfo.type === 'depart' ? '📍 Point de départ' : '🏁 Destination'}
              </h3>
              <p className="text-sm font-medium text-blue-600 mb-2 leading-tight">{popupInfo.name}</p>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <div><span className="font-semibold">Lat:</span> {popupInfo.lat.toFixed(6)}</div>
                <div><span className="font-semibold">Lng:</span> {popupInfo.lng.toFixed(6)}</div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
