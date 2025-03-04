import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Désactiver l'optimisation des performances de rendu pour éviter les erreurs d'hydratation
    optimizeCss: false,
    optimizeServerReact: false,
  },
};

export default nextConfig;
