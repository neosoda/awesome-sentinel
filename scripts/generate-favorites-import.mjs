import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = join(projectRoot, '_A IMPORTER', 'output', 'tous_les_favoris.json')
const outputPath = join(projectRoot, 'prisma', 'data', 'favorites.json')

const SENSITIVE_PARAMETER =
  /^(access_token|id_token|refresh_token|token|api[_-]?key|key|secret|client_secret|authorization|auth|code|jwt|session)$/i
const TRACKING_PARAMETER =
  /^(utm_.+|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|ref|referrer|source|campaign|campaignid|vero_id|yclid)$/i
const GENERIC_DESCRIPTION =
  /(les informations disponibles ne permettent pas|lien est conservé pour vérification|favori à examiner|page not found|just a moment|checking your browser|enable javascript and cookies)/i
const GITHUB_REPOSITORY_VIEWS = new Set([
  'actions',
  'issues',
  'pulls',
  'projects',
  'releases',
  'security',
  'settings',
])
const GITHUB_RESERVED_NAMES = new Set([
  'about',
  'apps',
  'collections',
  'customer-stories',
  'enterprise',
  'features',
  'marketplace',
  'new',
  'organizations',
  'orgs',
  'pricing',
  'search',
  'security',
  'settings',
  'sponsors',
  'topics',
  'trending',
])
const GENERIC_TITLE = /^(404|home|accueil|page not found|site not found|maintenance)$/i

const CATEGORY_RULES = [
  {
    category: 'Intelligence artificielle',
    tag: 'ia',
    patterns: [
      /\b(ai|artificial intelligence|intelligence artificielle|machine learning|deep learning)\b/i,
      /\b(llms?|ollama|openrouter|hugging ?face|transformers?|embedding|rag|vector store|notebook ?lm)\b/i,
      /\b(agentic|ai agents?|agents? ia|chatbot|copilot|prompts?|diffusion|comfyui)\b/i,
      /\b((?:autonomous|coding|web|gui|voice|research) agents?|natural language|ocr|computer vision|machine translation)\b/i,
      /\b(text[- ]to[- ](?:image|video|speech)|image generation|video generation|speech to text|transcription)\b/i,
    ],
  },
  {
    category: 'Cybersécurité',
    tag: 'cybersecurite',
    patterns: [
      /\b(cyber(?:security|sécurité)?|sécurité informatique|information security|vulnerabilit|vulnerability|cve|pentest|hacking|malware)\b/i,
      /\b(security (?:scanner|tool|platform|monitoring)|honeypot|honey tokens?|credential recovery)\b/i,
      /\b(osint|forensic|threat|firewall|zero trust|secret scanning|container security)\b/i,
      /\b(authentication|authentification|iam|sso|oauth|passkey|password|2fa|mfa|privacy[- ]focused|privacy tool)\b/i,
    ],
  },
  {
    category: 'Infrastructure et systèmes',
    tag: 'infrastructure',
    patterns: [
      /\b(docker|container|kubernetes|k8s|proxmox|virtuali[sz]ation|hypervisor|homelab)\b/i,
      /\b(self[- ]host|auto[- ]héberg|server|serveur|sysadmin|linux|windows|terminal)\b/i,
      /\b(monitoring|observability|supervision|uptime|backup|sauvegarde|storage|stockage)\b/i,
      /\b(devops|ci\/cd|deployment|déploiement|infrastructure as code|ansible|terraform)\b/i,
    ],
  },
  {
    category: 'Développement',
    tag: 'developpement',
    patterns: [
      /\b(developer tools?|outils? développeur|software development|web development|programming|code editor|ide)\b/i,
      /\b(frontend|backend|full[- ]stack|framework|library|bibliothèque|sdk|api|graphql)\b/i,
      /\b(typescript|javascript|python|rust|golang|react|vue|svelte|next\.?js|node\.?js)\b/i,
      /\b(database|base de données|postgres|mysql|sqlite|orm|unit tests?|software testing|debug)\b/i,
    ],
  },
  {
    category: 'Automatisation',
    tag: 'automatisation',
    patterns: [
      /\b(automation|automatisation|workflow|orchestration|no[- ]code|low[- ]code)\b/i,
      /\b(scrap(?:e|ing)|crawler|crawling|browser agent|web agent|rpa|macro)\b/i,
      /\b(command line|cli|script(?:ing)?|batch processing|pipeline)\b/i,
    ],
  },
  {
    category: 'Réseau',
    tag: 'reseau',
    patterns: [
      /\b(network|réseau|networking|dns|dhcp|vpn|wi-?fi|router|routeur)\b/i,
      /\b(proxy|reverse proxy|tunnel|remote access|accès distant|ssh|telephony|téléphonie)\b/i,
    ],
  },
  {
    category: 'Productivité',
    tag: 'productivite',
    patterns: [
      /\b(productivity|productivité|note[- ]taking|prise de notes|knowledge base|second brain)\b/i,
      /\b(document|pdf|spreadsheet|office|bureautique|presentation|présentation|resume builder)\b/i,
      /\b(project management|gestion de projet|calendar|calendrier|email|communication|collaboration)\b/i,
    ],
  },
  {
    category: 'Multimédia',
    tag: 'multimedia',
    patterns: [
      /\b(image|photo|photography|graphic design|création graphique|drawing|illustration)\b/i,
      /\b(video|audio|music|musique|streaming|podcast|subtitle|sous-titre)\b/i,
      /\b(media player|player|codec|editing|éditeur vidéo|text to speech|tts)\b/i,
    ],
  },
  {
    category: 'Vie pratique',
    tag: 'vie-pratique',
    patterns: [
      /\b(real estate|immobilier|finance|banking|budget|shopping|achats|price comparison)\b/i,
      /\b(travel|voyage|mobility|mobilité|home automation|domotique|administratif|loisirs)\b/i,
    ],
  },
  {
    category: 'Services web',
    tag: 'services-web',
    patterns: [
      /\b(saas|hosting|hébergement|website builder|online tool|outil en ligne)\b/i,
      /\b(seo|analytics|web service|cloud service|url shortener|domain name)\b/i,
    ],
  },
]

