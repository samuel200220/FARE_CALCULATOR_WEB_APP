const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CalculRequest {
  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;
  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;
  jourSemaine?: string;
  jourFerie?: string;
  pluie?: string;
  etatRoute?: string;
  accident?: string;
  bagages?: string;
  routesLarges?: string;
  routesTravaux?: string;
}

export async function enregistrerCalcul(data: CalculRequest): Promise<string> {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

  const res = await fetch(`${API_URL}/api/calculs-utilisateur`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return await res.text();
}

export async function getHistorique(): Promise<any[]> {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `${API_URL}/api/calculs-utilisateur/me`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération de l'historique");
  }

  return await res.json();
}