'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { utilisateurService } from '@/app/services/api';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si token présent, récupérer l'utilisateur courant
      utilisateurService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token'); // Token invalide
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
