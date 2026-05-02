# Système de Réservation de DataShow

Une application web complète pour la gestion des réservations de DataShow dans les établissements d'enseignement. Ce projet dispose d'un backend robuste avec NestJS et d'un frontend moderne avec React.

## 🚀 Fonctionnalités

- **Tableau de Bord Admin** : Statistiques en temps réel, gestion de l'inventaire et suivi des salles.
- **Portail Professeur** : Vue de l'emploi du temps hebdomadaire, réservation facile de DataShow et signalement de pannes.
- **Analyses Dynamiques** : Suivi en temps réel des réservations et de l'état du matériel.
- **Design Responsif** : Barre latérale pliable et interfaces adaptées aux mobiles.
- **Flux Automatisés** : Mise à jour automatique du statut du matériel lors des réparations.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend** : NestJS, MongoDB (Mongoose), Passport.js (Authentification JWT).
- **Base de données** : MongoDB.

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local ou Atlas)

---

## ⚙️ Installation et Configuration

### 1. Cloner le dépôt
```bash
git clone https://github.com/ZeinebMkaouar/datashow-reservation.git
cd datashow-reservation
```

### 2. Configuration du Backend
1. Naviguez vers le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` dans le dossier `backend` :
   ```env
   MONGO_URI=mongodb://localhost:27017/datashow-db
   JWT_SECRET=votre_cle_secrete_ultra_securisee
   ```
4. Démarrez le serveur backend :
   ```bash
   npm run start:dev
   ```
   Le backend sera accessible sur `http://localhost:3000`.

### 3. Configuration du Frontend
1. Naviguez vers le dossier frontend :
   ```bash
   cd ../frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
   Le frontend sera accessible sur `http://localhost:5173`.

---

## 🔑 Comptes par Défaut (Si données initiales utilisées)

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **Professeur** | `prof@example.com` | `prof123` |

---

## 📂 Structure du Projet

```
datashow-reservation/
├── backend/                # Application NestJS
│   ├── src/
│   │   ├── auth/           # Logique d'authentification
│   │   ├── datashows/      # Gestion du matériel
│   │   ├── reservations/   # Logique de réservation
│   │   └── ...
│   └── .env                # Variables d'environnement
└── frontend/               # Application React
    ├── src/
    │   ├── components/     # Composants UI réutilisables
    │   ├── pages/          # Vues Admin et Professeur
    │   ├── services/       # Communication API
    │   └── ...
    └── tailwind.config.js  # Configuration du style
```

## 📄 Licence
Ce projet est sous licence MIT.
