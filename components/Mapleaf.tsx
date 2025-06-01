'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const DynamicMap = dynamic(() => import('./RealMap'), {
  ssr: false, // 🔥 empêche le rendu côté serveur
});

export default function Mapleaf() {
  return <DynamicMap />;
}


// 'use client';

// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useEffect } from 'react';
// import L from 'leaflet';

// // Fix icône de marker (problème fréquent avec Next.js + Leaflet)
// delete (L.Icon.Default.prototype as any).getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/leaflet/marker-icon-2x.png',
//   iconUrl: '/leaflet/marker-icon.png',
//   shadowUrl: '/leaflet/marker-shadow.png',
// });

// const Mapleaf = () => {
//   return (
//     <MapContainer center={[3.8480, 11.5021]} zoom={13} style={{ height: '100vh', width: '100%',borderRadius:'24px',boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}>
//       <TileLayer
//         url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={[3.8480, 11.5021]}>
//         <Popup>Yaounde 😄</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default Mapleaf;
