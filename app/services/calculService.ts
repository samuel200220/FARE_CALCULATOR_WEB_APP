const API_URL = 'http://localhost:8080/api';

export interface CalculRequest {
  utilisateurId: string;
  lieuDepart: string;
  lieuArrivee: string;
  heurePriseEnCharge: string;
  distanceKm: number;
  coutEstime: number;
  tarifOfficiel: number;
}

export interface CalculResponse extends CalculRequest {
  idCalcul: string;
  dateCalcul: string;
}

export async function enregistrerCalcul(data: CalculRequest): Promise<CalculResponse> {
  const res = await fetch(`${API_URL}/calculs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Erreur lors de la sauvegarde');
  }

  return await res.json();
}

export async function getHistorique(utilisateurId: string): Promise<CalculResponse[]> {
  const res = await fetch(`${API_URL}/calculs/utilisateur/${utilisateurId}`);
  if (!res.ok) throw new Error('Erreur historique');
  return await res.json();
}
