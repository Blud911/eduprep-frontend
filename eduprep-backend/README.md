# EduPrep CI — Backend API

Serveur Node.js/Express pour l'application EduPrep CI, plateforme de préparation de cours IA pour enseignants ivoiriens.

## Stack technique

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : PostgreSQL (Render)
- **IA** : Anthropic Claude API
- **Auth** : JWT (access + refresh tokens)
- **Déploiement** : Render.com (Web Service)

## Structure

```
eduprep-backend/
├── server.js              ← Point d'entrée
├── db/
│   ├── pool.js            ← Connexion PostgreSQL
│   └── schema.sql         ← Schéma complet + données initiales
├── middleware/
│   ├── auth.js            ← Vérification JWT
│   └── subscription.js    ← Vérification abonnement + quotas
├── routes/
│   ├── auth.js            ← Inscription, connexion, profil
│   ├── subscriptions.js   ← Abonnements Wave/OM/MTN
│   ├── ai.js              ← Proxy Claude API (fiches, devoirs, corrigés)
│   ├── content.js         ← CRUD fiches, devoirs, banque questions
│   ├── admin.js           ← Tableau de bord admin
│   └── programmes.js      ← Référentiel MENA
└── scripts/
    └── initDb.js          ← Initialisation base de données
```

## Installation locale

```bash
# 1. Cloner et installer
git clone https://github.com/ton-compte/eduprep-backend.git
cd eduprep-backend
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 3. Initialiser la base de données
npm run db:init

# 4. Démarrer en développement
npm run dev
```

## Déploiement sur Render

1. Créer un **Web Service** sur Render
   - Build command : `npm install`
   - Start command : `node server.js`
   - Environment : Node

2. Créer une **PostgreSQL Database** sur Render
   - Copier l'URL de connexion dans la variable `DATABASE_URL`

3. Configurer toutes les variables d'environnement dans Render Dashboard

4. Initialiser la base (une seule fois) :
   ```bash
   # Via la console Render ou en local avec DATABASE_URL de prod
   npm run db:init
   ```

## Endpoints principaux

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription (7 jours d'essai) |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Renouveler le token |
| GET | `/api/auth/me` | Profil + abonnement |
| PUT | `/api/auth/profile` | Modifier le profil |
| POST | `/api/auth/logout` | Déconnexion |

### Abonnements (Wave / Orange Money / MTN)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/subscriptions/plans` | Plans disponibles |
| GET | `/api/subscriptions/my` | Mon abonnement |
| POST | `/api/subscriptions/request` | Soumettre un paiement |
| GET | `/api/subscriptions/history` | Historique paiements |
| POST | `/api/subscriptions/admin/confirm/:id` | *(Admin)* Confirmer |
| POST | `/api/subscriptions/admin/reject/:id` | *(Admin)* Rejeter |
| GET | `/api/subscriptions/admin/pending` | *(Admin)* Paiements en attente |

### IA (Claude API)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/ai/fiche` | Générer une fiche de cours |
| POST | `/api/ai/devoir` | Générer un devoir + corrigé |
| POST | `/api/ai/corrige` | Générer le corrigé d'un devoir |
| POST | `/api/ai/variantes` | Générer variantes différenciées |

### Contenu
| Méthode | Route | Description |
|---------|-------|-------------|
| GET/POST | `/api/content/fiches` | Lister / Créer fiches |
| GET/PUT/DELETE | `/api/content/fiches/:id` | Fiche par ID |
| GET/POST | `/api/content/devoirs` | Lister / Créer devoirs |
| GET/DELETE | `/api/content/devoirs/:id` | Devoir par ID |
| GET | `/api/content/banque` | Banque de questions |
| GET | `/api/content/notifications` | Notifications |

### Programmes MENA
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/programmes` | Référentiel par matière/classe |
| GET | `/api/programmes/matieres` | Liste des matières |
| GET | `/api/programmes/classes` | Niveaux disponibles |

## Plans tarifaires

| Plan | Prix/mois | Fiches | Devoirs |
|------|-----------|--------|---------|
| Trial | Gratuit (7j) | 5 | 3 |
| Starter | 1 000 FCFA | 20 | 10 |
| Pro | 2 500 FCFA | Illimité | Illimité |
| Établissement | 15 000 FCFA | Illimité (20 profs) | Illimité |

## Sécurité

- Helmet.js pour les headers HTTP
- CORS restreint au domaine frontend
- Rate limiting global (200 req/15min) + strict sur l'IA (10 req/min)
- JWT avec rotation des refresh tokens
- Mots de passe hashés bcrypt (coût 12)
- Clé API Claude côté serveur uniquement (jamais exposée au frontend)
