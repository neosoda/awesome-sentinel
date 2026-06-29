import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  CATALOG_VERSION,
  TAXONOMY,
  REMOVED_CATEGORY_SLUGS,
  canonicalizeUrl,
  parseGithubRepo,
  normalizeTags,
  classifyTool,
  detectToolType,
  buildFrenchDescriptions,
  findDuplicateGroups,
  validateCatalog,
  cleanTitle,
  looksGenericDescription,
  hasEnglishSignals,
} from './catalog-utils.mjs'

const ROOT = process.cwd()
const SOURCE_PATH = join(ROOT, 'prisma', 'data', 'favorites.json')
const OUTPUT_PATH = join(ROOT, 'prisma', 'data', 'catalog.enriched.json')
const STATE_PATH = join(ROOT, 'prisma', 'data', 'catalog.enrichment-state.json')
const CACHE_PATH = join(ROOT, '.cache', 'catalog.http-cache.json')
const DOCS_DIR = join(ROOT, 'docs')
const BATCH_SIZE = Number(process.env.CATALOG_BATCH_SIZE ?? 40)
const MAX_CONCURRENCY = Number(process.env.CATALOG_CONCURRENCY ?? 6)
const FETCH_TIMEOUT_MS = Number(process.env.CATALOG_FETCH_TIMEOUT_MS ?? 8000)

mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
mkdirSync(dirname(CACHE_PATH), { recursive: true })
mkdirSync(DOCS_DIR, { recursive: true })

const source = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'))
const previous = readJson(OUTPUT_PATH, null)
const previousBySourceHash = new Map((previous?.tools ?? []).map((tool) => [tool.sourceHash, tool]))
const cache = readJson(CACHE_PATH, {})

const initialTools = source.favorites.map((favorite) => buildInitialTool(favorite))
const beforeAudit = auditRawCatalog(source.favorites)
writeText(join(DOCS_DIR, 'catalog-audit-before.md'), renderBeforeAudit(beforeAudit))
writeText(join(DOCS_DIR, 'catalog-taxonomy.md'), renderTaxonomy())

const enrichedTools = []
for (let offset = 0; offset < initialTools.length; offset += BATCH_SIZE) {
  const batch = initialTools.slice(offset, offset + BATCH_SIZE)
  const processed = await mapConcurrent(batch, MAX_CONCURRENCY, enrichTool)
  enrichedTools.push(...processed)
  saveProgress(enrichedTools, offset + processed.length)
}

const duplicateGroups = findDuplicateGroups(enrichedTools)
const duplicateSourceHashes = new Set()
for (const group of duplicateGroups) {
  const sorted = [...group.tools].sort((a, b) => {
    if (a.githubUrl && !b.githubUrl) return -1
    if (!a.githubUrl && b.githubUrl) return 1
    return a.sourceIndex - b.sourceIndex
  })
  for (const duplicate of sorted.slice(1)) {
    duplicateSourceHashes.add(duplicate.sourceHash)
    duplicate.enrichmentStatus = 'duplicate'
    duplicate.duplicateOf = sorted[0].slug
  }
}

const validationIssues = validateCatalog(enrichedTools)
for (const issue of validationIssues) {
  const tool = enrichedTools.find((item) => item.slug === issue.slug)
  if (tool && tool.enrichmentStatus === 'enriched') {
    tool.enrichmentStatus = 'needs_review'
    tool.reviewReasons.push(issue.code)
  }
}

const payload = {
  version: CATALOG_VERSION,
  generatedAt: new Date().toISOString(),
  sourcePath: 'prisma/data/favorites.json',
  sourceCount: source.sourceCount,
  duplicateCountFromSource: source.duplicateCount,
  taxonomy: TAXONOMY.map(withoutKeywords),
  tools: enrichedTools,
}