const FOLDER_HINTS = [
  [/\bia(?:\s*\/|$)/i, 'Intelligence artificielle'],
]

function cleanText(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeInputUrl(value) {
  let input = cleanText(value)
  if (input.startsWith('//')) input = `https:${input}`
  if (!/^[a-z][a-z\d+.-]*:/i.test(input) && /^[\w.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(input)) {
    input = `https://${input}`
  }
  return input
}

function recognizeUrl(value) {
  const url = new URL(normalizeInputUrl(value))
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported URL protocol: ${url.protocol}`)
  }

  url.username = ''
  url.password = ''
  url.hostname = url.hostname.toLowerCase()

  for (const parameter of [...url.searchParams.keys()]) {
    if (SENSITIVE_PARAMETER.test(parameter) || TRACKING_PARAMETER.test(parameter)) {
      url.searchParams.delete(parameter)
    }
  }
  if (
    /(?:^|[&#])(access_token|id_token|refresh_token|token|api[_-]?key|key|secret|client_secret|authorization|auth|code|jwt|session)=/i.test(
      url.hash,
    )
  ) {
    url.hash = ''
  }
  if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) {
    url.port = ''
  }

  const hostname = url.hostname.replace(/^www\./, '')
  let platform = ''
  let owner = ''
  let repository = ''
  let resourceKind = 'website'

  if (hostname === 'github.com') {
    platform = 'github'
    const segments = url.pathname.split('/').filter(Boolean)
    if (segments.length >= 2 && !GITHUB_RESERVED_NAMES.has(segments[0].toLowerCase())) {
      owner = segments[0]
      repository = segments[1].replace(/\.git$/i, '')
      resourceKind = 'repository'
      segments[1] = repository

      if (segments.length === 2 || GITHUB_REPOSITORY_VIEWS.has(segments[2]?.toLowerCase())) {
        url.pathname = `/${owner}/${repository}`
        url.hash = ''
      }
      if (url.searchParams.get('tab') === 'readme-ov-file') {
        url.searchParams.delete('tab')
        if (segments.length === 2) url.hash = ''
      }
    }
  } else if (hostname === 'gitlab.com' || hostname === 'codeberg.org') {
    platform = hostname.split('.')[0]
    resourceKind = 'repository'
  } else if (hostname === 'huggingface.co') {
    platform = 'hugging-face'
    resourceKind = /^\/(models|datasets|spaces)\//i.test(url.pathname)
      ? url.pathname.split('/')[1].toLowerCase()
      : 'ai-platform'
  } else if (/(?:^|\.)youtube\.com$/.test(hostname) || hostname === 'youtu.be') {
    platform = 'youtube'
    resourceKind = 'video'
  } else if (/^(docs?|documentation)\./.test(hostname) || /\/docs?(?:\/|$)/i.test(url.pathname)) {
    resourceKind = 'documentation'
  }

  if (url.pathname !== '/') {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }

  return {
    url: url.toString(),
    hostname,
    isGithub: platform === 'github',
    platform,
    owner,
    repository,
    resourceKind,
  }
}

function parseAddedAt(value) {
  const timestamp = Number(value)
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null

  const date = new Date(timestamp * 1000)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function cleanTitle(item, urlInfo) {
  if (urlInfo.isGithub && urlInfo.repository) {
    return truncate(urlInfo.repository, 200)
  }

  const candidates =
    item.ai_status === 'classified'
      ? [item.title_clean, item.title_original, item.page_title]
      : [item.title_original, item.page_title, item.title_clean]
  const raw =
    candidates.map(cleanText).find((value) => value && !GENERIC_TITLE.test(value)) ||
    urlInfo.hostname
  const withoutSuffix = raw
    .replace(/\s+(?:[|·—-])\s+(GitHub|GitLab|YouTube|Hugging Face)\s*$/i, '')
    .replace(/^GitHub\s*-\s*/i, '')
    .trim()
  return truncate(withoutSuffix || urlInfo.hostname, 200)
}

function githubSummary(item, urlInfo) {
  if (!urlInfo.isGithub || !urlInfo.repository) return ''

  const candidates = [item.page_description, item.page_title, item.title_original]
  for (const candidate of candidates) {
    let value = cleanText(candidate)
    value = value
      .replace(/^GitHub\s*-\s*[^:]+:\s*/i, '')
      .replace(new RegExp(`^${urlInfo.owner}\\/${urlInfo.repository}:\\s*`, 'i'), '')
      .replace(new RegExp(`\\s*[-–—]\\s*${urlInfo.owner}\\/${urlInfo.repository}\\s*$`, 'i'), '')
      .replace(/\s*Contribute to .+? development by creating an account on GitHub\.?\s*$/i, '')
      .replace(/\s*·\s*GitHub\s*$/i, '')
      .trim()
    if (value.length >= 20 && !GENERIC_DESCRIPTION.test(value)) return value
  }
  return ''
}

function excerptSummary(value) {
  let text = cleanText(value)
  if (!text) return ''
  const contentMarker = text.match(/Contenu principal\s*:\s*/i)
  if (contentMarker?.index !== undefined) {
    text = text.slice(contentMarker.index + contentMarker[0].length)
  }
  text = text
    .replace(/^(skip to content|menu|navigation|home|accueil)\b[\s:|/-]*/i, '')
    .replace(/\b(cookie|privacy policy|terms of service)\b.*$/i, '')
    .trim()

  const sentences = text.split(/(?<=[.!?])\s+/)
  let summary = ''
  for (const sentence of sentences) {
    if (sentence.length < 20) continue
    summary = summary ? `${summary} ${sentence}` : sentence
    if (summary.length >= 140) break
  }
  return truncate(summary || text, 500)
}

function descriptionScore(value, preferred = false) {
  if (!value || value.length < 20 || GENERIC_DESCRIPTION.test(value)) return -Infinity
  let score = preferred ? 30 : 0
  score += Math.min(value.length, 260) / 10
  if (value.length >= 80 && value.length <= 420) score += 12
  if (/^(welcome|home|accueil)\b/i.test(value)) score -= 20
  if (/sign in|log in|cookie|privacy policy/i.test(value)) score -= 15
  return score
}

function selectDescription(item, urlInfo, title) {
  const aiDescription =
    item.ai_status === 'classified' && item.category !== 'À vérifier'
      ? cleanText(item.ai_description)
      : ''
  const candidates = [
    { value: aiDescription, preferred: true },
    { value: cleanText(item.page_description), preferred: true },
    { value: githubSummary(item, urlInfo), preferred: true },
    { value: excerptSummary(item.page_excerpt), preferred: false },
  ]

  const best = candidates
    .map((candidate) => ({
      ...candidate,
      score: descriptionScore(candidate.value, candidate.preferred),
    }))
    .sort((a, b) => b.score - a.score)[0]

  if (best?.score > -Infinity) {
    return truncate(
      best.value
        .replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:—-]\\s*`, 'i'), '')
        .trim(),
      500,
    )
  }

  if (urlInfo.resourceKind === 'repository') {
    return `Dépôt de code ${urlInfo.platform || 'Git'} consacré à ${title}.`
  }
  if (urlInfo.resourceKind === 'documentation') {
    return `Documentation de ${title}, disponible sur ${urlInfo.hostname}.`
  }
  return `Ressource web « ${title} » disponible sur ${urlInfo.hostname}.`
}

