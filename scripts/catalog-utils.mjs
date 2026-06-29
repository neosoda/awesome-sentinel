export const CATALOG_VERSION = '2026-06-29'

export const TAXONOMY = [
  {
    slug: 'ia-agents-assistants',
    name: 'IA - Agents et assistants',
    icon: 'AI',
    description: 'Assistants conversationnels, agents autonomes, orchestration de taches et interfaces de chat fondees sur des modeles.',
    keywords: ['agent', 'assistant', 'chatbot', 'chat', 'llm', 'claude', 'openai', 'gemini', 'ollama', 'prompt', 'prompts'],
  },
  {
    slug: 'ia-developpement-code',
    name: 'IA - Developpement et code',
    icon: 'CODE',
    description: 'Outils d aide au developpement logiciel, generation de code, environnements de programmation et automatisation de projets par IA.',
    keywords: ['code', 'coding', 'developer', 'dev', 'ide', 'vscode', 'cursor', 'bolt', 'app builder', 'programming'],
  },
  {
    slug: 'ia-rag-documents',
    name: 'IA - RAG et documents',
    icon: 'RAG',
    description: 'Recherche semantique, bases de connaissances, extraction de documents, assistants documentaires et pipelines RAG.',
    keywords: ['rag', 'document', 'pdf', 'knowledge', 'retrieval', 'vector', 'embedding', 'ocr'],
  },
  {
    slug: 'ia-image-video-design',
    name: 'IA - Image, video et design',
    icon: 'IMG',
    description: 'Generation, edition, analyse ou transformation d images, de videos et de contenus graphiques avec IA.',
    keywords: ['image', 'video', 'design', 'photo', 'stable diffusion', 'comfyui', 'midjourney', 'flux', 'face', 'avatar'],
  },
  {
    slug: 'ia-audio-transcription',
    name: 'IA - Audio et transcription',
    icon: 'AUD',
    description: 'Transcription, synthese vocale, agents vocaux, separation audio, sous-titrage et traitement de la parole.',
    keywords: ['audio', 'voice', 'speech', 'transcription', 'whisper', 'tts', 'stt', 'podcast'],
  },
  {
    slug: 'ia-modeles-evaluation',
    name: 'IA - Modeles et evaluation',
    icon: 'LLM',
    description: 'Catalogues, evaluation, benchmarks, hebergement et experimentation autour des modeles d IA.',
    keywords: ['model', 'models', 'leaderboard', 'benchmark', 'eval', 'hugging face', 'inference', 'dataset'],
  },
  {
    slug: 'developpement-logiciel',
    name: 'Developpement logiciel',
    icon: 'DEV',
    description: 'Frameworks, bibliotheques, SDK, outils CLI, tests, API et environnements utiles aux developpeurs.',
    keywords: ['framework', 'library', 'sdk', 'api', 'cli', 'terminal', 'testing', 'typescript', 'python', 'rust', 'javascript', 'github actions'],
  },
  {
    slug: 'creation-web-cms',
    name: 'Creation web et CMS',
    icon: 'WEB',
    description: 'Creation de sites, CMS, landing pages, formulaires, publication web et outils de contenu.',
    keywords: ['cms', 'website', 'site builder', 'webflow', 'wordpress', 'blog', 'forms', 'form'],
  },
  {
    slug: 'devops-conteneurs',
    name: 'DevOps et conteneurs',
    icon: 'OPS',
    description: 'Conteneurs, CI/CD, deploiement, orchestration, registry, Kubernetes et exploitation applicative.',
    keywords: ['docker', 'kubernetes', 'container', 'compose', 'deploy', 'ci/cd', 'devops', 'portainer', 'helm'],
  },
  {
    slug: 'systemes-infrastructure',
    name: 'Systemes et infrastructure',
    icon: 'SYS',
    description: 'Administration systeme, postes, serveurs, stockage, virtualisation, homelab et maintenance d infrastructure.',
    keywords: ['system', 'sysadmin', 'server', 'linux', 'windows', 'homelab', 'proxmox', 'backup', 'storage', 'monitoring desktop'],
  },
  {
    slug: 'reseaux-acces-distant',
    name: 'Reseaux et acces distant',
    icon: 'NET',
    description: 'VPN, DNS, proxy, tunnels, acces distant, diagnostic reseau et connectivite.',
    keywords: ['network', 'vpn', 'dns', 'proxy', 'tunnel', 'remote', 'ssh', 'tailscale', 'wireguard'],
  },
  {
    slug: 'cybersecurite-osint',
    name: 'Cybersecurite et OSINT',
    icon: 'SEC',
    description: 'Securite offensive et defensive, OSINT, analyse de vulnerabilites, authentification et protection.',
    keywords: ['security', 'cyber', 'osint', 'vulnerability', 'scanner', 'auth', 'sso', 'password', 'hacking', 'forensics', 'iam'],
  },
  {
    slug: 'monitoring-observabilite',
    name: 'Monitoring et observabilite',
    icon: 'MON',
    description: 'Supervision, metriques, logs, traces, alertes, pages de statut et visualisation operationnelle.',
    keywords: ['monitoring', 'observability', 'uptime', 'status page', 'grafana', 'prometheus', 'logs', 'metrics', 'alert'],
  },
  {
    slug: 'donnees-backend',
    name: 'Donnees et backend',
    icon: 'DB',
    description: 'Bases de donnees, backends as a service, stockage, ETL, pipelines, API serveur et outils data.',
    keywords: ['database', 'postgres', 'mysql', 'sqlite', 'backend', 'baas', 'etl', 'data', 'warehouse', 'spreadsheet'],
  },
  {
    slug: 'automatisation-integration',
    name: 'Automatisation et integration',
    icon: 'AUTO',
    description: 'Workflows, integration entre services, scraping, planification, webhooks et automatisation no-code ou code.',
    keywords: ['automation', 'workflow', 'integration', 'webhook', 'scraper', 'scraping', 'crawler', 'zapier', 'n8n'],
  },
  {
    slug: 'productivite-collaboration',
    name: 'Productivite et collaboration',
    icon: 'PROD',
    description: 'Organisation personnelle ou collective, notes, taches, fichiers, communication et collaboration.',
    keywords: ['productivity', 'collaboration', 'task', 'notes', 'calendar', 'email', 'resume', 'meeting', 'files', 'sync'],
  },
  {
    slug: 'documentation-connaissances',
    name: 'Documentation et connaissances',
    icon: 'DOC',
    description: 'Wikis, documentation technique, bases de connaissances, bookmarks, lecture differee et capitalisation.',
    keywords: ['docs', 'documentation', 'wiki', 'knowledge base', 'bookmark', 'read later', 'link', 'notes'],
  },
  {
    slug: 'design-creation',
    name: 'Design et creation',
    icon: 'DES',
    description: 'Design graphique, UI, prototypage, icones, presentations, edition visuelle et ressources creatives.',
    keywords: ['design', 'ui', 'ux', 'icon', 'logo', 'figma', 'prototype', 'presentation'],
  },
  {
    slug: 'multimedia',
    name: 'Multimedia',
    icon: 'MED',
    description: 'Audio, video, streaming, photo, conversion media, lecture, montage et diffusion hors usage IA principal.',
    keywords: ['media', 'multimedia', 'streaming', 'camera', 'video', 'audio', 'music', 'subtitle', 'ffmpeg'],
  },
  {
    slug: 'recherche-veille',
    name: 'Recherche et veille',
    icon: 'SEARCH',
    description: 'Moteurs de recherche, curation, annuaires, veille, tendances, comparaison et decouverte de ressources.',
    keywords: ['search', 'directory', 'trends', 'curated', 'awesome', 'list', 'veille', 'browser', 'compare'],
  },
  {
    slug: 'domotique-iot',
    name: 'Domotique et IoT',
    icon: 'IOT',
    description: 'Maison connectee, capteurs, objets connectes, automatisation domestique et controle local.',
    keywords: ['home assistant', 'iot', 'smart home', 'domotic', 'camera', 'mqtt', 'zigbee'],
  },
  {
    slug: 'ressources-apprentissage',
    name: 'Ressources et apprentissage',
    icon: 'LEARN',
    description: 'Guides, cours, listes de ressources, exemples, supports d apprentissage et collections referencees.',
    keywords: ['learn', 'course', 'tutorial', 'guide', 'awesome', 'examples', 'prompts', 'collection'],
  },
  {
    slug: 'utilitaires',
    name: 'Utilitaires',
    icon: 'UTIL',
    description: 'Outils pratiques transverses qui ne relevent pas clairement d une categorie plus specialisee.',
    keywords: ['toolkit', 'utility', 'converter', 'calculator', 'pdf', 'generator'],
  },
]

