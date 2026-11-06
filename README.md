# MetricFlow — Dashboard de Monitoring API en Temps Réel

Interface web légère permettant de visualiser la disponibilité, le trafic et la latence d'endpoints HTTP en temps réel. Le projet a été développé en JavaScript natif (Vanilla ES6+) afin de travailler directement sur les APIs du navigateur, la manipulation du DOM et la gestion d'état côté client sans dépendre d'un framework externe.

## Démo en ligne
[Tester l'application en direct](https://metricflow-dashboard-zeta.vercel.app/)

## Choix techniques et architecture
- **JavaScript ES6+ :** Utilisation de l'API Fetch asynchrone (`async/await`), gestion des collections de données, et manipulation du DOM sans framework.
- **Chart.js :** Rendu fluide des séries temporelles de latence via l'élément HTML5 `<canvas>`.
- **CSS natif :** Layout structuré avec CSS Grid et Flexbox, gestion d'un thème clair/sombre persistant via des variables CSS et `localStorage`.
- **Vite :** Bundler léger assurant un environnement de développement rapide et un build optimisé.

## Fonctionnalités
- Simulation d'un flux asynchrone de requêtes avec calcul dynamique des métriques clés (taux de disponibilité, requêtes globales, latence moyenne).
- Visualisation graphique de la latence mise à jour à chaque cycle de données.
- Filtrage instantané du journal d'activité selon le code statut HTTP (200 OK vs erreurs 4xx/5xx).
- Persistance des préférences d'affichage (thème sombre/clair) dans le navigateur.

## Installation locale

1. Cloner le dépôt :
```bash
git clone [https://github.com/RedaCode404/metricflow-dashboard.git](https://github.com/RedaCode404/metricflow-dashboard.git)
cd metricflow-dashboard