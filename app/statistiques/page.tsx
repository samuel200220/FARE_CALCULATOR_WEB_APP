'use client';

import React, { useEffect, useState } from 'react';
import SidebarToggle from '@/components/sidebar1';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';

interface CalculGlobal {
  key: {
    id: string;
    dateCalcul: string;
  };
  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;
  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;
  typeUtilisateur: string;
}

const COLORS = ['#0ea5e9', '#facc15', '#ef4444'];

export default function StatistiquesPage() {
  const [data, setData] = useState<CalculGlobal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');

    fetch(`http://localhost:8080/api/calculs-globaux/date/${today}`)
      .then(res => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json);
        } else {
          console.error("Réponse inattendue :", json);
          setData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement des données :", err);
        setLoading(false);
      });
  }, []);

  const barData = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((dayName, i) => ({
    name: dayName,
    courses: data.filter(d => new Date(d.key.dateCalcul).getDay() === ((i + 1) % 7)).length
  }));

  const pieData = [
    { name: 'Courses Terminées', value: Math.floor(data.length * 0.6) },
    { name: 'Courses En Cours', value: Math.floor(data.length * 0.3) },
    { name: 'Annulées', value: Math.max(data.length - Math.floor(data.length * 0.9), 0) },
  ];

  return (
    <div className="p-6 space-y-6">
      <SidebarToggle />
      <h1 className="text-3xl font-bold dark:text-white text-center">Statistiques Générales</h1>

      {loading ? (
        <p className="text-center dark:text-white">Chargement des statistiques...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl dark:text-white font-semibold mb-4">Courses par Jour</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="courses" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl dark:text-white font-semibold mb-4">Répartition des Courses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tableau des Courses Récentes */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl dark:text-white font-semibold mb-4">Courses Récentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:text-blue-500 dark:bg-gray-700 text-left">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Départ</th>
                    <th className="px-4 py-2">Destination</th>
                    <th className="px-4 py-2">Heure</th>
                    <th className="px-4 py-2">Distance (km)</th>
                    <th className="px-4 py-2">Coût</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                  {data.map((course, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">{course.key.dateCalcul}</td>
                      <td className="px-4 py-2">{course.lieuDepart}</td>
                      <td className="px-4 py-2">{course.lieuArrivee}</td>
                      <td className="px-4 py-2">{course.heurePriseEnCharge}</td>
                      <td className="px-4 py-2">{course.distanceKm.toFixed(1)}</td>
                      <td className="px-4 py-2">{course.coutEstime.toFixed(0)} FCFA</td>
                      <td className="px-4 py-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                          {course.typeUtilisateur}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
