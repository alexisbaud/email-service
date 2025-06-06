import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import packageJson from '../package.json';

// Créer une nouvelle instance de l'application Hono
const app = new Hono();

// Port d'écoute du service (port 3003 selon l'architecture)
const PORT = Number(process.env.PORT) || 3003;

/**
 * Health Check Endpoint
 * 
 * Cet endpoint permet de vérifier si le service est vivant et fonctionnel.
 * Il est utilisé par les outils de monitoring et les load balancers.
 * 
 * Méthode: GET
 * Path: /health/live
 * Réponse: { status: "ok", timestamp: "ISO_DATE" }
 */
app.get('/health/live', (c) => {
  console.log('request received /health/live');
  // Créer un timestamp ISO pour tracer quand le check a été effectué
  const timestamp = new Date().toISOString();
  
  // Retourner un JSON avec le statut OK et code HTTP 200 explicite
  return c.json({
    status: 'ok',
    timestamp: timestamp,
    service: packageJson.name, // Nom depuis package.json
    version: packageJson.version, // Version depuis package.json
    uptime: process.uptime() // Temps depuis le démarrage en secondes
  }, 200); // Code 200 explicite
});

/**
 * Endpoint de base pour tester que le serveur répond
 */
app.get('/', (c) => {
  console.log('request received /');
  return c.json({
    message: `${packageJson.name} is running!`,
    service: packageJson.name, // Nom depuis package.json
    version: packageJson.version // Version depuis package.json
  }, 200); // Code 200 explicite
});

/**
 * Démarrage du serveur avec Node.js
 */
console.log(`🚀 Starting server on port ${PORT}...`);
console.log(`📧 Service: ${packageJson.name} v${packageJson.version}`);
console.log(`🏥 Health Check: http://localhost:${PORT}/health/live`);
console.log(`🌐 Root Endpoint: http://localhost:${PORT}/`);

// Démarrer le serveur avec Node.js
serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`);
}); 