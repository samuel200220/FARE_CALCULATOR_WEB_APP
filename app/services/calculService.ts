const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CalculRequest {
  idUtilisateur: string;
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

export async function enregistrerCalcul(data: CalculRequest): Promise<any> {
  console.log('Envoi du calcul au backend:', data);
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Erreur backend:', errorText);
    throw new Error(errorText || 'Erreur lors de la sauvegarde du calcul');
  }

  return await res.text();
}

export async function getHistorique(utilisateurId: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/calculs-utilisateur/utilisateur/${utilisateurId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération de l\'historique');
  return await res.json();
}