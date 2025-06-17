'use client';

import Sidebar from '@/components/sidebar';
import SidebarToggle from '@/components/sidebar1';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const barData = [
  { name: 'Lun', courses: 12 },
  { name: 'Mar', courses: 18 },
  { name: 'Mer', courses: 9 },
  { name: 'Jeu', courses: 16 },
  { name: 'Ven', courses: 22 },
  { name: 'Sam', courses: 30 },
  { name: 'Dim', courses: 5 },
];

const pieData = [
  { name: 'Courses Terminées', value: 60 },
  { name: 'Courses En Cours', value: 25 },
  { name: 'Annulées', value: 15 },
];

const COLORS = ['#0ea5e9', '#facc15', '#ef4444'];

const recentCourses = [
  { date: '17/06/2025', start: 'Yaoundé', end: 'Douala', hour: '14:30', price: '2 500', status: 'Terminée' },
  { date: '17/06/2025', start: 'Etoudi', end: 'Mbankolo', hour: '09:15', price: '1 200', status: 'En cours' },
  { date: '16/06/2025', start: 'Bastos', end: 'Ekounou', hour: '16:45', price: '1 800', status: 'Annulée' },
];

export default function StatistiquesPage() {
  return (
    <div className="p-6 space-y-6">
        {/* <Sidebar/> */}
        <SidebarToggle />
      <h1 className="text-3xl font-bold dark:text-white text-center">Statistiques Générales</h1>

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
                <th className="px-4 py-2">Coût (FCFA)</th>
                <th className="px-4 py-2">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              {recentCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{course.date}</td>
                  <td className="px-4 py-2">{course.start}</td>
                  <td className="px-4 py-2">{course.end}</td>
                  <td className="px-4 py-2">{course.hour}</td>
                  <td className="px-4 py-2">{course.price}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      course.status === 'Terminée' ? 'bg-green-100 text-green-800' :
                      course.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