export const TAXONOMY_BY_SLUG = new Map(TAXONOMY.map((category) => [category.slug, category]))

export const REMOVED_CATEGORY_SLUGS = new Set([
  'a-verifier',
  'a-voir',
  'a-tester',
  'autre',
  'divers',
  'non-classe',
  'favoris',
  'recommande',
])

const TRACKING_PARAMETER = /^(utm_.+|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|ref|referrer|source|campaign|campaignid|vero_id|yclid)$/i
const GITHUB_REPOSITORY_VIEWS = new Set(['actions', 'issues', 'pulls', 'projects', 'releases', 'security', 'settings', 'tree', 'blob', 'wiki'])

export function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function canonicalizeUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    url.protocol = url.protocol.toLowerCase()
    url.hostname = url.hostname.toLowerCase()
    url.hash = ''
    for (const parameter of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMETER.test(parameter)) url.searchParams.delete(parameter)
    }
    if (url.hostname.replace(/^www\./, '') === 'github.com') {
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments.length >= 2) {
        const owner = segments[0]
        const repo = segments[1].replace(/\.git$/i, '')
        if (segments.length === 2 || GITHUB_REPOSITORY_VIEWS.has(segments[2]?.toLowerCase())) {
          url.pathname = `/${owner}/${repo}`
        }
      }
      if (url.searchParams.get('tab') === 'readme-ov-file') url.searchParams.delete('tab')
    }
    if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) url.port = ''
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '')
    if (!url.search) url.search = ''
    return url.toString()
  } catch {
    return null
  }
}

