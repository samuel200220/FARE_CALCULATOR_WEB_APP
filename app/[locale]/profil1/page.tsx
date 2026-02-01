'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, CloudRain, Briefcase, AlertTriangle, Sun, Edit2, Save, X, Mail, Phone, MapPinned } from 'lucide-react';
import Sidebar2 from '@/components/sidebar2';
import { useAuth } from '@/context/AuthContext';
import { getHistorique } from '@/app/services/calculService';
import { utilisateurService } from '@/app/services/api'; // Importez utilisateurService

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
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  // Transformer les données de l'historique en format Trip
  const transformToTrip = (historique: any): Trip => ({
    id: historique.id,
    departureLocation: historique.lieuDepart,
    arrivalLocation: historique.lieuArrivee,
    date: new Date(historique.timestamp).toISOString().split('T')[0],
    time: historique.heurePriseEnCharge,
    dayOfWeek: historique.jourSemaine || 'Inconnu',
    roadCondition: historique.etatRoute || 'Non spécifié',
    isRaining: historique.pluie === 'Oui',
    hasLuggage: historique.bagages === 'Oui',
    hasAccident: historique.accident === 'Oui',
    isHoliday: historique.jourFerie === 'Oui',
    estimatedPrice: historique.coutEstime,
    actualPrice: historique.tarifOfficiel
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les données du profil utilisateur
        if (user) {
          try {
            // Utilisez utilisateurService.getCurrentUser() au lieu de getCurrentUser()
            const userData = await utilisateurService.getCurrentUser();
            setUserProfile({
              name: userData.nom || user.nom || 'Utilisateur',
              email: userData.email || user.email || '',
              phone: userData.phone || '+237 6 99 87 65 43',
              location: userData.location || 'Yaoundé, Cameroun',
              memberSince: userData.createdAt || new Date().toISOString()
            });
          } catch (err) {
            // Fallback aux données du contexte d'authentification
            console.log('Erreur lors de la récupération du profil, utilisation des données du contexte:', err);
            setUserProfile({
              name: user.nom || 'Utilisateur',
              email: user.email || '',
              phone: '+237 6 99 87 65 43',
              location: 'Yaoundé, Cameroun',
              memberSince: new Date().toISOString()
            });
          }
        }

        // 2. Récupérer l'historique des trajets
        const historiqueData = await getHistorique();
        const transformedTrips = historiqueData.map(transformToTrip);
        setTrips(transformedTrips);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEdit = (trip: Trip) => {
    setEditingId(trip.id);
    setEditPrice(trip.actualPrice?.toString() || '');
  };

  const handleSave = async (id: string) => {
    // Ici, vous pouvez ajouter un appel API pour sauvegarder le prix réel
    // Exemple: await updateTripPrice(id, parseFloat(editPrice))
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Aucun profil utilisateur trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1B2A]">
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
                  {trips.length > 0 
                    ? Math.round(trips.reduce((sum, t) => sum + t.estimatedPrice, 0) / trips.length) 
                    : 0} FCFA
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
        {trips.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucun trajet enregistré
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}