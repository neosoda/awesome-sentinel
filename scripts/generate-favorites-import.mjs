import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = join(projectRoot, '_A IMPORTER', 'output', 'tous_les_favoris.json')
const outputPath = join(projectRoot, 'prisma', 'data', 'favorites.json')

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

function normalizeCategory(folder) {
  const parts = cleanText(folder || 'À vérifier')
    .split(/\s+\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (part.toUpperCase() === 'A VOIR' ? 'À voir' : part))

  return parts.join(' — ') || 'À vérifier'
}

function normalizeUrl(value) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported URL protocol: ${url.protocol}`)
  }

  const sensitiveParameter =
    /^(access_token|id_token|refresh_token|token|api[_-]?key|key|secret|client_secret|authorization|auth|code|jwt|session)$/i

  url.username = ''
  url.password = ''
  url.hostname = url.hostname.toLowerCase()
  for (const parameter of [...url.searchParams.keys()]) {
    if (sensitiveParameter.test(parameter)) {
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
  if (url.pathname !== '/') {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }

  return url.toString()
}

function parseAddedAt(value) {
  const timestamp = Number(value)
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null

  const date = new Date(timestamp * 1000)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const source = JSON.parse(readFileSync(sourcePath, 'utf8'))
if (!Array.isArray(source)) {
  throw new Error('Expected tous_les_favoris.json to contain an array')
}

const seenUrls = new Set()
const favorites = []

for (const item of source) {
  const rawUrl = cleanText(item.url_original)
  if (!rawUrl) continue

  const url = normalizeUrl(rawUrl)
  if (seenUrls.has(url)) continue
  seenUrls.add(url)

  const title = truncate(
    cleanText(item.title_original || item.title_clean || item.page_title) || new URL(url).hostname,
    200,
  )
  const pageDescription = cleanText(item.page_description)
  const excerpt = cleanText(item.page_excerpt)
  const descriptionSource =
    pageDescription.length >= 20
      ? pageDescription
      : excerpt.length >= 20
        ? excerpt
        : `Favori à examiner : ${title}.`
  const category = normalizeCategory(item.folder_original)
  const sourceHash =
    cleanText(item.url_hash).slice(0, 12) ||
    createHash('sha256').update(url).digest('hex').slice(0, 12)

  favorites.push({
    sourceIndex: Number(item.source_index) || favorites.length + 1,
    sourceHash,
    title,
    slug: truncate(slugify(title) || `favori-${sourceHash}`, 180),
    url,
    isGithub: new URL(url).hostname === 'github.com',
    shortDescription: truncate(descriptionSource, 500),
    category,
    categorySlug: truncate(slugify(category) || 'a-verifier', 180),
    addedAt: parseAddedAt(item.add_date),
  })
}

favorites.sort((a, b) => a.sourceIndex - b.sourceIndex)

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      sourceCount: source.length,
      duplicateCount: source.length - favorites.length,
      favorites,
    },
    null,
    2,
  )}\n`,
  'utf8',
)

const categoryCount = new Set(favorites.map((favorite) => favorite.categorySlug)).size
console.log(
  `Generated ${favorites.length} unique favorites from ${source.length} entries across ${categoryCount} categories.`,
)
