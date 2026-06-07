# StackVault

> Catalogue personnel d'outils, applications self-hosted, SaaS et projets open source.

![StackVault](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-externe-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

---

## ✨ Fonctionnalités

- **Catalogue public** avec cartes visuelles, recherche, filtres multiples
- **Fiches détaillées** par outil (liens, badges, tags, score, notes)
- **Pages catégories et tags**
- **Interface admin** protégée par Authentik (SSO)
- **CRUD complet** : outils, catégories, tags
- **Dark mode** premium, responsive mobile
- **Seed** de 12 outils réalistes pour démarrer

---

## 🚀 Installation locale

### Prérequis

- Node.js 20+
- npm
- PostgreSQL accessible (externe)

### 1. Cloner et configurer

```bash
git clone <votre-repo>
cd stackvault

# Copier le fichier d'environnement
cp .env.example .env.local
```

Éditez `.env.local` :
```env
DATABASE_URL="postgresql://user:password@host:5432/stackvault"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAILS="votre@email.com"
AUTHENTIK_EMAIL_HEADER="x-authentik-email"
AUTHENTIK_USERNAME_HEADER="x-authentik-username"
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Prisma — Migrations

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations (création des tables)
npx prisma migrate deploy

# OU en développement (crée et applique une migration)
npx prisma migrate dev --name init
```

### 4. Seed — Données de démonstration

```bash
npx prisma db seed
```

Cela crée :
- 9 catégories
- 21 tags
- 12 outils (Karakeep, Linkwarden, Homepage, Homarr, Uptime Kuma, Portainer, NocoDB, PocketBase, Gitea, Grafana, Authentik, SearXNG)

### 5. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🔒 Protection admin en local

En production, l'admin est protégé par Authentik via des headers HTTP.
En développement, vous pouvez simuler ces headers :

**Option 1 : Extension navigateur ModHeader**
Ajoutez un header `x-authentik-email: votre@email.com`

**Option 2 : Modifier le middleware temporairement**
Commentez la vérification dans `middleware.ts` pour le développement local.

**Option 3 : Variables d'environnement**
Le middleware lit `AUTHENTIK_EMAIL_HEADER` et `ADMIN_EMAILS`.
En local, vous pouvez utiliser un reverse proxy simple (Caddy, nginx) qui ajoute ces headers.

---

## 🐳 Docker

### Build de l'image

```bash
docker build -t stackvault:latest .
```

### Lancer avec docker-compose

```bash
cp docker-compose.example.yml docker-compose.yml
# Éditez docker-compose.yml avec vos variables
docker compose up -d
```

### Migrations en production

```bash
# Avant le premier démarrage ou après chaque déploiement
docker exec stackvault npx prisma migrate deploy

# Seed (une seule fois)
docker exec stackvault npx prisma db seed
```

---

## 🌐 Déploiement sur Coolify

### Variables d'environnement à configurer dans Coolify

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | Connexion PostgreSQL | `postgresql://user:pass@host:5432/stackvault` |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app | `https://stackvault.example.com` |
| `ADMIN_EMAILS` | Emails admin autorisés | `admin@example.com,autre@example.com` |
| `AUTHENTIK_EMAIL_HEADER` | Nom du header email | `x-authentik-email` |
| `AUTHENTIK_USERNAME_HEADER` | Nom du header username | `x-authentik-username` |

### Étapes Coolify

1. **Créer une nouvelle application** depuis votre repo Git
2. **Configurer les variables d'environnement** (voir tableau ci-dessus)
3. **Build command** : `npm run build` (ou Docker build automatique)
4. **Port** : 3000
5. **Après le premier déploiement**, lancer les migrations :
   ```bash
   # Via le terminal Coolify
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 🔐 Configuration Authentik

### Principe de fonctionnement

StackVault ne gère pas d'authentification interne.
Le reverse proxy (Traefik/Caddy/nginx) devant l'application fait passer les requests par Authentik.
Authentik injecte les headers utilisateur après authentification.

### Configuration côté Authentik

1. **Créer un Provider de type "Proxy"** dans Authentik
   - Mode : **Forward auth (single application)**
   - External host : `https://stackvault.example.com`
   - Cocher **"Set HTTP headers"**

2. **Headers injectés par Authentik** (configurés dans le Provider) :
   - `X-authentik-email` → email de l'utilisateur connecté
   - `X-authentik-username` → username Authentik

3. **Créer une Application** dans Authentik liée au Provider

4. **Configurer votre reverse proxy** pour que les routes `/admin/*` passent par Authentik Forward Auth

### Exemple Traefik

```yaml
# Labels sur le conteneur stackvault
labels:
  traefik.enable: "true"
  traefik.http.routers.stackvault.rule: "Host(`stackvault.example.com`)"
  traefik.http.routers.stackvault.middlewares: "authentik@file"
```

### Flux de sécurité

```
Visiteur → /admin/* → Traefik → Authentik (SSO) → Headers injectés → StackVault middleware → Vérification ADMIN_EMAILS
```

Si l'email dans `x-authentik-email` n'est pas dans `ADMIN_EMAILS`, l'accès est refusé (→ `/403`).

---

## 📁 Structure du projet

```
app/
├── (public)/           # Routes publiques (/, /tools, /categories...)
├── admin/              # Routes admin protégées
├── 403/                # Page accès refusé
└── layout.tsx          # Layout racine

components/
├── public/             # Composants publics (ToolCard, FilterPanel, Hero...)
└── admin/              # Composants admin (ToolForm, Sidebar, ConfirmDialog...)

lib/
├── actions/            # Server Actions (tools, categories, tags)
├── validations/        # Schémas Zod
├── prisma.ts           # Client Prisma singleton
└── utils.ts            # Utilitaires (slugify, formatDate, labels...)

prisma/
├── schema.prisma       # Schéma de base de données
└── seed.ts             # Données de démonstration

middleware.ts           # Protection des routes /admin/*
```

---

## 🗄️ Commandes Prisma utiles

```bash
# Générer le client après modification du schema
npx prisma generate

# Créer et appliquer une migration (dev)
npx prisma migrate dev --name ma-migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base (dev uniquement !)
npx prisma migrate reset

# Ouvrir Prisma Studio
npx prisma studio

# Lancer le seed
npx prisma db seed
```

---

## 🛠️ Stack technique

| Technologie | Usage |
|---|---|
| Next.js 14 App Router | Framework full-stack |
| TypeScript strict | Langage |
| Prisma | ORM |
| PostgreSQL | Base de données |
| Tailwind CSS | Styles |
| shadcn/ui | Composants UI |
| Zod | Validation |
| React Hook Form | Formulaires |
| Server Actions | Mutations données |

---

## 📝 Licence

Usage personnel. Adaptez à vos besoins.
