'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, CloudRain, Briefcase, AlertTriangle, Sun, Edit2, Save, X, User, Mail, Phone, MapPinned } from 'lucide-react';
import Sidebar2 from '@/components/sidebar2';

interface Trip {
  id: string;
  departureLocation: string;
  arrivalLocation: string;
  date: string;
  time: string;
  dayOfWeek: string;
  roadCondition: string;
  isRaining: boolean;
  hasLuggage: boolean;
  hasAccident: boolean;
  isHoliday: boolean;
  estimatedPrice: number;
  actualPrice?: number;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
}

export default function UserDashboard() {
  const [userProfile] = useState<UserProfile>({
    name: 'Jean Mbarga',
    email: 'jean.mbarga@email.com',
    phone: '+237 6 99 87 65 43',
    location: 'Yaoundé, Cameroun',
    memberSince: '2025-11-15'
  });

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      departureLocation: 'Yaoundé Centre',
      arrivalLocation: 'Nsimalen Airport',
      date: '2026-01-20',
      time: '14:30',
      dayOfWeek: 'Lundi',
      roadCondition: 'Bonne',
      isRaining: false,
      hasLuggage: true,
      hasAccident: false,
      isHoliday: false,
      estimatedPrice: 8500,
      actualPrice: 9000
    },
    {
      id: '2',
      departureLocation: 'Bastos',
      arrivalLocation: 'Carrefour Express',
      date: '2026-01-18',
      time: '08:15',
      dayOfWeek: 'Samedi',
      roadCondition: 'Moyenne',
      isRaining: true,
      hasLuggage: false,
      hasAccident: false,
      isHoliday: false,
      estimatedPrice: 3500
    },
    {
      id: '3',
      departureLocation: 'Mvan',
      arrivalLocation: 'Mélen',
      date: '2026-01-15',
      time: '18:45',
      dayOfWeek: 'Mercredi',
      roadCondition: 'Mauvaise',
      isRaining: false,
      hasLuggage: false,
      hasAccident: true,
      isHoliday: false,
      estimatedPrice: 2800,
      actualPrice: 3200
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  const handleEdit = (trip: Trip) => {
    setEditingId(trip.id);
    setEditPrice(trip.actualPrice?.toString() || '');
  };

  const handleSave = (id: string) => {
    setTrips(trips.map(trip => 
      trip.id === id 
        ? { ...trip, actualPrice: parseFloat(editPrice) || undefined }
        : trip
    ));
    setEditingId(null);
    setEditPrice('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className='flex gap-2'>
            <Sidebar2 />
          <h1 className="text-3xl font-bold text-violet-800 dark:text-violet-400 mb-2">
            Mon Tableau de Bord
          </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez votre profil et consultez l'historique de vos trajets
          </p>
        </div>

        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 rounded-lg p-6 mb-8 border border-violet-200 dark:border-violet-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-violet-600 dark:bg-violet-900 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userProfile.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Membre depuis {new Date(userProfile.memberSince).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinned className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{userProfile.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors flex items-center space-x-2">
              <Edit2 className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 dark:text-violet-400 mb-1">Total Trajets</p>
                <p className="text-3xl font-bold text-violet-800 dark:text-violet-300">{trips.length}</p>
              </div>
              <MapPin className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Prix Moyen Estimé</p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                  {Math.round(trips.reduce((sum, t) => sum + t.estimatedPrice, 0) / trips.length)} FCFA
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 dark:text-violet-400 mb-1">Contributions</p>
                <p className="text-3xl font-bold text-violet-800 dark:text-violet-300">
                  {trips.filter(t => t.actualPrice).length}
                </p>
              </div>
              <Edit2 className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>

        {/* Trips Section Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Historique des Trajets
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Consultez vos trajets passés et contribuez en indiquant les prix réels payés
          </p>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Départ</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trip.departureLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Arrivée</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trip.arrivalLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(trip.date).toLocaleDateString('fr-FR')} ({trip.dayOfWeek})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{trip.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        Route: {trip.roadCondition}
                      </span>
                      {trip.isRaining && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center space-x-1">
                          <CloudRain className="w-3 h-3" />
                          <span>Pluie</span>
                        </span>
                      )}
                      {trip.hasLuggage && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 flex items-center space-x-1">
                          <Briefcase className="w-3 h-3" />
                          <span>Bagages</span>
                        </span>
                      )}
                      {trip.hasAccident && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Accident</span>
                        </span>
                      )}
                      {trip.isHoliday && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 flex items-center space-x-1">
                          <Sun className="w-3 h-3" />
                          <span>Jour férié</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Prix estimé</p>
                        <p className="text-lg font-bold text-violet-700 dark:text-violet-400">
                          {trip.estimatedPrice.toLocaleString()} FCFA
                        </p>
                      </div>
                      {editingId === trip.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            placeholder="Prix réel"
                            className="w-32 px-3 py-1 text-sm border border-blue-600 dark:border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleSave(trip.id)}
                            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Prix réel payé</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                            {trip.actualPrice ? `${trip.actualPrice.toLocaleString()} FCFA` : 'Non renseigné'}
                          </p>
                        </div>
                      )}
                    </div>
                    {editingId !== trip.id && (
                      <button
                        onClick={() => handleEdit(trip)}
                        className="px-4 py-2 bg-violet-600 dark:bg-violet-900 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors flex items-center space-x-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">Contribuer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}