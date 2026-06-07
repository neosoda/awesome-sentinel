import { PrismaClient, ToolType, ToolStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function sanitizeSchemaName(schema: string) {
  return schema.replace(/\\/g, '').replace(/^['"]+|['"]+$/g, '').trim()
}

function normalizeDatabaseUrl(url: string) {
  const parsed = new URL(url)
  const schema = parsed.searchParams.get('schema')

  if (schema) {
    parsed.searchParams.set('schema', sanitizeSchemaName(schema))
  }

  return parsed
}

function createPrismaClient() {
  const rawConnectionString = process.env.DATABASE_URL
  if (!rawConnectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const parsedConnectionString = normalizeDatabaseUrl(rawConnectionString)
  const schema = parsedConnectionString.searchParams.get('schema') ?? undefined
  const connectionString = parsedConnectionString.toString()
  const adapter = new PrismaPg(connectionString, { schema })
  return new PrismaClient({ adapter })
}

const prisma = createPrismaClient()

async function main() {
  console.log('🌱 Seeding Awesome Sentinel database...')

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'bookmark' },
      update: {},
      create: { name: 'Bookmark Manager', slug: 'bookmark', icon: '🔖', description: 'Gestion de signets et liens' },
    }),
    prisma.category.upsert({
      where: { slug: 'dashboard' },
      update: {},
      create: { name: 'Dashboard / Startpage', slug: 'dashboard', icon: '🏠', description: 'Pages de démarrage et tableaux de bord personnels' },
    }),
    prisma.category.upsert({
      where: { slug: 'monitoring' },
      update: {},
      create: { name: 'Monitoring', slug: 'monitoring', icon: '📊', description: 'Supervision, alertes et observabilité' },
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: { name: 'DevOps & Infrastructure', slug: 'devops', icon: '⚙️', description: 'Outils Docker, CI/CD, gestion serveurs' },
    }),
    prisma.category.upsert({
      where: { slug: 'database' },
      update: {},
      create: { name: 'Base de données & No-Code', slug: 'database', icon: '🗄️', description: 'Interfaces base de données, no-code, spreadsheets' },
    }),
    prisma.category.upsert({
      where: { slug: 'backend' },
      update: {},
      create: { name: 'Backend & BaaS', slug: 'backend', icon: '🔌', description: 'Backend as a Service, API, auth' },
    }),
    prisma.category.upsert({
      where: { slug: 'git' },
      update: {},
      create: { name: 'Git & Collaboration', slug: 'git', icon: '🐙', description: 'Hébergement de code, forges Git' },
    }),
    prisma.category.upsert({
      where: { slug: 'security' },
      update: {},
      create: { name: 'Sécurité & Authentification', slug: 'security', icon: '🔒', description: 'IAM, SSO, authentification, VPN' },
    }),
    prisma.category.upsert({
      where: { slug: 'search' },
      update: {},
      create: { name: 'Recherche & Privacy', slug: 'search', icon: '🔍', description: 'Moteurs de recherche, respect de la vie privée' },
    }),
  ])

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))

  // ── Tags ─────────────────────────────────────────────────────────────────────
  const tagSlugs = [
    'docker', 'self-hosted', 'open-source', 'monitoring', 'grafana',
    'database', 'no-code', 'api', 'auth', 'sso', 'git', 'devops',
    'bookmark', 'dashboard', 'privacy', 'search', 'backend', 'typescript',
    'kubernetes', 'security', 'postgresql',
  ]

  const tags = await Promise.all(
    tagSlugs.map((slug) =>
      prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: slug, slug },
      })
    )
  )

  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]))

  // ── Tools ────────────────────────────────────────────────────────────────────
  const toolsData = [
    {
      title: 'Karakeep',
      slug: 'karakeep',
      websiteUrl: 'https://karakeep.app',
      githubUrl: 'https://github.com/karakeep-app/karakeep',
      shortDescription: 'Application de bookmarking intelligente avec IA pour classer et retrouver vos liens.',
      longDescription: `Karakeep est un gestionnaire de marque-pages moderne et auto-hébergeable qui utilise l'IA pour extraire automatiquement le contenu des pages, générer des résumés et faciliter la recherche.

Fonctionnalités principales :
- Sauvegarde automatique du contenu des pages
- Résumés générés par IA
- Recherche full-text
- Organisation par collections et tags
- Interface mobile-friendly`,
      categoryId: catMap['bookmark'],
      type: ToolType.self_hosted,
      license: 'AGPL-3.0',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.tested,
      personalScore: 8,
      isFavorite: false,
      isRecommended: false,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'bookmark'],
    },
    {
      title: 'Linkwarden',
      slug: 'linkwarden',
      websiteUrl: 'https://linkwarden.app',
      githubUrl: 'https://github.com/linkwarden/linkwarden',
      docsUrl: 'https://docs.linkwarden.app',
      shortDescription: 'Gestionnaire de liens collaboratif et auto-hébergeable avec archivage des pages.',
      longDescription: `Linkwarden est une solution open source de gestion de marque-pages qui permet d'archiver, organiser et partager des liens avec d'autres utilisateurs.

Points forts :
- Archivage automatique (screenshot + PDF)
- Collaboration multi-utilisateurs
- Tags et collections
- API REST complète
- Import depuis Raindrop.io, Pocket, etc.`,
      categoryId: catMap['bookmark'],
      type: ToolType.self_hosted,
      license: 'AGPL-3.0',
      pricing: 'Gratuit / Cloud payant',
      status: ToolStatus.recommended,
      personalScore: 9,
      publicNotes: 'Mon principal gestionnaire de liens. Excellent pour la collaboration.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'bookmark', 'postgresql'],
    },
    {
      title: 'Homepage',
      slug: 'homepage',
      websiteUrl: 'https://gethomepage.dev',
      githubUrl: 'https://github.com/gethomepage/homepage',
      docsUrl: 'https://gethomepage.dev/docs',
      shortDescription: 'Dashboard de démarrage moderne et hautement personnalisable avec intégrations services.',
      longDescription: `Homepage est une page de démarrage moderne, rapide et auto-hébergeable. Elle s'intègre avec des centaines de services et affiche des widgets en temps réel.

Caractéristiques :
- Configuration YAML simple
- Plus de 100 intégrations (Sonarr, Portainer, Proxmox…)
- Widgets météo, recherche, statistiques
- Thèmes multiples
- Support Docker labels pour découverte automatique`,
      categoryId: catMap['dashboard'],
      type: ToolType.self_hosted,
      license: 'GPL-3.0',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.recommended,
      personalScore: 9,
      publicNotes: 'Ma page de démarrage principale. Configuration YAML très propre.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'dashboard'],
    },
    {
      title: 'Homarr',
      slug: 'homarr',
      websiteUrl: 'https://homarr.dev',
      githubUrl: 'https://github.com/ajnart/homarr',
      docsUrl: 'https://homarr.dev/docs',
      shortDescription: 'Dashboard moderne avec interface drag-and-drop et intégrations applications media.',
      longDescription: `Homarr est une alternative visuelle à Homepage, avec une interface drag-and-drop intuitive et de nombreuses intégrations pour les médias.

Points forts :
- Interface configurable via UI (pas de YAML)
- Intégrations Sonarr, Radarr, Jellyfin, qBittorrent…
- Authentification built-in
- Thèmes personnalisables
- Partage de boards`,
      categoryId: catMap['dashboard'],
      type: ToolType.self_hosted,
      license: 'MIT',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.tested,
      personalScore: 7,
      isFavorite: false,
      isRecommended: false,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'dashboard'],
    },
    {
      title: 'Uptime Kuma',
      slug: 'uptime-kuma',
      websiteUrl: 'https://uptime.kuma.pet',
      githubUrl: 'https://github.com/louislam/uptime-kuma',
      shortDescription: 'Outil de monitoring uptime auto-hébergeable avec alertes et status pages.',
      longDescription: `Uptime Kuma est une alternative auto-hébergée à services comme UptimeRobot. Il surveille vos services HTTP, TCP, DNS, etc. et envoie des alertes.

Fonctionnalités :
- Monitoring HTTP, TCP, DNS, Docker
- Status pages publiques personnalisables
- Alertes multi-canaux (Telegram, Slack, Email, Gotify…)
- Historique des incidents
- Interface moderne`,
      categoryId: catMap['monitoring'],
      type: ToolType.self_hosted,
      license: 'MIT',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.recommended,
      personalScore: 10,
      publicNotes: 'Incontournable. Simple, efficace, beau. Je ne peux plus m\'en passer.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'monitoring'],
    },
    {
      title: 'Portainer',
      slug: 'portainer',
      websiteUrl: 'https://portainer.io',
      githubUrl: 'https://github.com/portainer/portainer',
      docsUrl: 'https://docs.portainer.io',
      demoUrl: 'https://demo.portainer.io',
      shortDescription: 'Interface web de gestion Docker et Kubernetes. Essentiel pour administrer vos conteneurs.',
      longDescription: `Portainer est l'outil de référence pour gérer vos environnements Docker et Kubernetes via une interface web conviviale.

Fonctionnalités :
- Gestion des conteneurs, images, volumes, réseaux
- Support Docker Standalone, Swarm, Kubernetes
- Gestion des stacks (docker-compose)
- Contrôle d'accès basé sur les rôles
- Templates d'applications
- Portainer Agent pour gestion distante`,
      categoryId: catMap['devops'],
      type: ToolType.self_hosted,
      license: 'Zlib (CE) / Commercial (EE)',
      pricing: 'Gratuit (Community) / Business',
      status: ToolStatus.recommended,
      personalScore: 9,
      publicNotes: 'Utilisé quotidiennement pour gérer mes conteneurs Docker.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'devops', 'kubernetes'],
    },
    {
      title: 'NocoDB',
      slug: 'nocodb',
      websiteUrl: 'https://nocodb.com',
      githubUrl: 'https://github.com/nocodb/nocodb',
      docsUrl: 'https://docs.nocodb.com',
      demoUrl: 'https://www.nocodb.com/demos',
      shortDescription: 'Alternative open source à Airtable. Transformez n\'importe quelle base de données en tableur collaboratif.',
      longDescription: `NocoDB transforme PostgreSQL, MySQL, SQLite et MariaDB en une interface de type spreadsheet avec API REST automatique.

Fonctionnalités clés :
- Interface tableur collaborative
- API REST et GraphQL auto-générées
- Vues : Grille, Galerie, Formulaire, Kanban, Calendrier
- Webhooks et automatisations
- Authentification et contrôle d'accès`,
      categoryId: catMap['database'],
      type: ToolType.self_hosted,
      license: 'AGPL-3.0',
      pricing: 'Gratuit / Cloud payant',
      status: ToolStatus.tested,
      personalScore: 8,
      isFavorite: false,
      isRecommended: false,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'database', 'no-code', 'api'],
    },
    {
      title: 'PocketBase',
      slug: 'pocketbase',
      websiteUrl: 'https://pocketbase.io',
      githubUrl: 'https://github.com/pocketbase/pocketbase',
      docsUrl: 'https://pocketbase.io/docs',
      shortDescription: 'Backend open source en un seul binaire Go : base de données, auth, stockage, temps réel.',
      longDescription: `PocketBase est un backend complet sous forme d'un unique fichier exécutable écrit en Go. Il inclut SQLite, authentification, stockage de fichiers et subscriptions temps réel.

Points forts :
- Déploiement ultra-simple (un seul binaire)
- Admin UI intégrée
- SDK JavaScript et Dart
- Extensible via hooks Go
- Idéal pour petits projets / MVPs`,
      categoryId: catMap['backend'],
      type: ToolType.self_hosted,
      license: 'MIT',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.tested,
      personalScore: 9,
      publicNotes: 'Parfait pour les projets rapides. Déploiement en 30 secondes.',
      isFavorite: true,
      isRecommended: false,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['self-hosted', 'open-source', 'backend', 'api', 'database'],
    },
    {
      title: 'Gitea',
      slug: 'gitea',
      websiteUrl: 'https://gitea.io',
      githubUrl: 'https://github.com/go-gitea/gitea',
      docsUrl: 'https://docs.gitea.io',
      shortDescription: 'Forge Git légère et auto-hébergeable. Alternative simple à GitHub/GitLab.',
      longDescription: `Gitea est une forge Git légère écrite en Go, facile à déployer et à administrer. C'est une excellente alternative auto-hébergée à GitHub.

Fonctionnalités :
- Repos Git, Issues, Pull Requests, Wiki
- CI/CD via Gitea Actions (compatible GitHub Actions)
- Packages registry (npm, Docker, Maven…)
- Authentification OAuth2/OIDC
- Organisation et équipes`,
      categoryId: catMap['git'],
      type: ToolType.self_hosted,
      license: 'MIT',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.recommended,
      personalScore: 9,
      publicNotes: 'Ma forge Git personnelle. Léger, rapide, complet.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'git', 'devops'],
    },
    {
      title: 'Grafana',
      slug: 'grafana',
      websiteUrl: 'https://grafana.com',
      githubUrl: 'https://github.com/grafana/grafana',
      docsUrl: 'https://grafana.com/docs',
      shortDescription: 'Plateforme de visualisation et observabilité. Tableaux de bord métriques, logs et traces.',
      longDescription: `Grafana est la référence pour la visualisation de métriques, logs et traces. Il s'intègre avec Prometheus, InfluxDB, Loki, Elasticsearch et bien d'autres.

Fonctionnalités phares :
- Dashboards interactifs et partageables
- Alerting puissant
- Data sources : Prometheus, Loki, InfluxDB, PostgreSQL…
- Plugins communauté
- Grafana Cloud disponible`,
      categoryId: catMap['monitoring'],
      type: ToolType.self_hosted,
      license: 'AGPL-3.0',
      pricing: 'Gratuit / Cloud payant',
      status: ToolStatus.recommended,
      personalScore: 10,
      publicNotes: 'L\'outil de monitoring indispensable. Couplé à Prometheus + Loki = stack parfaite.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'monitoring', 'grafana'],
    },
    {
      title: 'Authentik',
      slug: 'authentik',
      websiteUrl: 'https://goauthentik.io',
      githubUrl: 'https://github.com/goauthentik/authentik',
      docsUrl: 'https://docs.goauthentik.io',
      shortDescription: 'Fournisseur d\'identité open source : SSO, OIDC, SAML, proxy authentication.',
      longDescription: `Authentik est une solution IAM (Identity and Access Management) moderne et auto-hébergeable. Il joue le rôle de fournisseur d'identité (SSO) pour toutes vos applications.

Cas d'usage :
- SSO via OIDC, SAML 2.0, OAuth2
- Proxy authentication (protège apps sans auth propre)
- MFA (TOTP, WebAuthn)
- Gestion utilisateurs et groupes
- Flows personnalisables`,
      categoryId: catMap['security'],
      type: ToolType.self_hosted,
      license: 'MIT',
      pricing: 'Gratuit / Enterprise',
      status: ToolStatus.recommended,
      personalScore: 10,
      publicNotes: 'Mon fournisseur SSO central. Protège toutes mes applications via reverse proxy.',
      isFavorite: true,
      isRecommended: true,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'auth', 'sso', 'security'],
    },
    {
      title: 'SearXNG',
      slug: 'searxng',
      websiteUrl: 'https://searxng.org',
      githubUrl: 'https://github.com/searxng/searxng',
      docsUrl: 'https://docs.searxng.org',
      shortDescription: 'Méta-moteur de recherche open source respectueux de la vie privée. Agrège les résultats de 70+ sources.',
      longDescription: `SearXNG est un fork de SearX, un méta-moteur de recherche respectueux de la vie privée. Il agrège les résultats de nombreux moteurs de recherche sans tracker les utilisateurs.

Avantages :
- Pas de tracking, pas de publicité
- Plus de 70 sources configurables
- Interface moderne et personnalisable
- Résultats de Google, Bing, DuckDuckGo, etc.
- API JSON disponible
- Support des proxies`,
      categoryId: catMap['search'],
      type: ToolType.self_hosted,
      license: 'AGPL-3.0',
      pricing: 'Gratuit / Open Source',
      status: ToolStatus.tested,
      personalScore: 8,
      publicNotes: 'Mon moteur de recherche privé. Très configurable.',
      isFavorite: false,
      isRecommended: false,
      isSelfHosted: true,
      hasDocker: true,
      isOpenSource: true,
      tags: ['docker', 'self-hosted', 'open-source', 'search', 'privacy'],
    },
  ]

  for (const toolData of toolsData) {
    const { tags: toolTagSlugs, ...data } = toolData

    await prisma.tool.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        tags: {
          create: toolTagSlugs
            .filter((slug) => tagMap[slug])
            .map((slug) => ({ tagId: tagMap[slug] })),
        },
      },
    })
    console.log(`  ✓ ${data.title}`)
  }

  console.log('\n✅ Seed terminé !')
  console.log(`   ${toolsData.length} outils créés`)
  console.log(`   ${categories.length} catégories créées`)
  console.log(`   ${tags.length} tags créés`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
