# Awesome Sentinel

<p align="center">
  <img src="public/logo.png" alt="Awesome Sentinel logo" width="112" />
</p>

<h3 align="center">Catalogue moderne d'outils self-hosted, SaaS et projets open source.</h3>

<p align="center">
  <a href="https://awesome.techsentinel.fr"><strong>Ouvrir la demo</strong></a>
  ·
  <a href="#installation-locale">Installation</a>
  ·
  <a href="#deploiement">Deploiement</a>
  ·
  <a href="#configuration">Configuration</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.7-black?logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111827">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-ready-4169E1?logo=postgresql&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white">
</p>

![Awesome Sentinel screenshot](public/docs/awesome-sentinel-screenshot.png)

## Apercu

Awesome Sentinel est une application Next.js pour repertorier, filtrer et administrer un catalogue personnel d'outils. Elle est concue pour un usage homelab, veille technique ou portail interne : interface publique pour explorer les outils, espace admin protege pour maintenir les donnees, base PostgreSQL externe et image Docker prete pour Coolify.

### Ce que l'application couvre

| Zone | Details |
|---|---|
| Catalogue public | Recherche, filtres, categories, tags, fiches outil detaillees |
| Donnees | PostgreSQL, Prisma 7, seed de demonstration |
| Administration | CRUD outils, categories et tags |
| Securite | Acces admin protege par headers Authentik / reverse proxy |
| Deploiement | Docker standalone Next.js, boot Prisma automatise, support schema PostgreSQL custom |

## Experience produit

<details open>
<summary><strong>Fonctionnalites principales</strong></summary>

- Page d'accueil avec compteur dynamique, recommandations, categories et ajouts recents.
- Catalogue filtrable par recherche, categorie, type, statut, Docker, open source et self-hosted.
- Fiches detaillees avec URLs, score personnel, notes, badges et tags.
- Pages dediees aux categories et tags.
- Back-office admin pour gerer les outils, categories et tags.
- Seed initial avec des outils concrets : Linkwarden, Homepage, Uptime Kuma, Portainer, Grafana, Authentik, SearXNG, etc.

</details>

<details>
<summary><strong>Parcours admin</strong></summary>

L'application ne gere pas de session utilisateur interne. Elle attend que le reverse proxy authentifie l'utilisateur via Authentik et transmette un header email. Le middleware compare ensuite cet email a la liste `ADMIN_EMAILS`.

Flux simplifie :

```mermaid
flowchart LR
  A[Visiteur] --> B[Reverse proxy]
  B --> C{Route /admin ?}
  C -- Non --> D[Pages publiques]
  C -- Oui --> E[Authentik]
  E --> F[Headers utilisateur]
  F --> G[Middleware Next.js]
  G --> H{Email autorise ?}
  H -- Oui --> I[Admin]
  H -- Non --> J[403]
```

</details>

<details>
<summary><strong>Architecture technique</strong></summary>

```mermaid
flowchart TB
  U[Utilisateur] --> RP[Reverse proxy / Coolify]
  RP --> N[Next.js 16 App Router]
  N --> SA[Server Actions]
  SA --> P[Prisma Client + adapter-pg]
  P --> DB[(PostgreSQL)]
  N --> M[Middleware admin]
  RP --> A[Authentik]
  A --> M
```

</details>

## Stack

| Brique | Version / role |
|---|---|
| Next.js | 16.2.7, App Router, output standalone |
| React | 19.2 |
| TypeScript | Typage strict |
| Prisma | 7.8 avec `@prisma/adapter-pg` |
| PostgreSQL | Base externe, schema custom possible |
| Tailwind CSS | Styles globaux et UI responsive |
| Zod | Validation des formulaires |
| React Hook Form | Formulaires admin |
| Docker | Image multi-stage pour production |

## Installation Locale

### Prerequis

- Node.js 20+
- npm
- PostgreSQL accessible