function classificationText(item, urlInfo, title, description) {
  return {
    folder: cleanText(item.folder_original),
    title,
    description,
    url: `${urlInfo.hostname} ${decodeURIComponent(new URL(urlInfo.url).pathname).replace(/[-_/]+/g, ' ')}`,
    excerpt: excerptSummary(item.page_excerpt),
  }
}

function classifyFavorite(item, urlInfo, title, description) {
  if (item.ai_status === 'classified' && item.category && item.category !== 'À vérifier') {
    const tags = Array.isArray(item.tags) ? item.tags : []
    return {
      category: cleanText(item.category),
      tags: tags.map(slugify).filter(Boolean).slice(0, 8),
    }
  }

  const fields = classificationText(item, urlInfo, title, description)
  const weights = { folder: 6, title: 4, description: 4, url: 3, excerpt: 1 }
  const scores = new Map(CATEGORY_RULES.map((rule) => [rule.category, 0]))
  const tags = new Set()

  for (const [pattern, category] of FOLDER_HINTS) {
    if (pattern.test(fields.folder)) {
      scores.set(category, (scores.get(category) ?? 0) + 12)
    }
  }

  for (const rule of CATEGORY_RULES) {
    for (const [field, value] of Object.entries(fields)) {
      const matches = rule.patterns.filter((pattern) => pattern.test(value)).length
      if (matches) {
        scores.set(rule.category, (scores.get(rule.category) ?? 0) + matches * weights[field])
        tags.add(rule.tag)
      }
    }
  }

  if (urlInfo.platform) tags.add(slugify(urlInfo.platform))
  if (/\b(open source|open-source)\b/i.test(`${fields.description} ${fields.excerpt}`)) {
    tags.add('open-source')
  }
  if (/\b(docker|container)\b/i.test(`${fields.title} ${fields.description} ${fields.excerpt}`)) {
    tags.add('docker')
  }
  if (urlInfo.resourceKind === 'documentation') tags.add('documentation')

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1])
  const [category, score] = ranked[0]
  const confident = score >= 4
  const folderCategory = /\bia(?:\s*\/|$)/i.test(fields.folder)
    ? 'Intelligence artificielle'
    : ''
  const finalCategory = folderCategory || (confident ? category : 'À vérifier')
  tags.add(finalCategory === 'À vérifier' ? 'a-verifier' : slugify(finalCategory))

  return {
    category: finalCategory,
    tags: [...tags].filter(Boolean).slice(0, 8),
  }
}

