import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Contribution {
  id: string;
  timestamp: string;
  depart_osm: string;
  destination_osm: string;
  distance_km: number;
  prix_paye: number;
  heure: string;
  jour_semaine: string;
  jour_ferie: boolean;
  pluie: boolean;
  etat_route: 'excellent' | 'bon' | 'moyen' | 'mauvais';
  routes_travaux: boolean;
  accident: boolean;
  bagages: boolean;
  routes_larges: boolean;
}

// Fonction pour convertir camelCase en snake_case pour le frontend
const convertToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => convertToSnakeCase(item));
  } else if (data !== null && typeof data === 'object') {
    const result: any = {};
    Object.keys(data).forEach(key => {
      // Convertir camelCase en snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = convertToSnakeCase(data[key]);
    });
    return result;
  }
  return data;
};

// Fonction pour convertir snake_case en camelCase pour le backend
const convertToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => convertToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    const result: any = {};
    Object.keys(data).forEach(key => {
      // Convertir snake_case en camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = convertToCamelCase(data[key]);
    });
    return result;
  }
  return data;
};

// Récupérer toutes les contributions de l'utilisateur
export const fetchContributions = async (): Promise<Contribution[]> => {
  try {
    const res = await axios.get(`${API_URL}/api/contributions`, {
      headers: getAuthHeaders(),
    });
    
    // Le backend retourne du camelCase, on convertit en snake_case pour le frontend
    const data = convertToSnakeCase(res.data);
    
    return data.map((c: any) => ({
      id: c.id,
      timestamp: c.timestamp,
      depart_osm: c.depart_osm || c.departOsm || '',
      destination_osm: c.destination_osm || c.destinationOsm || '',
      distance_km: c.distance_km || c.distanceKm || 0,
      prix_paye: c.prix_paye || c.prixPaye || 0,
      heure: c.heure || '',
      jour_semaine: c.jour_semaine || c.jourSemaine || '',
      jour_ferie: c.jour_ferie || c.jourFerie || false,
      pluie: c.pluie || false,
      etat_route: (c.etat_route || c.etatRoute || 'bon') as 'excellent' | 'bon' | 'moyen' | 'mauvais',
      routes_travaux: c.routes_travaux || c.routesTravaux || false,
      accident: c.accident || false,
      bagages: c.bagages || false,
      routes_larges: c.routes_larges || c.routesLarges || false,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des contributions:', error);
    throw error;
  }
};

// Créer une nouvelle contribution
export const createContribution = async (
  contribution: Omit<Contribution, 'id' | 'timestamp'>
): Promise<Contribution> => {
  try {
    // Convertir snake_case en camelCase pour le backend
    const camelData = convertToCamelCase(contribution);
    
    const res = await axios.post(`${API_URL}/api/contributions`, camelData, {
      headers: getAuthHeaders(),
    });
    
    // Convertir la réponse en snake_case pour le frontend
    return convertToSnakeCase(res.data);
  } catch (error) {
    console.error('Erreur lors de la création de la contribution:', error);
    throw error;
  }
};

// Mettre à jour une contribution
export const updateContribution = async (
  id: string, 
  contribution: Partial<Contribution>
): Promise<Contribution> => {
  try {
    // Convertir snake_case en camelCase pour le backend
    const camelData = convertToCamelCase(contribution);
    
    const res = await axios.put(`${API_URL}/api/contributions/${id}`, camelData, {
      headers: getAuthHeaders(),
    });
    
    // Convertir la réponse en snake_case pour le frontend
    return convertToSnakeCase(res.data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la contribution:', error);
    throw error;
  }
};

// Supprimer une contribution
export const deleteContribution = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/contributions/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la contribution:', error);
    throw error;
  }
};