export function stripTracking(value) {
  return canonicalizeUrl(value) ?? value
}

export function parseGithubRepo(value) {
  const canonical = canonicalizeUrl(value)
  if (!canonical) return null
  const url = new URL(canonical)
  if (url.hostname.replace(/^www\./, '') !== 'github.com') return null
  const [owner, repo] = url.pathname.split('/').filter(Boolean)
  if (!owner || !repo) return null
  return { owner, repo, canonicalUrl: `https://github.com/${owner}/${repo}` }
}

export function normalizeTag(tag) {
  const slug = slugify(tag)
  const aliases = {
    opensource: 'open-source',
    'open-source': 'open-source',
    'open-source-software': 'open-source',
    'open source': 'open-source',
    selfhosted: 'self-hosted',
    'self-hosted': 'self-hosted',
    'self hosted': 'self-hosted',
    commandline: 'cli',
    'command-line': 'cli',
    'command-line-interface': 'cli',
    'github': null,
    'web': null,
    'outil': null,
    'application': null,
    'logiciel': null,
    'interessant': null,
    'a-voir': null,
    'a-verifier': null,
    'intelligence-artificielle': 'ia',
  }
  return Object.prototype.hasOwnProperty.call(aliases, slug) ? aliases[slug] : slug
}

export function normalizeTags(tags) {
  return [...new Set((tags ?? []).map(normalizeTag).filter(Boolean))].slice(0, 8)
}

export function looksGenericDescription(value) {
  const text = String(value ?? '').trim()
  if (!text) return true
  const lower = text.toLowerCase()
  return [
    'github - ',
    'contribute to ',
    'ressource web',
    'please enable cookies',
    'sorry, you have been blocked',
    'the page you are looking for could not be found',
    'file not found',
    'verification de securite',
    'vérification de sécurité',
    'access denied',
    'just a moment',
  ].some((needle) => lower.includes(needle))
}

export function hasEnglishSignals(value) {
  const text = String(value ?? '').toLowerCase()
  const matches = text.match(/\b(the|and|with|for|from|your|you|build|manage|open-source|privacy|powerful|platform|developer|tools)\b/g)
  return (matches?.length ?? 0) >= 3
}