function buildFavorite(item, sourceIndex) {
  const urlInfo = recognizeUrl(item.url_original)
  const title = cleanTitle(item, urlInfo)
  const shortDescription = selectDescription(item, urlInfo, title)
  const classification = classifyFavorite(item, urlInfo, title, shortDescription)
  const sourceHash =
    cleanText(item.url_hash).slice(0, 12) ||
    createHash('sha256').update(urlInfo.url).digest('hex').slice(0, 12)

  return {
    sourceIndex: Number(item.source_index) || sourceIndex,
    sourceHash,
    title,
    slug: truncate(slugify(title) || `favori-${sourceHash}`, 180),
    url: urlInfo.url,
    isGithub: urlInfo.isGithub,
    shortDescription,
    category: classification.category,
    categorySlug: truncate(slugify(classification.category) || 'a-verifier', 180),
    tags: classification.tags,
    addedAt: parseAddedAt(item.add_date),
  }
}

function generateFavorites(source) {
  const seenUrls = new Set()
  const favorites = []
  let rejectedCount = 0

  for (const item of source) {
    const rawUrl = cleanText(item.url_original)
    if (!rawUrl) {
      rejectedCount += 1
      continue
    }

    try {
      const favorite = buildFavorite(item, favorites.length + 1)
      if (seenUrls.has(favorite.url)) continue
      seenUrls.add(favorite.url)
      favorites.push(favorite)
    } catch (error) {
      rejectedCount += 1
      console.warn(`Skipped invalid URL ${rawUrl}: ${error.message}`)
    }
  }

  favorites.sort((a, b) => a.sourceIndex - b.sourceIndex)
  return { favorites, rejectedCount }
}

