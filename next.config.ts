import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Configuration pour la conversion en application Android/iOS
  // Désactiver output: 'export' pendant le développement car il désactive les API routes
  // output: 'export', // Activer uniquement pour build final mobile
  
  // Configurer les en-têtes pour CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Configuration des URL d'API en production
  env: {
    API_URL: process.env.API_URL || 'https://app-learning-api.example.com',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  },
  
  // Images et assets pour mobile
  images: {
    unoptimized: true, // Pour l'export static, désactiver l'optimisation des images
    domains: ['localhost'], // Domaines autorisés pour les images
  },
  
  experimental: {
    // Désactiver l'optimisation des performances de rendu pour éviter les erreurs d'hydratation
    optimizeCss: false,
    optimizeServerReact: false,
    // Pour le support PWA et service workers
    serviceWorkers: false, // Activer pour la version finale
  },
};

export default nextConfig;
