# Hotel Client Request Application

Cette application gère les demandes clients dans un hôtel en temps réel.
Elle est composée d'un backend Node.js/Express et d'un frontend React.

## Installation

### Prérequis
- Node.js 18 ou supérieur
- npm

### Backend
1. Installez les dépendances à la racine du projet :
   ```bash
   npm install
   ```
2. Lancez le serveur :
   ```bash
   npm start
   ```
   L'API REST et WebSocket sera disponible sur `http://localhost:3001` et une base SQLite `hotel.db` sera créée automatiquement.

### Frontend
1. Rendez-vous dans le dossier `client` :
   ```bash
   cd client
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez l'interface en mode développement :
   ```bash
   npm run dev
   ```
   Vite ouvrira `http://localhost:5173` où l'interface Client est disponible.
   L'interface Administrateur est accessible via `http://localhost:5173/admin`.

## Déploiement
- **Frontend** : Vercel est recommandé pour déployer le dossier `client`.
- **Backend** : Render ou Railway peuvent être utilisés pour déployer `server.js`.

## Fonctionnement
- Les clients soumettent des demandes (room service, ménage, maintenance, taxi...)
  depuis la page d'accueil.
- Les réceptionnistes gèrent ces demandes en temps réel depuis la page `/admin`.
- Les statuts sont synchronisés via WebSocket.

