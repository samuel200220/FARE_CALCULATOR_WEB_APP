'use client';

import { useEffect, useState } from 'react';
import {
  Clock,
  MapPin,
  Navigation,
  CalendarDays,
  CloudRain,
  Route
} from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';
import { getHistorique } from '@/app/services/calculService';

interface Calcul {
  id: string;
  timestamp: string;

  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;

  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;

  jourSemaine?: string;
  jourFerie?: string;
  pluie?: string;
  etatRoute?: string;
  accident?: string;
  bagages?: string;
  routesLarges?: string;
  routesTravaux?: string;
}

export default function Historique() {
  const [courses, setCourses] = useState<Calcul[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const data = await getHistorique();
        setCourses(data);
      } catch (err) {
        if (err instanceof Error) {
          setErreur(err.message);
        } else {
          setErreur("Une erreur inconnue est survenue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <SidebarToggle />

      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-white mb-8">
        Historique des Calculs
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Chargement en cours...
        </p>
      ) : erreur ? (
        <p className="text-center text-red-600 dark:text-red-400">{erreur}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Aucun calcul enregistré.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                
                {/* Lieux */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <MapPin className="mr-2 text-blue-600" />
                    <strong>Départ :</strong>&nbsp;{course.lieuDepart}
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <Navigation className="mr-2 text-green-600" />
                    <strong>Arrivée :</strong>&nbsp;{course.lieuArrivee}
                  </div>
                </div>

                {/* Date & heure */}
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2" />
                    {new Date(course.timestamp).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" />
                    {course.heurePriseEnCharge}
                  </div>
                </div>

                {/* Prix */}
                <div className="text-right font-semibold text-blue-700 dark:text-blue-400">
                  {course.coutEstime.toLocaleString()} FCFA
                  <div className="text-sm text-gray-500">
                    Officiel : {course.tarifOfficiel.toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Distance : {course.distanceKm} km</span>
                <span>Jour : {course.jourSemaine}</span>
                <span>Pluie : {course.pluie}</span>
                <span>Route : {course.etatRoute}</span>
                <span>Bagages : {course.bagages}</span>
                <span>Travaux : {course.routesTravaux}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
