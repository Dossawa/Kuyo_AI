// FICHIER: README.md (Documentation mise à jour)
// ==============================================

# 🚀 KUYO - Assistant Citoyen IA Révolutionnaire

## 📋 Vue d'ensemble

KUYO est un assistant IA nouvelle génération conçu spécifiquement pour les services publics ivoiriens. Cette version 2.0 présente une architecture modulaire, des animations fluides et une expérience utilisateur exceptionnelle.

## ✨ Fonctionnalités

### 🎯 Core Features
- **Assistant IA Intelligent** : Réponses contextuelles via Gemini AI
- **Recherche Sémantique** : Intégration Weaviate pour la base documentaire
- **Sessions Multiples** : Gestion avancée des conversations
- **Thème Adaptatif** : Mode sombre/clair avec détection système

### 🎨 Interface Moderne
- **Animations Fluides** : Transitions et effets visuels premium
- **Système de Particules** : Arrière-plan interactif et réactif
- **Responsive Design** : Optimisation mobile et desktop
- **Glassmorphism** : Effets de verre dépoli modernes

### 🎛️ Fonctionnalités Avancées
- **Reconnaissance Vocale** : Interaction mains-libres en français
- **Raccourcis Clavier** : Navigation optimisée power-user
- **Notifications Toast** : Feedback visuel intelligent
- **Monitoring Performance** : Métriques temps réel

## 🏗️ Architecture

### 📁 Structure du Projet
```
src/
├── components/          # Composants React modulaires
│   ├── auth/           # Authentification
│   ├── chat/           # Interface de chat
│   ├── sidebar/        # Navigation et sessions
│   ├── common/         # Composants partagés
│   └── layout/         # Layouts principaux
├── services/           # Services et APIs
│   ├── api/            # Services externes
│   └── kuyoService.js  # Service principal
├── hooks/              # Hooks personnalisés
├── config/             # Configuration centralisée
├── utils/              # Fonctions utilitaires
└── styles/             # Styles globaux
```

### 🔧 Technologies Utilisées
- **React 18** avec Hooks avancés
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **API Google Gemini** pour l'IA
- **Weaviate** pour la recherche vectorielle

## 🚀 Installation et Configuration

### 1. Installation des dépendances
```bash
npm install
# ou
yarn install
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_GEMINI_API_KEY=votre_clé_gemini
NEXT_PUBLIC_WEAVIATE_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_USE_GEMINI=true
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### 3. Démarrage du serveur de développement
```bash
npm start
# ou
yarn start
```

## 🎮 Utilisation

### Raccourcis Clavier
- `Ctrl + N` : Nouvelle session
- `Ctrl + Enter` : Envoyer message
- `Ctrl + /` : Afficher l'aide

### Fonctionnalités Vocales
1. Cliquez sur l'icône micro 🎤
2. Parlez clairement en français
3. Le texte apparaît automatiquement

### Sessions Multiples
- Créez des sessions thématiques
- Historique persistant en localStorage
- Édition des titres de session

## 🔒 Sécurité

- Variables d'environnement pour les API keys
- Validation des entrées utilisateur
- Gestion sécurisée des sessions
- Protection contre les injections

## 📊 Monitoring et Performance

### Métriques Surveillées
- Temps de réponse API
- Utilisation mémoire
- Temps de rendu composants
- Santé des services externes

### Optimisations
- Lazy loading des composants
- Debouncing des requêtes
- Cache intelligent des mots-clés
- Nettoyage automatique des sessions

## 🎨 Personnalisation

### Thèmes
```javascript
// Basculement automatique
const { toggleTheme } = useTheme();

// Application manuel
const { setTheme } = useTheme();
setTheme('dark'); // ou 'light'
```

### Animations
```javascript
// Contrôle des animations
const { animateIn, animateOut } = useAnimations();
```

## 📱 Progressive Web App

- Installation sur mobile/desktop
- Fonctionnement hors-ligne partiel
- Notifications push (à venir)
- Manifest.json optimisé

## 🧪 Tests et Debug

### Mode Debug
Activez `NEXT_PUBLIC_DEBUG=true` pour :
- Logs détaillés dans la console
- Informations de performance
- Panel de debug en bas à gauche

### Monitoring Santé
L'application surveille automatiquement :
- Connectivité Weaviate
- Disponibilité Gemini
- Performance globale

## 📈 Roadmap

### Version 2.1 (Prochaine)
- [ ] Historique cloud synchronisé
- [ ] Partage de sessions
- [ ] Export PDF des conversations
- [ ] Thèmes personnalisés

### Version 2.2
- [ ] Plugin système
- [ ] API publique
- [ ] Multi-langues
- [ ] Analytics avancés

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créez une branche feature
3. Respectez l'architecture modulaire
4. Ajoutez des tests si nécessaire
5. Soumettez une Pull Request

### Standards de Code
- ESLint + Prettier configurés
- Convention de nommage camelCase
- Composants fonctionnels uniquement
- Hooks personnalisés pour la logique

## 📞 Support

- 📧 Email : support@kuyo.ci
- 📖 Documentation : /docs
- 🐛 Issues : GitHub Issues
- 💬 Discussions : GitHub Discussions

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**KUYO** - Révolutionnant l'accès aux services publics ivoiriens grâce à l'IA ! 🇨🇮✨