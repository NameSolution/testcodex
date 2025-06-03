# Hotel Client Request Application

Cette application gère les demandes clients dans un hôtel en temps réel.
Tout est désormais regroupé dans un seul fichier Node.js qui sert l'interface et l'API.

## Installation

### Prérequis
- Node.js 18 ou supérieur
- npm

### Démarrage
1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez l'application :
   ```bash
   npm start
   ```
   Ouvrez ensuite `http://localhost:3000` dans votre navigateur pour accéder à l'interface.

## Déploiement
Vous pouvez exécuter `app.js` sur n'importe quel hébergeur Node.js (Render, Railway, etc.)
ou simplement sur un VPS pour disposer à la fois de l'interface et de l'API.

## Fonctionnement
- Les clients soumettent des demandes (room service, ménage, maintenance, taxi...)
  depuis la page d'accueil.
- Les réceptionnistes gèrent ces demandes en temps réel depuis la page `/admin`.
- Les statuts sont synchronisés via WebSocket.

