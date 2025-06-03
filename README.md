# Hotel Client Request Application

Cette application gère les demandes clients dans un hôtel en temps réel.
Le backend Express expose l'API et sert l'interface React compilée.

## Installation

### Prérequis
- Node.js 18 ou supérieur
- npm

### Démarrage
1. Installez les dépendances :
   ```bash
   npm install
   cd client && npm install
   ```
2. Générez l'interface React :
   ```bash
   npm run build
   ```
3. Revenez à la racine et lancez le serveur :
   ```bash
   cd ..
   npm start
   ```
   Ouvrez ensuite `http://localhost:3001` (ou la valeur de `PORT`) pour accéder à l'application.

## Déploiement
Déployez la build React sur un hébergeur statique (Vercel par exemple) ou servez-la via ce serveur Express sur Render ou Railway.

## Fonctionnement
- Les clients soumettent des demandes (room service, ménage, maintenance, taxi...)
  depuis la page d'accueil.
- Les réceptionnistes gèrent ces demandes en temps réel depuis la page `/admin`.
- Les statuts sont synchronisés via WebSocket.