writeText(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`)
writeText(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, true)
writeText(STATE_PATH, `${JSON.stringify({
  version: CATALOG_VERSION,
  updatedAt: new Date().toISOString(),
  processed: enrichedTools.length,
  total: initialTools.length,
  tools: Object.fromEntries(enrichedTools.map((tool) => [tool.sourceHash, tool.enrichmentStatus])),
  errors: enrichedTools.filter((tool) => tool.enrichmentStatus === 'failed').map((tool) => ({
    sourceHash: tool.sourceHash,
    slug: tool.slug,
    reasons: tool.reviewReasons,
  })),
}, null, 2)}\n`)

writeText(join(DOCS_DIR, 'catalog-duplicates.md'), renderDuplicates(duplicateGroups))
writeText(join(DOCS_DIR, 'catalog-review-needed.md'), renderReviewNeeded(enrichedTools, validationIssues))
writeText(join(DOCS_DIR, 'catalog-audit-after.md'), renderAfterAudit(enrichedTools, beforeAudit, duplicateGroups, validationIssues))

console.log(`Catalog enriched: ${enrichedTools.length} tools -> ${OUTPUT_PATH}`)

function buildInitialTool(favorite) {
  const canonical = canonicalizeUrl(favorite.url) ?? favorite.url
  const github = parseGithubRepo(canonical)
  const sourceTags = normalizeTags(favorite.tags)
  const categorySlug = classifyTool({
    ...favorite,
    url: canonical,
    sourceDescription: favorite.shortDescription,
    tags: sourceTags,
  })
  const type = detectToolType({
    title: favorite.title,
    url: canonical,
    sourceDescription: favorite.shortDescription,
    tags: sourceTags,
  })
  const reviewReasons = []
  if (REMOVED_CATEGORY_SLUGS.has(favorite.categorySlug)) reviewReasons.push(`ancienne categorie temporaire: ${favorite.category}`)
  if (looksGenericDescription(favorite.shortDescription)) reviewReasons.push('description source generique ou invalide')
  if (hasEnglishSignals(favorite.shortDescription)) reviewReasons.push('description source probablement anglaise')

  return {
    sourceIndex: favorite.sourceIndex,
    sourceHash: favorite.sourceHash,
    title: cleanTitle(favorite.title),
    slug: favorite.slug,
    originalUrl: favorite.url,
    websiteUrl: github ? null : canonical,
    githubUrl: github?.canonicalUrl ?? null,
    docsUrl: null,
    demoUrl: null,
    sourceDescription: favorite.shortDescription,
    shortDescription: favorite.shortDescription,
    longDescription: null,
    categorySlug,
    type,
    license: null,
    pricing: github ? 'Gratuit / depot public' : null,
    isFavorite: true,
    isRecommended: false,
    isSelfHosted: sourceTags.includes('self-hosted') || sourceTags.includes('docker'),
    hasDocker: sourceTags.includes('docker'),
    isOpenSource: false,
    tags: sourceTags,
    addedAt: favorite.addedAt,
    enrichmentStatus: 'pending',
    reviewReasons,
    verification: {
      sources: [],
      urlStatus: null,
      repository: null,
      license: null,
      docker: false,
      selfHosted: false,
      archived: false,
      redirectedTo: null,
      checkedAt: null,
    },
    manualLock: false,
  }
}

function withoutKeywords(category) {
  return {
    slug: category.slug,
    name: category.name,
    icon: category.icon,
    description: category.description,
  }
}

async function enrichTool(tool) {
  const previousTool = previousBySourceHash.get(tool.sourceHash)
  if (previousTool?.manualLock) return previousTool

  const checkedAt = new Date().toISOString()
  const github = parseGithubRepo(tool.githubUrl ?? tool.originalUrl)
  let metadata = null
  try {
    if (github) {
      metadata = await fetchGithubMetadata(github)
    } else if (tool.websiteUrl) {
      metadata = await fetchWebsiteMetadata(tool.websiteUrl)
    }
    applyMetadata(tool, metadata, checkedAt)
    const descriptions = buildFrenchDescriptions({
      ...tool,
      needsReviewReason: tool.reviewReasons[0],
    })
    tool.shortDescription = descriptions.shortDescription
    tool.longDescription = descriptions.longDescription
    tool.tags = normalizeTags([
      ...tool.tags,
      tool.categorySlug,
      tool.type,
      tool.isOpenSource ? 'open-source' : null,
      tool.isSelfHosted ? 'self-hosted' : null,
      tool.hasDocker ? 'docker' : null,
    ].filter(Boolean))
    if (tool.reviewReasons.length) {
      tool.enrichmentStatus = metadata ? 'needs_review' : 'failed'
    } else {
      tool.enrichmentStatus = metadata ? 'enriched' : 'needs_review'
    }
  } catch (error) {
    tool.enrichmentStatus = 'failed'
    tool.reviewReasons.push(error instanceof Error ? error.message : String(error))
    const descriptions = buildFrenchDescriptions(tool)
    tool.shortDescription = descriptions.shortDescription
    tool.longDescription = descriptions.longDescription
  }
  return tool
}

function applyMetadata(tool, metadata, checkedAt) {
  tool.verification.checkedAt = checkedAt
  if (!metadata) {
    tool.reviewReasons.push('source publique non recuperee')
    return
  }
  tool.verification.sources.push(...metadata.sources)
  tool.verification.urlStatus = metadata.status ?? null
  tool.verification.redirectedTo = metadata.redirectedTo ?? null
  if (metadata.title && (tool.title.length > 90 || looksGenericDescription(tool.title))) tool.title = cleanTitle(metadata.title)
  if (metadata.description && !looksGenericDescription(metadata.description)) tool.sourceDescription = metadata.description
  if (metadata.repository) tool.verification.repository = metadata.repository
  if (metadata.homepage && !tool.websiteUrl) tool.websiteUrl = canonicalizeUrl(metadata.homepage)
  if (metadata.docsUrl) tool.docsUrl = canonicalizeUrl(metadata.docsUrl)
  if (metadata.license) {
    tool.license = metadata.license
    tool.verification.license = metadata.license
    tool.isOpenSource = metadata.license !== 'NOASSERTION'
  }
  if (metadata.archived) {
    tool.verification.archived = true
    tool.enrichmentStatus = 'needs_review'
    tool.reviewReasons.push('depot archive')
  }
  if (metadata.hasDocker) {
    tool.hasDocker = true
    tool.verification.docker = true
  }
  if (metadata.selfHosted) {
    tool.isSelfHosted = true
    tool.verification.selfHosted = true
  }
  if (metadata.type) tool.type = metadata.type
  tool.categorySlug = classifyTool(tool)
}

async function fetchGithubMetadata({ owner, repo, canonicalUrl }) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
  const api = await fetchJson(apiUrl)
  if (api?.ok) {
    const data = api.data
    return {
      status: api.status,
      sources: [apiUrl],
      repository: `${owner}/${repo}`,
      title: data.full_name,
      description: data.description,
      homepage: data.homepage || null,
      license: data.license?.spdx_id && data.license.spdx_id !== 'NOASSERTION' ? data.license.spdx_id : null,
      archived: Boolean(data.archived),
      hasDocker: hasDockerSignals(data.description, data.topics),
      selfHosted: hasSelfHostedSignals(data.description, data.topics),
      type: detectToolType({ title: data.name, url: canonicalUrl, sourceDescription: data.description, tags: data.topics ?? [] }),
    }
  }

  const html = await fetchText(canonicalUrl)
  if (!html?.text) return null
  return {
    status: html.status,
    redirectedTo: html.redirectedTo,
    sources: [canonicalUrl],
    repository: `${owner}/${repo}`,
    title: readMeta(html.text, 'og:title') ?? `${owner}/${repo}`,
    description: readMeta(html.text, 'og:description') ?? readMeta(html.text, 'description'),
    license: readHtmlLicense(html.text),
    archived: /Public archive|This repository has been archived/i.test(html.text),
    hasDocker: /Dockerfile|docker compose|docker-compose|container image/i.test(html.text),
    selfHosted: /self-hosted|self hosted|selfhosted|deploy/i.test(html.text),
    type: detectToolType({ title: repo, url: canonicalUrl, sourceDescription: html.text.slice(0, 1000), tags: [] }),
  }
}

async function fetchWebsiteMetadata(url) {
  const html = await fetchText(url)
  if (!html?.text) return null
  return {
    status: html.status,
    redirectedTo: html.redirectedTo,
    sources: [url],
    title: readMeta(html.text, 'og:title') ?? readTitle(html.text),
    description: readMeta(html.text, 'og:description') ?? readMeta(html.text, 'description'),
    hasDocker: /docker|container image|docker compose/i.test(html.text),
    selfHosted: /self-hosted|self hosted|selfhosted|on-premise|on premise/i.test(html.text),
    type: detectToolType({ title: readTitle(html.text), url, sourceDescription: html.text.slice(0, 1200), tags: [] }),
  }
}

async function fetchJson(url) {
  const key = `json:${url}`
  if (cache[key]) return cache[key]
  const result = await fetchWithTimeout(url, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'awesome-sentinel-catalog-audit',
    },
  })
  const body = await result.text()
  const payload = {
    ok: result.ok,
    status: result.status,
    redirectedTo: result.url !== url ? result.url : null,
    data: body ? JSON.parse(body) : null,
  }
  cache[key] = payload
  return payload
}

async function fetchText(url) {
  const key = `text:${url}`
  if (cache[key]) return cache[key]
  const result = await fetchWithTimeout(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'awesome-sentinel-catalog-audit',
    },
  })
  const contentType = result.headers.get('content-type') ?? ''
  const text = contentType.includes('text') || contentType.includes('html') || contentType.includes('json')
    ? await result.text()
    : ''
  const payload = {
    ok: result.ok,
    status: result.status,
    redirectedTo: result.url !== url ? result.url : null,
    text: text.slice(0, 50000),
  }
  cache[key] = payload
  return payload
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, method: 'GET', redirect: 'follow', signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function readMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeHtml(match[1])
  }
  return null
}

function readTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match?.[1] ? decodeHtml(match[1]) : null
}

function readHtmlLicense(html) {
  const match = html.match(/licenseInfo[^}]+spdxId["']?\s*:\s*["']([^"']+)/i) ?? html.match(/\b(MIT|Apache-2\.0|GPL-3\.0|AGPL-3\.0|BSD-3-Clause|MPL-2\.0)\b/)
  return match?.[1] ?? null
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasDockerSignals(description, topics = []) {
  return /docker|container|compose|kubernetes/i.test(`${description ?? ''} ${topics.join(' ')}`)
}

function hasSelfHostedSignals(description, topics = []) {
  return /self-hosted|self hosted|selfhosted|homelab|on-prem|deploy/i.test(`${description ?? ''} ${topics.join(' ')}`)
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await mapper(items[index])
    }
  })
  await Promise.all(workers)
  return results
}

function saveProgress(tools, processed) {
  const partial = {
    version: CATALOG_VERSION,
    generatedAt: new Date().toISOString(),
    sourcePath: 'prisma/data/favorites.json',
    sourceCount: source.sourceCount,
    processed,
    tools,
  }
  writeText(OUTPUT_PATH, `${JSON.stringify(partial, null, 2)}\n`)
  writeText(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, true)
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeText(path, content, optional = false) {
  const tempPath = `${path}.${process.pid}.${Date.now()}.tmp`
  try {
    writeFileSync(tempPath, content, 'utf8')
    renameSync(tempPath, path)
  } catch (error) {
    if (!optional) throw error
    console.warn(`Warning: could not write optional generated file ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function auditRawCatalog(favorites) {
  const byCategory = countBy(favorites, (tool) => tool.category)
  const genericDescriptions = favorites.filter((tool) => looksGenericDescription(tool.shortDescription) || hasEnglishSignals(tool.shortDescription))
  const temporaryCategories = favorites.filter((tool) => REMOVED_CATEGORY_SLUGS.has(tool.categorySlug))
  const withoutTags = favorites.filter((tool) => !tool.tags?.length)
  const duplicates = findDuplicateGroups(favorites.map((tool) => ({
    ...tool,
    websiteUrl: tool.isGithub ? null : tool.url,
    githubUrl: tool.isGithub ? tool.url : null,
  })))
  const invalidUrls = favorites.filter((tool) => !canonicalizeUrl(tool.url))
  const githubDescriptions = favorites.filter((tool) => /github|contribute to|owner\/repository/i.test(tool.shortDescription))
  return { total: favorites.length, byCategory, genericDescriptions, temporaryCategories, withoutTags, duplicates, invalidUrls, githubDescriptions }
}

function countBy(items, getKey) {
  const counts = new Map()
  for (const item of items) {
    const key = getKey(item) ?? 'Sans categorie'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function renderBeforeAudit(audit) {
  return `# Audit initial du catalogue

Generation: ${new Date().toISOString()}

## Synthese

- Nombre total d outils source: ${audit.total}
- Descriptions anglaises, generiques ou manquantes: ${audit.genericDescriptions.length}
- Descriptions brutes GitHub ou "Contribute to": ${audit.githubDescriptions.length}
- Outils dans des categories temporaires: ${audit.temporaryCategories.length}
- Outils sans tags: ${audit.withoutTags.length}
- Groupes de doublons probables par URL canonique: ${audit.duplicates.length}
- URLs invalides detectees avant requetes reseau: ${audit.invalidUrls.length}

## Repartition par categorie source

${audit.byCategory.map(([category, count]) => `- ${category}: ${count}`).join('\n')}

## Categories temporaires observees

${countBy(audit.temporaryCategories, (tool) => tool.category).map(([category, count]) => `- ${category}: ${count}`).join('\n') || '- Aucune'}

## Doublons probables avant enrichissement

${audit.duplicates.map((group) => `- ${group.key}: ${group.tools.map((tool) => tool.slug).join(', ')}`).join('\n') || '- Aucun doublon URL strict detecte'}

## Incoherences initiales

- Les champs licence, Docker, open source et self-hosted sont peu fiables dans la source brute: ils proviennent surtout de tags importes.
- Un depot public n est pas considere open source tant qu une licence publique n est pas detectee.
- Les anciennes categories melangent usage, statut personnel et plateforme; elles sont remplacees dans la source enrichie.
`
}

function renderTaxonomy() {
  return `# Taxonomie du catalogue

Cette taxonomie remplace les categories d import par une categorie principale d usage. Les statuts personnels, plateformes, licences et signaux comme Docker deviennent des champs ou tags.

## Categories retenues

${TAXONOMY.map((category) => `### ${category.name}

Slug: \`${category.slug}\`

Critere: ${category.description}
`).join('\n')}

## Categories supprimees ou fusionnees

- A verifier, A voir, A tester, Autre, Divers, Non classe, Favoris et Recommande sont exclus du catalogue public comme categories.
- Intelligence artificielle est scindee entre agents, developpement, RAG, image/video/design, audio/transcription et modeles/evaluation.
- Infrastructure et systemes est repartie entre systemes, DevOps, reseaux et monitoring selon l usage principal.
- Services web, vie pratique et autres libelles vagues sont reclassees par fonction reelle ou placees en revue.
`
}

function renderDuplicates(groups) {
  return `# Doublons du catalogue

${groups.length ? groups.map((group) => {
    const [kept, ...duplicates] = group.tools
    return `## ${group.key}

- Conserve: ${kept.slug} (${kept.title})
- Doublons marques: ${duplicates.map((tool) => `${tool.slug} (${tool.title})`).join(', ')}
- Regle: URL canonique ou depot identique; les donnees personnelles restent sur chaque entree tant qu aucune fusion manuelle n est realisee en base.
`
  }).join('\n') : 'Aucun doublon strict par URL canonique n a ete detecte apres enrichissement.\n'}
`
}

function renderReviewNeeded(tools, validationIssues) {
  const review = tools.filter((tool) => ['needs_review', 'failed'].includes(tool.enrichmentStatus))
  return `# Revue humaine necessaire

Total a revoir: ${review.length}

${review.map((tool) => `## ${tool.title}

- Slug: \`${tool.slug}\`
- Statut enrichissement: ${tool.enrichmentStatus}
- URL source: ${tool.originalUrl}
- Raisons: ${[...new Set(tool.reviewReasons)].join('; ') || 'validation manuelle conseillee'}
- Issues validation: ${validationIssues.filter((issue) => issue.slug === tool.slug).map((issue) => issue.code).join(', ') || 'aucune issue bloquante'}
`).join('\n') || 'Aucun outil en revue.'}
`
}

function renderAfterAudit(tools, beforeAudit, duplicateGroups, validationIssues) {
  const byCategory = countBy(tools, (tool) => tool.categorySlug)
  const byStatus = countBy(tools, (tool) => tool.enrichmentStatus)
  const rewritten = tools.filter((tool) => tool.shortDescription && tool.longDescription).length
  const tags = new Set(tools.flatMap((tool) => tool.tags ?? []))
  const archived = tools.filter((tool) => tool.verification?.archived)
  const dead = tools.filter((tool) => tool.verification?.urlStatus && tool.verification.urlStatus >= 400)
  const unknownLicenses = tools.filter((tool) => tool.githubUrl && !tool.license)
  return `# Audit final du catalogue

Generation: ${new Date().toISOString()}

## Synthese

- Nombre total d outils: ${tools.length}
- Outils analyses et enrichis: ${tools.filter((tool) => tool.enrichmentStatus === 'enriched').length}
- Outils restant en revue: ${tools.filter((tool) => tool.enrichmentStatus === 'needs_review').length}
- Outils en echec documente: ${tools.filter((tool) => tool.enrichmentStatus === 'failed').length}
- Outils marques doublons: ${tools.filter((tool) => tool.enrichmentStatus === 'duplicate').length}
- Descriptions reecrites ou normalisees: ${rewritten}
- Tags distincts apres normalisation: ${tags.size}
- Groupes de doublons traites: ${duplicateGroups.length}
- URLs mortes ou en erreur HTTP detectees: ${dead.length}
- Projets archives detectes: ${archived.length}
- Licences inconnues sur depots publics: ${unknownLicenses.length}
- Outils open source confirmes par licence: ${tools.filter((tool) => tool.isOpenSource).length}
- Outils self-hosted confirmes par source: ${tools.filter((tool) => tool.verification?.selfHosted).length}
- Outils Docker confirmes par source: ${tools.filter((tool) => tool.verification?.docker).length}

## Statuts d enrichissement

${byStatus.map(([status, count]) => `- ${status}: ${count}`).join('\n')}

## Categories avant

${beforeAudit.byCategory.map(([category, count]) => `- ${category}: ${count}`).join('\n')}

## Categories apres

${byCategory.map(([category, count]) => `- ${category}: ${count}`).join('\n')}

## Tags fusionnes

- open source, opensource -> open-source
- self hosted, selfhosted -> self-hosted
- command line, command-line-interface -> cli
- github, outil, application, logiciel, web, interessant, a voir et a verifier supprimes comme tags publics

## Doublons traites

Voir \`docs/catalog-duplicates.md\`.

## Revue et limites

- Les outils non recuperables, bloques par anti-bot, pages de connexion ou metadata insuffisante sont listes dans \`docs/catalog-review-needed.md\`.
- Les licences ne sont renseignees que lorsqu elles sont detectees dans les sources publiques consultees.
- Docker et self-hosted ne sont confirmes que lorsqu un signal public explicite a ete trouve.
- L import preserve les favoris, recommandations, scores, statuts personnels, notes et dates historiques.

## Validations

- Issues de validation catalogue detectees: ${validationIssues.length}
- Tests ajoutes: canonicalisation URL, doublons, categories/tags, descriptions generiques, preservation personnelle et idempotence d import.
`
}
