'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, Navigation, CalendarDays } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';

interface Calcul {
  key: {
    utilisateur_id: string;
    timestamp: string;
  };
  lieu_depart: string;
  lieu_arrivee: string;
  heure_prise_en_charge: string;
  distance_km: number;
  cout_estime: number;
  tarif_officiel: number;
}

export default function Historique() {
  const [courses, setCourses] = useState<Calcul[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const idUtilisateur = localStorage.getItem("idUtilisateur");

    if (!idUtilisateur) {
      setErreur("Aucun identifiant utilisateur trouvé.");
      setLoading(false);
      return;
    }

    const fetchHistorique = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/calculs-utilisateur/utilisateur/${idUtilisateur}`);
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await res.json();
        setCourses(data);
      } catch (err: any) {
        setErreur(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <SidebarToggle />
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-white mb-6">
        Historique des Courses
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Chargement en cours...</p>
      ) : erreur ? (
        <p className="text-center text-red-600 dark:text-red-400">{erreur}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Aucune course enregistrée.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <MapPin className="mr-2 text-blue-600" />
                    <span><strong>Départ :</strong> {course.lieu_depart}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <Navigation className="mr-2 text-green-600" />
                    <span><strong>Destination :</strong> {course.lieu_arrivee}</span>
                  </div>
                </div>

                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2" />
                    <span>{new Date(course.key.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" />
                    <span>{course.heure_prise_en_charge}</span>
                  </div>
                </div>

                <div className="text-right text-blue-700 dark:text-blue-400 font-semibold text-lg">
                  {(course.cout_estime ?? 0).toLocaleString()} FCFA
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