export function detectToolType({ title, url, sourceDescription, tags }) {
  const haystack = `${title} ${url} ${sourceDescription} ${(tags ?? []).join(' ')}`.toLowerCase()
  if (/\b(cli|command line|terminal)\b/.test(haystack)) return 'cli'
  if (/\b(api|sdk|endpoint|inference)\b/.test(haystack)) return 'api'
  if (/\b(library|framework|package|npm|pypi)\b/.test(haystack)) return 'library'
  if (/\b(extension|browser extension|chrome extension|firefox)\b/.test(haystack)) return 'browser_extension'
  if (/\b(desktop|tauri|electron|windows|macos|linux app)\b/.test(haystack)) return 'desktop'
  if (/\b(mobile|android|ios)\b/.test(haystack)) return 'mobile'
  if (/\b(self-hosted|self hosted|docker|kubernetes|helm|compose)\b/.test(haystack)) return 'self_hosted'
  if (/^https?:\/\//.test(url ?? '')) return 'saas'
  return 'other'
}

export function classifyTool(tool) {
  const text = [
    tool.title,
    tool.shortDescription,
    tool.longDescription,
    tool.url,
    ...(tool.tags ?? []),
  ].join(' ').toLowerCase()

  const oldCategoryMap = {
    cybersecurite: 'cybersecurite-osint',
    'infrastructure-et-systemes': 'systemes-infrastructure',
    developpement: 'developpement-logiciel',
    automatisation: 'automatisation-integration',
    reseau: 'reseaux-acces-distant',
    productivite: 'productivite-collaboration',
    multimedia: 'multimedia',
    'services-web': 'creation-web-cms',
    'vie-pratique': 'utilitaires',
    bookmark: 'documentation-connaissances',
    dashboard: 'systemes-infrastructure',
    monitoring: 'monitoring-observabilite',
    devops: 'devops-conteneurs',
    database: 'donnees-backend',
    backend: 'donnees-backend',
    git: 'developpement-logiciel',
    security: 'cybersecurite-osint',
    search: 'recherche-veille',
  }

  let best = null
  let bestScore = 0
  for (const category of TAXONOMY) {
    let score = 0
    for (const keyword of category.keywords) {
      if (text.includes(keyword)) score += keyword.length > 4 ? 2 : 1
    }
    if (score > bestScore) {
      best = category.slug
      bestScore = score
    }
  }

  if (bestScore > 0) return best
  return oldCategoryMap[tool.categorySlug] ?? 'utilitaires'
}

export function buildFrenchDescriptions(tool) {
  const rawTitle = cleanTitle(tool.title)
  const category = TAXONOMY_BY_SLUG.get(tool.categorySlug) ?? TAXONOMY_BY_SLUG.get(classifyTool(tool))
  const description = cleanSourceDescription(tool.sourceDescription || tool.shortDescription || '')
  const typeLabel = tool.type === 'self_hosted' ? 'auto-hebergeable' : tool.type === 'cli' ? 'en ligne de commande' : tool.type === 'saas' ? 'en mode SaaS' : null
  const use = category?.name.toLowerCase() ?? 'outil numerique'

  let shortDescription = description
  if (looksGenericDescription(shortDescription) || hasEnglishSignals(shortDescription) || shortDescription.length < 60) {
    const suffix = typeLabel ? `, utilisable ${typeLabel}` : ''
    shortDescription = `${rawTitle} est un outil de ${use}${suffix}, reference pour ${inferAudience(category?.slug)}.`
  }
  shortDescription = trimSentence(shortDescription, 220)

  const longParts = []
  longParts.push(`${rawTitle} sert principalement a ${inferPurpose(category?.slug)}.`)
  if (description && !looksGenericDescription(description)) longParts.push(`Les informations publiques le presentent comme: ${trimSentence(description, 260)}`)
  if (tool.githubUrl) longParts.push('Le depot public permet de verifier le code source, la licence indiquee et l activite du projet lorsque ces informations sont disponibles.')
  if (tool.websiteUrl && !tool.githubUrl) longParts.push('La fiche s appuie sur le site officiel ou la page publique detectee; les details non verifies restent volontairement limites.')
  if (tool.needsReviewReason) longParts.push(`Une verification humaine reste utile: ${tool.needsReviewReason}.`)

  return {
    shortDescription,
    longDescription: longParts.slice(0, 5).join(' '),
  }
}

export function cleanTitle(value) {
  return String(value ?? '')
    .replace(/\s*[|—-]\s*GitHub.*$/i, '')
    .replace(/\s*[-—]\s*[^/]+\/[^/\s]+$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'Outil sans titre'
}

export function cleanSourceDescription(value) {
  return String(value ?? '')
    .replace(/\s*-\s*[^/\s]+\/[^/\s]+$/i, '')
    .replace(/^GitHub\s*-\s*/i, '')
    .replace(/^Contribute to .+ development.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function trimSentence(value, maxLength) {
  const text = cleanSourceDescription(value)
  if (text.length <= maxLength) return ensureFinalPunctuation(text)
  const clipped = text.slice(0, maxLength - 1)
  const atSpace = clipped.lastIndexOf(' ')
  return ensureFinalPunctuation(`${clipped.slice(0, atSpace > 80 ? atSpace : clipped.length)}...`)
}

function ensureFinalPunctuation(value) {
  const text = String(value ?? '').trim()
  if (!text) return text
  return /[.!?]$/.test(text) ? text : `${text}.`
}

function inferAudience(categorySlug) {
  if (categorySlug?.startsWith('ia-')) return 'les utilisateurs et equipes qui travaillent avec l IA'
  if (categorySlug?.includes('dev')) return 'les developpeurs et equipes techniques'
  if (categorySlug?.includes('cyber')) return 'les equipes securite, administrateurs et analystes'
  if (categorySlug?.includes('productivite')) return 'l organisation personnelle ou collaborative'
  if (categorySlug?.includes('multimedia')) return 'la creation et le traitement de contenus media'
  return 'un usage technique ou professionnel cible'
}

function inferPurpose(categorySlug) {
  const purposes = {
    'ia-agents-assistants': 'creer, utiliser ou comparer des assistants et agents fondes sur des modeles d IA',
    'ia-developpement-code': 'accelerer des taches de developpement logiciel avec des fonctions d IA',
    'ia-rag-documents': 'exploiter des documents ou connaissances avec recherche semantique et generation augmentee',
    'ia-image-video-design': 'generer, transformer ou analyser des contenus visuels',
    'ia-audio-transcription': 'traiter la voix, l audio ou la transcription',
    'ia-modeles-evaluation': 'tester, comparer ou heberger des modeles et jeux de donnees',
    'developpement-logiciel': 'aider la conception, le test, la livraison ou la maintenance de logiciels',
    'creation-web-cms': 'creer, publier ou administrer des sites et contenus web',
    'devops-conteneurs': 'deployer, orchestrer ou exploiter des applications et conteneurs',
    'systemes-infrastructure': 'administrer des systemes, serveurs ou environnements homelab',
    'reseaux-acces-distant': 'gerer la connectivite, les tunnels, le DNS ou les acces distants',
    'cybersecurite-osint': 'auditer, proteger ou investiguer des actifs numeriques',
    'monitoring-observabilite': 'surveiller des services, collecter des signaux et suivre les incidents',
    'donnees-backend': 'gerer des donnees, API, bases ou services backend',
    'automatisation-integration': 'automatiser des workflows et connecter plusieurs services',
    'productivite-collaboration': 'organiser le travail, les documents, les taches ou la collaboration',
    'documentation-connaissances': 'structurer, retrouver ou partager des connaissances',
    'design-creation': 'produire ou preparer des ressources visuelles',
    multimedia: 'gerer, convertir, diffuser ou editer des contenus audio et video',
    'recherche-veille': 'chercher, comparer ou surveiller des ressources et tendances',
    'domotique-iot': 'piloter des objets connectes et automatisations domestiques',
    'ressources-apprentissage': 'apprendre, documenter ou explorer une collection de ressources',
    utilitaires: 'resoudre un besoin pratique transversal',
  }
  return purposes[categorySlug] ?? purposes.utilitaires
}

export function findDuplicateGroups(items) {
  const buckets = new Map()
  for (const item of items) {
    const keys = [
      canonicalizeUrl(item.websiteUrl),
      canonicalizeUrl(item.githubUrl),
      canonicalizeUrl(item.url),
    ].filter(Boolean)
    for (const key of keys) {
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key).push(item)
    }
  }
  return [...buckets.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, tools: group }))
}

export function validateCatalog(items) {
  const issues = []
  const seenSlugs = new Set()
  const canonicalUrls = new Map()
  for (const item of items) {
    if (!item.categorySlug || !TAXONOMY_BY_SLUG.has(item.categorySlug)) issues.push({ slug: item.slug, code: 'invalid-category' })
    if (!item.shortDescription || looksGenericDescription(item.shortDescription) || hasEnglishSignals(item.shortDescription)) issues.push({ slug: item.slug, code: 'weak-description' })
    if (new Set(item.tags ?? []).size !== (item.tags ?? []).length) issues.push({ slug: item.slug, code: 'duplicate-tags' })
    for (const value of [item.websiteUrl, item.githubUrl, item.docsUrl, item.demoUrl]) {
      if (!value) continue
      const canonical = canonicalizeUrl(value)
      if (!canonical) issues.push({ slug: item.slug, code: 'invalid-url', value })
      else if (canonicalUrls.has(canonical)) issues.push({ slug: item.slug, code: 'duplicate-url', value: canonical, duplicateOf: canonicalUrls.get(canonical) })
      else canonicalUrls.set(canonical, item.slug)
    }
    if (seenSlugs.has(item.slug)) issues.push({ slug: item.slug, code: 'duplicate-slug' })
    seenSlugs.add(item.slug)
    if (item.isOpenSource && !item.license) issues.push({ slug: item.slug, code: 'open-source-without-license' })
    if (item.hasDocker && !item.verification?.docker) issues.push({ slug: item.slug, code: 'docker-unverified' })
    if (item.isSelfHosted && !item.verification?.selfHosted) issues.push({ slug: item.slug, code: 'self-hosted-unverified' })
  }
  return issues
}
