# Conversion de l'Application en Android

Ce document décrit les étapes pour convertir cette application Next.js en application Android native, en utilisant des technologies comme React Native ou Capacitor.

## Option 1: Utilisation de Capacitor.js (Recommandée)

[Capacitor](https://capacitorjs.com/) est une solution d'Ionic qui permet de créer des applications natives à partir d'applications web.

### Étapes d'installation

1. Installer Capacitor dans le projet:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
```

2. Configurer l'export statique dans `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
  // Autres configurations...
};
```

3. Construire l'application:

```bash
npm run build
```

4. Initialiser le projet Android:

```bash
npx cap add android
```

5. Copier les fichiers de build:

```bash
npx cap copy android
```

6. Ouvrir le projet dans Android Studio:

```bash
npx cap open android
```

7. Configurer dans Android Studio et construire l'APK.

## Option 2: Utilisation de React Native (Refactorisation)

Cette approche nécessite une refactorisation plus importante, mais donne un résultat plus natif.

1. Créer un nouveau projet React Native:

```bash
npx react-native init AppNextAndroid
```

2. Migrer les composants et logique de l'application actuelle vers React Native.

3. Utiliser les équivalents React Native pour les components web:
   - Remplacer les éléments HTML par les composants React Native (View, Text, etc.)
   - Adapter les styles CSS en StyleSheet React Native
   - Utiliser React Navigation pour les routes

4. Adapter les appels API pour utiliser fetch ou axios.

## Option 3: PWA avec TWA (Trusted Web Activity)

Cette approche consiste à transformer l'application en PWA, puis l'encapsuler dans une TWA pour Android.

1. Transformer l'application en PWA:
   - Ajouter un manifest.json
   - Configurer un service worker
   - Optimiser pour le mode hors ligne

2. Utiliser Bubblewrap ou PWABuilder pour créer un APK:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-app-url.com/manifest.json
bubblewrap build
```

## Configuration des API pour l'application mobile

Les APIs de l'application sont accessibles via les points de terminaison CORS-enabled:

- `/api/assessment` - Évaluation des compétences
- `/api/exercises` - Génération d'exercices personnalisés
- `/api/blocking-points` - Analyse des points de blocage

Pour une application en production, configurez un domaine API dédié dans le fichier `.env`:

```
API_URL=https://api.votre-domaine.com
GROQ_API_KEY=votre-cle-api
```

## Considérations pour le déploiement

- **Stockage de données**: Utiliser SQLite ou AsyncStorage pour le stockage local
- **Authentication**: Implémenter OAuth ou JWT
- **Notifications push**: Configurer Firebase Cloud Messaging
- **Mises à jour**: Utiliser CodePush ou OTA pour les mises à jour
- **Analytics**: Intégrer Firebase Analytics ou équivalent

## Tests et déploiement

1. Tester sur divers appareils et versions d'Android
2. Préparer les assets pour le Play Store (icônes, captures d'écran)
3. Créer une fiche Play Store et soumettre l'APK
4. Configurer le déploiement continu