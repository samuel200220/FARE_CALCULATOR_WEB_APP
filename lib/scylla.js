// lib/cassandra.js
import { Client } from 'cassandra-driver';

// Configuration du client Cassandra
const client = new Client({
  contactPoints: ['127.0.0.1'], // Remplacez par vos points de contact
  localDataCenter: 'datacenter1', // Remplacez par votre datacenter
  keyspace: 'fare_calculator',
  credentials: {
    username: 'your_username', // Si authentification requise
    password: 'your_password'
  }
});

// Fonction pour initialiser la connexion
export const initCassandra = async () => {
  try {
    await client.connect();
    console.log('Connexion à Cassandra établie');
  } catch (error) {
    console.error('Erreur de connexion à Cassandra:', error);
    throw error;
  }
};

// Fonction pour fermer la connexion
export const closeCassandra = async () => {
  await client.shutdown();
};

export default client;