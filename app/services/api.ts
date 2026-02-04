import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios.get('/api/dashboard', {
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// });

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const utilisateurService = {
  // Connexion avec email
  async login(email: string) {
    const response = await api.post('/api/auth/login', { email });
    return response.data;
  },

  // Inscription
  async register(data: { nom: string; email: string }) {
    const response = await api.post('/api/utilisateurs/register', data);
    return response.data;
  },

  // Récupérer l'utilisateur courant
  async getCurrentUser() {
    const response = await api.get('/api/utilisateurs/me');
    return response.data;
  },

  // Vérifier si l'email existe
  async checkEmailExists(email: string) {
    const response = await api.get(`/api/auth/check-email/${email}`);
    return response.data.exists;
  },

  // Créer un utilisateur (pour compatibilité)
  async create(data: { nom: string; email: string }) {
    return this.register(data);
  },

  // Envoyer le code de vérification
  async sendVerificationCode(email: string) {
    const response = await api.post('/api/auth/send-verification', { email });
    return response.data;
  },

  // Vérifier le code
  async verifyCode(email: string, code: string) {
    const response = await api.post('/api/auth/verify-code', { email, code });
    return response.data;
  }
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
    const response = await api.post('/api/entreprises', data);
    return response.data;
  },

  async getCurrentEnterprise() {
    const response = await api.get('/api/entreprises/me');
    return response.data;
  },

  // Récupérer par ID
  getById: async (id: string) => {
    const response = await api.get(`/api/entreprises/${id}`);
    return response.data;
  },

  // Récupérer par email
  getByEmail: async (email: string) => {
    const response = await api.get(`/api/entreprises/email/${email}`);
    return response.data;
  },

  // Supprimer une entreprise
  delete: async (id: string) => {
    await api.delete(`/api/entreprises/${id}`);
  },

  // Vérifier si un email existe
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      await api.get(`/api/entreprises/email/${email}`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

// entrepriseService.ts
login: async (email: string, motDePasse: string) => {
  const response = await api.post('/api/entreprises/login', {
    email,
    motDePasse,
  });
  // Ici response.data contient déjà le JSON avec token + entreprise
  return response.data;
},

};

export default api;