### 1. Installer les dependances

```bash
npm install
```

### 2. Configurer l'environnement

Copiez le fichier d'exemple puis adaptez les valeurs :

```bash
cp .env.example .env.local
```

Exemple :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/postgres?schema=awesome"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAILS="admin@example.com"
AUTHENTIK_EMAIL_HEADER="x-authentik-email"
AUTHENTIK_USERNAME_HEADER="x-authentik-username"
```

### 3. Preparer la base

Le projet utilise `prisma db push` pour synchroniser le schema, car aucune migration SQL versionnee n'est encore presente.

```bash
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Deploiement

### Docker

```bash
docker build -t awesome-sentinel:latest .
docker run --rm -p 3000:3000 --env-file .env.local awesome-sentinel:latest
```

Au demarrage, `start.sh` effectue les etapes suivantes :

1. Verifie que `DATABASE_URL` est definie.
2. Cree le schema PostgreSQL indique par `?schema=...` si necessaire.
3. Execute `npx prisma db push --accept-data-loss`.
4. Lance le seed si `prisma/seed.js` est present.
5. Demarre le serveur Next.js standalone.

### Coolify

Variables minimales :

| Variable | Exemple |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/postgres?schema=awesome` |
| `NEXT_PUBLIC_APP_URL` | `https://awesome.example.com` |
| `ADMIN_EMAILS` | `admin@example.com` |
| `AUTHENTIK_EMAIL_HEADER` | `x-authentik-email` |
| `AUTHENTIK_USERNAME_HEADER` | `x-authentik-username` |

Points importants :

- Le port expose par l'application est `3000`.
- Le build Docker compile le seed TypeScript en `prisma/seed.js`.
- Le schema PostgreSQL peut etre `public` ou un schema dedie comme `awesome`.
- Evitez les guillemets dans le parametre `schema` si possible : preferez `?schema=awesome`.

## Configuration

### Authentik

Authentik doit injecter au minimum un header email sur les routes admin :

```http
x-authentik-email: admin@example.com
x-authentik-username: admin
```

`ADMIN_EMAILS` accepte plusieurs emails separes par des virgules :

```env
ADMIN_EMAILS="admin@example.com,ops@example.com"
```

### PostgreSQL

Awesome Sentinel fonctionne avec une base PostgreSQL existante. Deux schemas courants :

```env
# Schema public dans une base dediee
DATABASE_URL="postgresql://user:password@host:5432/awesome_sentinel?schema=public"

# Schema dedie dans une base partagee
DATABASE_URL="postgresql://user:password@host:5432/postgres?schema=awesome"
```

## Commandes Utiles

| Commande | Usage |
|---|---|
| `npm run dev` | Lancer le serveur de developpement |
| `npm run build` | Compiler l'application production |
| `npm run start` | Lancer Next.js en mode production local |
| `npm run lint` | Verifier ESLint |
| `npx prisma validate` | Valider le schema Prisma |
| `npx prisma db push --accept-data-loss` | Synchroniser la base |
| `npx prisma db seed` | Charger les donnees de demo |
| `npx prisma studio` | Ouvrir Prisma Studio |

## Structure

```text
app/
  (public)/          Routes publiques
  admin/             Back-office protege
  403/               Acces refuse
components/
  public/            Cartes, filtres, navbar, hero
  admin/             Formulaires et vues admin
lib/
  actions/           Server Actions
  validations/       Schemas Zod
  prisma.ts          Client Prisma adapter-pg
prisma/
  schema.prisma      Modele de donnees
  seed.ts            Donnees de demonstration
  ensure-schema.js   Bootstrap schema PostgreSQL
public/
  docs/              Assets du README
```

## Verification

Avant de pousser une modification importante :

```bash
npm run build
npx prisma validate
npm run lint
npm run typecheck
```

## Licence

Projet personnel. Reutilisation et adaptation libres selon vos besoins internes.
