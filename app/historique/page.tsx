'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, Navigation, CalendarDays } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';

interface Course {
  id: number;
  depart: string;
  destination: string;
  date: string;
  heure: string;
  tarif: number;
}

export default function Historique() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Données fictives simulées
    setCourses([
      {
        id: 1,
        depart: 'Douala',
        destination: 'Yaoundé',
        date: '2025-06-15',
        heure: '14:00',
        tarif: 10000,
      },
      {
        id: 2,
        depart: 'Bonamoussadi',
        destination: 'Akwa',
        date: '2025-06-14',
        heure: '08:30',
        tarif: 2500,
      },
      {
        id: 3,
        depart: 'Makepe',
        destination: 'Bonanjo',
        date: '2025-06-12',
        heure: '18:15',
        tarif: 3000,
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <SidebarToggle />
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-white mb-6">
        Historique des Courses
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {courses.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Aucune course enregistrée.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <MapPin className="mr-2 text-blue-600" />
                    <span><strong>Départ :</strong> {course.depart}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-white">
                    <Navigation className="mr-2 text-green-600" />
                    <span><strong>Destination :</strong> {course.destination}</span>
                  </div>
                </div>

                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2" />
                    <span>{course.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" />
                    <span>{course.heure}</span>
                  </div>
                </div>

                <div className="text-right text-blue-700 dark:text-blue-400 font-semibold text-lg">
                  {course.tarif.toLocaleString()} FCFA
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
