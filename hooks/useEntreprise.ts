import { useEffect, useState } from 'react';
import { entrepriseService } from '@/app/services/api';

export function useEntreprise() {
  const [entreprise, setEntreprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('entreprise');
      if (stored) {
        setEntreprise(JSON.parse(stored)); // OK maintenant, JSON valide
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Impossible de parser entreprise depuis localStorage', err);
    }

    const id = localStorage.getItem('entrepriseId');
    if (!id) {
      setLoading(false);
      return;
    }

    entrepriseService
      .getById(id)
      .then(data => {
        setEntreprise(data);
        localStorage.setItem('entreprise', JSON.stringify(data)); // on met à jour le LS
      })
      .catch(() => setEntreprise(null))
      .finally(() => setLoading(false));
  }, []);

  return { entreprise, loading };
}
