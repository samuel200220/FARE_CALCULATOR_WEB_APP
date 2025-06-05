'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes manquantes dans Leaflet
// Removed unnecessary line as _getIconUrl does not exist in the current Leaflet version
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function RealMap() {
  return (
    <MapContainer center={[3.848, 11.5021]} zoom={13} style={{ borderRadius:'20px', height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[3.848, 11.5021]}>
        <Popup>Vous êtes ici.</Popup>
      </Marker>
    </MapContainer>
  );
}