function runSelfTest() {
  const tracked = recognizeUrl(
    'github.com/anchore/grype/actions?utm_source=newsletter&token=secret#readme',
  )
  assert.equal(tracked.url, 'https://github.com/anchore/grype')
  assert.equal(tracked.isGithub, true)

  const security = buildFavorite(
    {
      source_index: 1,
      url_original: 'https://github.com/anchore/grype/actions',
      page_title: 'GitHub - anchore/grype: A vulnerability scanner for container images and filesystems',
      page_description: 'A vulnerability scanner for container images and filesystems - anchore/grype',
      page_excerpt: 'Container security scanner for known vulnerabilities.',
      folder_original: 'A VOIR',
    },
    1,
  )
  assert.equal(security.title, 'grype')
  assert.equal(security.category, 'Cybersécurité')
  assert.match(security.shortDescription, /vulnerability scanner/i)

  const ai = buildFavorite(
    {
      source_index: 2,
      url_original: 'https://example.com/generator',
      page_title: 'Studio',
      page_description: 'Create short videos from text prompts.',
      page_excerpt: '',
      folder_original: 'IA / Image/Video',
      ai_status: 'fallback',
      ai_description:
        'Les informations disponibles ne permettent pas encore de décrire précisément cette ressource.',
    },
    2,
  )
  assert.equal(ai.category, 'Intelligence artificielle')
  assert.equal(ai.shortDescription, 'Create short videos from text prompts.')

  console.log('[OK] URL recognition, descriptions and classification self-test passed.')
}

function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest()
    return
  }

  const source = JSON.parse(readFileSync(sourcePath, 'utf8'))
  if (!Array.isArray(source)) {
    throw new Error('Expected tous_les_favoris.json to contain an array')
  }

  const { favorites, rejectedCount } = generateFavorites(source)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        sourceCount: source.length,
        duplicateCount: source.length - favorites.length - rejectedCount,
        rejectedCount,
        favorites,
      },
      null,
      2,
    )}\n`,
    'utf8',
  )

  const categoryCounts = Object.fromEntries(
    [...favorites.reduce((counts, favorite) => {
      counts.set(favorite.category, (counts.get(favorite.category) ?? 0) + 1)
      return counts
    }, new Map())].sort((a, b) => b[1] - a[1]),
  )
  console.log(
    `Generated ${favorites.length} unique favorites from ${source.length} entries. ` +
      `Rejected: ${rejectedCount}. Categories: ${JSON.stringify(categoryCounts)}.`,
  )
}

main()
