'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { utilisateurService, entrepriseService } from '@/app/services/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [entreprise, setEntreprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('idUtilisateur');
    localStorage.removeItem('entreprise');
    localStorage.removeItem('entrepriseId');
    setUser(null);
    setEntreprise(null);
    router.push('/connexion1');
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Tenter de récupérer l'utilisateur standard
        const userData = await utilisateurService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        try {
          // Si échoue, tenter de récupérer l'entreprise (Pro)
          const entData = await entrepriseService.getCurrentEnterprise();
          setEntreprise(entData);
        } catch (entErr) {
          // Token invalide ou expiré pour les deux types
          localStorage.removeItem('token');
          setUser(null);
          setEntreprise(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, entreprise, setEntreprise, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
