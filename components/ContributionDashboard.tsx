// ContributionDashboard.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { exportToCSV } from '@/utils/exportCsv';
import {
  FaDownload,
  FaChartLine,
  FaCalendarAlt,
  FaRuler,
  FaMoneyBillAlt,
  FaTrash,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaSpinner
} from 'react-icons/fa';
import { MdRoute } from 'react-icons/md';
import {
  fetchContributions,
  createContribution,
  updateContribution,
  deleteContribution,
  type Contribution
} from '@/app/services/contributionService';

// Import Recharts components
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter
} from 'recharts';
import { useRouter } from 'next/navigation';

// Couleurs pour les graphiques
const CHART_COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#10b981', // emerald-500
  accent: '#8b5cf6', // violet-500
  danger: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
  info: '#06b6d4', // cyan-500
  success: '#10b981', // emerald-500
};

const PIE_CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
];

export default function ContributionDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<Contribution | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'daily' | 'price' | 'conditions' | 'distribution'>('daily');
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('7days');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const contributions = await fetchContributions();
      
      // Trier par date décroissante
      const sortedData = contributions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setData(sortedData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des données:', err);
      
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
        router.push('/connexion1');
      } else {
        setError(err.response?.data?.message || 'Erreur de chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction de filtrage par date
  const filterDataByDateRange = (data: Contribution[], range: '7days' | '30days' | 'all') => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (range) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        return data;
    }
    
    return data.filter(item => new Date(item.timestamp) >= cutoffDate);
  };

  // Fonction d'export CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const exportData = data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleString('fr-FR'),
        pluie: item.pluie ? 'Oui' : 'Non',
        routes_travaux: item.routes_travaux ? 'Oui' : 'Non',
        accident: item.accident ? 'Oui' : 'Non',
        jour_ferie: item.jour_ferie ? 'Oui' : 'Non',
        bagages: item.bagages ? 'Oui' : 'Non',
        routes_larges: item.routes_larges ? 'Oui' : 'Non',
      }));
      
      exportToCSV(exportData, `contributions_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSaveContribution = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Préparer les données pour l'envoi
      const contributionData = {
        depart_osm: formData.depart_osm,
        destination_osm: formData.destination_osm,
        distance_km: parseFloat(formData.distance_km) || 0,
        prix_paye: parseInt(formData.prix_paye) || 0,
        heure: formData.heure,
        jour_semaine: formData.jour_semaine,
        jour_ferie: Boolean(formData.jour_ferie),
        pluie: Boolean(formData.pluie),
        etat_route: formData.etat_route,
        routes_travaux: Boolean(formData.routes_travaux),
        accident: Boolean(formData.accident),
        bagages: Boolean(formData.bagages),
        routes_larges: Boolean(formData.routes_larges),
      };
      
      if (edit) {
        await updateContribution(edit.id, contributionData);
      } else {
        await createContribution(contributionData);
      }
      
      await loadData();
      setModal(false);
      setEdit(null);
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Erreur lors de la sauvegarde';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion de la suppression
  const handleDeleteContribution = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette contribution ?')) {
      return;
    }
    
    try {
      await deleteContribution(id);
      await loadData();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Erreur lors de la suppression';
      alert(errorMessage);
    }
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const filteredData = filterDataByDateRange(data, dateRange);
    return {
      total: filteredData.length,
      month: filteredData.filter(c => new Date(c.timestamp).getMonth() === new Date().getMonth()).length,
      avgDist: (filteredData.reduce((s, c) => s + c.distance_km, 0) / filteredData.length || 0).toFixed(1),
      avgPrice: Math.round(filteredData.reduce((s, c) => s + c.prix_paye, 0) / filteredData.length || 0),
      totalDistance: filteredData.reduce((s, c) => s + c.distance_km, 0).toFixed(1),
      totalPrice: filteredData.reduce((s, c) => s + c.prix_paye, 0),
    };
  }, [data, dateRange]);

  // Données pour le graphique quotidien
  const dailyChartData = useMemo(() => {
    const filteredData = filterDataByDateRange(data, dateRange);
    const dailyMap = new Map<string, { count: number; totalPrice: number; avgPrice: number }>();
    
    filteredData.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short' 
      });
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { count: 0, totalPrice: 0, avgPrice: 0 });
      }
      
      const dayData = dailyMap.get(date)!;
      dayData.count += 1;
      dayData.totalPrice += item.prix_paye;
      dayData.avgPrice = Math.round(dayData.totalPrice / dayData.count);
    });
    
    return Array.from(dailyMap.entries())
      .map(([date, { count, avgPrice }]) => ({
        date,
        contributions: count,
        prixMoyen: avgPrice,
      }))
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 10);
  }, [data, dateRange]);

  // Données pour le graphique par état de route
  const roadConditionData = useMemo(() => {
  const conditionMap = new Map<string, number>();

  data.forEach(c => {
    if (typeof c.etat_route !== 'string' || c.etat_route.trim() === '') {
      return;
    }

    const key = c.etat_route.trim();

    conditionMap.set(key, (conditionMap.get(key) || 0) + 1);
  });

  return Array.from(conditionMap.entries()).map(([name, value]) => ({
    name: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Inconnu',
    value,
    count: value,
  }));
}, [data]);

  // Données pour le graphique par jour de la semaine
  const dayOfWeekData = useMemo(() => {
    const filteredData = filterDataByDateRange(data, dateRange);
    const dayMap = new Map<string, number>();
    const daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    filteredData.forEach(item => {
      const day = item.jour_semaine;
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });
    
    // S'assurer que tous les jours sont présents
    daysOrder.forEach(day => {
      if (!dayMap.has(day)) {
        dayMap.set(day, 0);
      }
    });
    
    return Array.from(dayMap.entries())
      .map(([name, value]) => ({ name, contributions: value }))
      .sort((a, b) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));
  }, [data, dateRange]);

  // Données pour le graphique de distribution des prix
  const priceDistributionData = useMemo(() => {
    const filteredData = filterDataByDateRange(data, dateRange);
    const priceRanges = [
      { range: '0-200', min: 0, max: 200 },
      { range: '201-400', min: 201, max: 400 },
      { range: '401-600', min: 401, max: 600 },
      { range: '601-800', min: 601, max: 800 },
      { range: '801+', min: 801, max: Infinity },
    ];
    
    return priceRanges.map(range => {
      const count = filteredData.filter(item => 
        item.prix_paye >= range.min && item.prix_paye <= range.max
      ).length;
      
      return {
        range: range.range,
        count,
        percentage: filteredData.length > 0 ? 
          Math.round((count / filteredData.length) * 100) : 0,
      };
    });
  }, [data, dateRange]);

  // Données pour le radar chart (conditions multiples)
  const conditionsRadarData = useMemo(() => {
    const filteredData = filterDataByDateRange(data, dateRange);
    
    return [
      {
        condition: 'Pluie',
        count: filteredData.filter(item => item.pluie).length,
        fullMark: filteredData.length,
      },
      {
        condition: 'Travaux',
        count: filteredData.filter(item => item.routes_travaux).length,
        fullMark: filteredData.length,
      },
      {
        condition: 'Accident',
        count: filteredData.filter(item => item.accident).length,
        fullMark: filteredData.length,
      },
      {
        condition: 'Bagages',
        count: filteredData.filter(item => item.bagages).length,
        fullMark: filteredData.length,
      },
      {
        condition: 'Routes larges',
        count: filteredData.filter(item => item.routes_larges).length,
        fullMark: filteredData.length,
      },
      {
        condition: 'Jour férié',
        count: filteredData.filter(item => item.jour_ferie).length,
        fullMark: filteredData.length,
      },
    ];
  }, [data, dateRange]);

  // Configuration des graphiques
  const chartConfigs = {
    daily: {
      title: 'Contributions quotidiennes',
      description: 'Nombre de contributions et prix moyen par jour',
      icon: FaChartBar,
    },
    price: {
      title: 'Distribution des prix',
      description: 'Répartition des prix par fourchette',
      icon: FaMoneyBillAlt,
    },
    conditions: {
      title: 'Conditions de trajet',
      description: 'Fréquence des différentes conditions',
      icon: FaChartPie,
    },
    distribution: {
      title: 'Distribution par jour',
      description: 'Contributions par jour de la semaine',
      icon: FaCalendarAlt,
    },
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
            <p className="font-bold">Erreur de chargement</p>
            <p>{error}</p>
            <button
              onClick={loadData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Bouton retour */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow"
          >
            <FaArrowLeft />
            <span className="hidden md:inline">Retour</span>
          </button>
          
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-blue-900 dark:text-white mb-2">
              Dashboard de Contribution
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Suivez et gérez vos données pour le modèle ML</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2">
              <FaFilter className="text-blue-600" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7days' | '30days' | 'all')}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="all">Toutes les données</option>
              </select>
            </div>
            
            <button
              onClick={handleExportCSV}
              disabled={isExporting || data.length === 0}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
            >
              {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              {isExporting ? 'Export...' : 'Exporter CSV'}
            </button>
            
            <button
              onClick={() => { setEdit(null); setModal(true); }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300"
            >
              <FaPlus />
              Nouvelle Contribution
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FaChartLine className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Contributions</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <FaCalendarAlt className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ce Mois</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.month}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-xl">
                <FaRuler className="text-2xl text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distance Totale</div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.totalDistance} km
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <FaMoneyBillAlt className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prix Total</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalPrice} FCFA
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <FaChartBar className="text-2xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prix Moyen</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.avgPrice} FCFA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation des graphiques */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(chartConfigs).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedChart(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    selectedChart === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon />
                  <span className="text-sm font-medium">{config.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section des graphiques */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  {React.createElement(chartConfigs[selectedChart].icon, { className: "text-blue-600" })}
                  {chartConfigs[selectedChart].title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chartConfigs[selectedChart].description}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {dateRange === '7days' ? '7 derniers jours' : 
                 dateRange === '30days' ? '30 derniers jours' : 
                 'Toutes les données'}
              </div>
            </div>

            {/* Graphiques */}
            <div className="h-[400px]">
              {selectedChart === 'daily' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderColor: '#D1D5DB',
                        borderRadius: '0.5rem',
                        color: '#111827',
                      }}
                      formatter={(value: any) => [value, value.toString().includes('prix') ? 'FCFA' : 'contributions']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="contributions" 
                      name="Contributions" 
                      fill={CHART_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="prixMoyen" 
                      name="Prix moyen (FCFA)" 
                      fill={CHART_COLORS.secondary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {selectedChart === 'price' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Distribution par fourchette de prix
                    </h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={priceDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ range, percentage }) => `${range}: ${percentage}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="range"
                        >
                          {priceDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [value, 'contributions']}
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderColor: '#D1D5DB',
                            borderRadius: '0.5rem',
                            color: '#111827',
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Prix moyen par jour de la semaine
                    </h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <AreaChart
                        data={dayOfWeekData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderColor: '#D1D5DB',
                            borderRadius: '0.5rem',
                            color: '#111827',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="contributions" 
                          name="Contributions"
                          stroke={CHART_COLORS.accent} 
                          fill={CHART_COLORS.accent}
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {selectedChart === 'conditions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Répartition par état de la route
                    </h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={roadConditionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {roadConditionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderColor: '#D1D5DB',
                            borderRadius: '0.5rem',
                            color: '#111827',
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Fréquence des conditions
                    </h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <RadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="80%" 
                        data={conditionsRadarData}
                      >
                        <PolarGrid stroke="#374151" strokeOpacity={0.2} />
                        <PolarAngleAxis 
                          dataKey="condition" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <PolarRadiusAxis 
                          stroke="#9CA3AF"
                          fontSize={10}
                        />
                        <Radar
                          name="Occurrences"
                          dataKey="count"
                          stroke={CHART_COLORS.primary}
                          fill={CHART_COLORS.primary}
                          fillOpacity={0.6}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderColor: '#D1D5DB',
                            borderRadius: '0.5rem',
                            color: '#111827',
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {selectedChart === 'distribution' && (
                <div className="h-full">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Contributions par jour de la semaine
                  </h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                      data={dayOfWeekData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderColor: '#D1D5DB',
                          borderRadius: '0.5rem',
                          color: '#111827',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="contributions"
                        name="Contributions"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        dot={{ stroke: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mini-graphiques en résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Top destinations
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={(() => {
                  const destMap = new Map<string, number>();
                  data.forEach(item => {
                    destMap.set(item.destination_osm, (destMap.get(item.destination_osm) || 0) + 1);
                  });
                  return Array.from(destMap.entries())
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);
                })()}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Distance vs Prix
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                <XAxis 
                  type="number" 
                  dataKey="distance_km" 
                  name="Distance"
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <YAxis 
                  type="number" 
                  dataKey="prix_paye" 
                  name="Prix"
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Trajets"
                  data={data.slice(0, 8)}
                  fill={CHART_COLORS.accent}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Heures de contribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={(() => {
                  const hourMap = new Map<string, number>();
                  data.forEach(item => {
                    const hour = item.heure.substring(0, 2);
                    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
                  });
                  return Array.from(hourMap.entries())
                    .map(([heure, count]) => ({ heure: `${heure}:00`, count }))
                    .sort((a, b) => a.heure.localeCompare(b.heure));
                })()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.1} />
                <XAxis dataKey="heure" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <MdRoute className="text-blue-600" />
                Historique des Contributions
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.length} entrées au total • {dateRange === '7days' ? '7 derniers jours' : 
                dateRange === '30days' ? '30 derniers jours' : 'Toutes les données'}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Conditions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filterDataByDateRange(data, dateRange).map(c => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                      {new Date(c.timestamp).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'short',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-800 dark:text-white font-medium">
                        {c.depart_osm}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        → {c.destination_osm}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                      {typeof c.distance_km === 'number'
  ? `${c.distance_km.toFixed(1)} km`
  : '—'}

                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {c.prix_paye} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        <span 
                          className={`px-2 py-1 rounded text-xs ${c.etat_route === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                            c.etat_route === 'bon' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                            c.etat_route === 'moyen' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                        >
                          {c.etat_route}
                        </span>
                        {c.pluie && <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">🌧️</span>}
                        {c.routes_travaux && <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">🚧</span>}
                        {c.accident && <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">⚠️</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEdit(c); setModal(true); }}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200 text-blue-600 dark:text-blue-400"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteContribution(c.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200 text-red-600 dark:text-red-400"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modal && (
          <Modal 
            contribution={edit} 
            onClose={() => setModal(false)} 
            onSave={handleSaveContribution}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

// MODAL COMPONENT
function Modal({ contribution, onClose, onSave, isSubmitting }: any) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(contribution || {
    depart_osm: '', destination_osm: '', distance_km: 0, prix_paye: 0,
    pluie: false, etat_route: 'bon', routes_travaux: false, accident: false,
    heure: '', jour_semaine: '', jour_ferie: false, bagages: false, routes_larges: false
  });

  const update = (k: string, v: any) => {
    // Convertir les nombres
    if (k === 'distance_km') {
      setForm({ ...form, [k]: parseFloat(v) || 0 });
    } else if (k === 'prix_paye') {
      setForm({ ...form, [k]: parseInt(v) || 0 });
    } else if (k === 'heure') {
      // Formater l'heure si nécessaire
      setForm({ ...form, [k]: v });
    } else {
      setForm({ ...form, [k]: v });
    }
  };

  const renderBooleanIcon = (value: boolean) => 
    value ? <FaCheck className="text-green-600 dark:text-green-400" /> : <FaTimes className="text-red-600 dark:text-red-400" />;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {contribution ? '✏️ Modifier Contribution' : '➕ Nouvelle Contribution'}
          </h2>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-10 h-10 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="p-6">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }} 
            />
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Étape {step}/4
          </p>
        </div>

        {/* Steps */}
        <div className="p-6 min-h-[300px]">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <MdRoute className="text-blue-600" />
                Informations du Trajet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { l: 'Départ', k: 'depart_osm', t: 'text', p: 'Bonamoussadi' },
                  { l: 'Arrivée', k: 'destination_osm', t: 'text', p: 'Akwa' },
                  { l: 'Distance (km)', k: 'distance_km', t: 'number', p: '10.2' },
                  { l: 'Prix (FCFA)', k: 'prix_paye', t: 'number', p: '2500' }
                ].map(f => (
                  <div key={f.k} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {f.l}
                    </label>
                    <input 
                      type={f.t} 
                      value={form[f.k] || ''} 
                      onChange={e => update(f.k, e.target.value)}
                      placeholder={f.p}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Conditions du Trajet
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    État de la route
                  </label>
                  <select 
                    value={form.etat_route} 
                    onChange={e => update('etat_route', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {['excellent', 'bon', 'moyen', 'mauvais'].map(o => (
                      <option key={o} value={o} className="bg-white dark:bg-gray-800">
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { l: '🌧️ Il pleuvait', k: 'pluie' },
                    { l: '🚧 Travaux sur la route', k: 'routes_travaux' },
                    { l: '⚠️ Accident ou embouteillage', k: 'accident' }
                  ].map(f => (
                    <label 
                      key={f.k} 
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={form[f.k]} 
                        onChange={e => update(f.k, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{f.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Contexte du Trajet
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Heure
                    </label>
                    <input 
                      type="time" 
                      value={form.heure} 
                      onChange={e => update('heure', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jour de la semaine
                    </label>
                    <select 
                      value={form.jour_semaine} 
                      onChange={e => update('jour_semaine', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="" className="bg-white dark:bg-gray-800">-- Sélectionner --</option>
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(j => (
                        <option key={j} value={j} className="bg-white dark:bg-gray-800">{j}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { l: 'Jour férié', k: 'jour_ferie' },
                    { l: 'Avec bagages', k: 'bagages' },
                    { l: 'Routes larges', k: 'routes_larges' }
                  ].map(f => (
                    <label 
                      key={f.k} 
                      className="flex items-center justify-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={form[f.k]} 
                        onChange={e => update(f.k, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{f.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <FaCheck className="text-green-600" />
                Récapitulatif
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Trajet</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {form.depart_osm} → {form.destination_osm}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {form.distance_km} km
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Prix</div>
                    <div className="font-medium text-green-600 dark:text-green-400">
                      {form.prix_paye} FCFA
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">État route</div>
                    <div className="font-medium text-gray-800 dark:text-white capitalize">
                      {form.etat_route}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Conditions</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs">
                      {renderBooleanIcon(form.pluie)} Pluie
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs">
                      {renderBooleanIcon(form.routes_travaux)} Travaux
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs">
                      {renderBooleanIcon(form.accident)} Accident
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs">
                      {renderBooleanIcon(form.bagages)} Bagages
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div>Horaires : {form.jour_semaine} à {form.heure}</div>
                  <div className="mt-1">
                    {form.jour_ferie && <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded text-xs">Jour férié</span>}
                    {form.routes_larges && <span className="inline-block px-2 py-1 ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded text-xs">Routes larges</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
            >
              <FaArrowLeft />
              Précédent
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl font-medium transition-colors"
            >
              Suivant
              <FaArrowRight />
            </button>
          ) : (
            <button 
              onClick={() => onSave(form)}
              disabled={isSubmitting}
              className="ml-auto flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}