import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuration de l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Créer une instance axios avec configuration par défaut
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour CORS avec credentials
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter des tokens d'authentification ici
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.status, error.response.data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('Pas de réponse du serveur:', error.request);
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

// Service pour les utilisateurs
export const utilisateurService = {
  // Créer un utilisateur
  create: async (data: { nom: string; email: string }) => {
    const response = await apiClient.post('/api/utilisateurs', data);
    return response.data;
  },

  // Récupérer par ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/utilisateurs/${id}`);
    return response.data;
  },

  // Récupérer par email
  getByEmail: async (email: string) => {
    const response = await apiClient.get(`/api/utilisateurs/email/${email}`);
    return response.data;
  },

  // Supprimer un utilisateur
  delete: async (id: string) => {
    await apiClient.delete(`/api/utilisateurs/${id}`);
  },

  // Vérifier si un email existe
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      await apiClient.get(`/api/utilisateurs/email/${email}`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },
  // Login par email
  login: async (email: string) => {
    const response = await apiClient.get(`/api/utilisateurs/email/${email}`);
    return response.data;
  },
};

// Service pour les entreprises
export const entrepriseService = {
  // Créer une entreprise
  create: async (data: {
    nom: string;
    responsable: string;
    email: string;
    motDePasse: string;
  }) => {
    const response = await apiClient.post('/api/entreprises', data);
    return response.data;
  },

  // Récupérer par ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/entreprises/${id}`);
    return response.data;
  },

  // Récupérer par email
  getByEmail: async (email: string) => {
    const response = await apiClient.get(`/api/entreprises/email/${email}`);
    return response.data;
  },

  // Supprimer une entreprise
  delete: async (id: string) => {
    await apiClient.delete(`/api/entreprises/${id}`);
  },

  // Vérifier si un email existe
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      await apiClient.get(`/api/entreprises/email/${email}`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // Login par email et mot de passe
  login: async (email: string, motDePasse: string) => {
    const response = await apiClient.post('/api/entreprises/login', {
      email,
      motDePasse,
    });
    return response.data;
  },
};

export default apiClient;