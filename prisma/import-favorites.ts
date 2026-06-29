import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaClient, ToolStatus, ToolType } from '@prisma/client'

type ImportedFavorite = {
  sourceIndex: number
  sourceHash: string
  title: string
  slug: string
  url: string
  isGithub: boolean
  shortDescription: string
  longDescription?: string | null
  category: string
  categorySlug: string
  tags: string[]
  addedAt: string | null
  websiteUrl?: string | null
  githubUrl?: string | null
  docsUrl?: string | null
  demoUrl?: string | null
  type?: ToolType
  license?: string | null
  pricing?: string | null
  isSelfHosted?: boolean
  hasDocker?: boolean
  isOpenSource?: boolean
  enrichmentStatus?: string
}

type FavoritesData = {
  sourceCount: number
  duplicateCount: number
  rejectedCount?: number
  favorites: ImportedFavorite[]
  categoryMetadata?: Record<string, { name: string; icon: string; description: string }>
}

type EnrichedCatalog = {
  sourceCount: number
  duplicateCountFromSource?: number
  taxonomy: { name: string; slug: string; icon?: string; description?: string }[]
  tools: Array<{
    sourceIndex: number
    sourceHash: string
    title: string
    slug: string
    originalUrl: string
    websiteUrl: string | null
    githubUrl: string | null
    docsUrl: string | null
    demoUrl: string | null
    shortDescription: string
    longDescription: string | null
    categorySlug: string
    type: ToolType
    license: string | null
    pricing: string | null
    isSelfHosted: boolean
    hasDocker: boolean
    isOpenSource: boolean
    tags: string[]
    addedAt: string | null
    enrichmentStatus: string
  }>
}

const categoryMetadata: Record<string, { icon: string; description: string }> = {
  'intelligence-artificielle': {
    icon: '🤖',
    description: 'Modèles, agents, assistants et outils fondés sur l’intelligence artificielle.',
  },
  cybersecurite: {
    icon: '🔒',
    description: 'Audit, protection, authentification, OSINT et analyse de vulnérabilités.',
  },
  'infrastructure-et-systemes': {
    icon: '🖥️',
    description: 'Systèmes, conteneurs, supervision, auto-hébergement et administration.',
  },
  developpement: {
    icon: '💻',
    description: 'Frameworks, bibliothèques, API, bases de données et outils développeur.',
  },
  automatisation: {
    icon: '⚙️',
    description: 'Workflows, scripts, orchestration, scraping et automatisation.',
  },
  reseau: {
    icon: '🌐',
    description: 'Administration réseau, VPN, DNS, accès distant et diagnostic.',
  },
  productivite: {
    icon: '🗂️',
    description: 'Documents, organisation, collaboration et gestion des connaissances.',
  },
  multimedia: {
    icon: '🎬',
    description: 'Image, vidéo, audio, streaming et création graphique.',
  },
  'services-web': {
    icon: '🌍',
    description: 'Services en ligne, hébergement, analyse web et outils SaaS.',
  },
  'vie-pratique': {
    icon: '🧭',
    description: 'Finance, maison, mobilité, achats et usages du quotidien.',
  },
  'a-verifier': {
    icon: '🔖',
    description: 'Ressources conservées pour une vérification ou un classement manuel.',
  },
}

function readCatalogData(): FavoritesData {
  const enrichedPath = join(__dirname, 'data', 'catalog.enriched.json')
  if (existsSync(enrichedPath)) {
    const catalog = JSON.parse(readFileSync(enrichedPath, 'utf8')) as EnrichedCatalog
    const enrichedCategoryMetadata = Object.fromEntries(
      catalog.taxonomy.map((category) => [
        category.slug,
        {
          name: category.name,
          icon: category.icon ?? '•',
          description: category.description ?? `Outils classés dans ${category.name}.`,
        },
      ]),
    )

    return {
      sourceCount: catalog.sourceCount,
      duplicateCount: catalog.duplicateCountFromSource ?? 0,
      categoryMetadata: enrichedCategoryMetadata,
      favorites: catalog.tools
        .filter((tool) => tool.enrichmentStatus !== 'duplicate')
        .map((tool) => ({
          sourceIndex: tool.sourceIndex,
          sourceHash: tool.sourceHash,
          title: tool.title,
          slug: tool.slug,
          url: tool.originalUrl,
          isGithub: Boolean(tool.githubUrl),
          websiteUrl: tool.websiteUrl,
          githubUrl: tool.githubUrl,
          docsUrl: tool.docsUrl,
          demoUrl: tool.demoUrl,
          shortDescription: tool.shortDescription,
          longDescription: tool.longDescription,
          category: enrichedCategoryMetadata[tool.categorySlug]?.name ?? tool.categorySlug,
          categorySlug: tool.categorySlug,
          tags: tool.tags,
          addedAt: tool.addedAt,
          type: tool.type,
          license: tool.license,
          pricing: tool.pricing,
          isSelfHosted: tool.isSelfHosted,
          hasDocker: tool.hasDocker,
          isOpenSource: tool.isOpenSource,
          enrichmentStatus: tool.enrichmentStatus,
        })),
    }
  }

  const dataPath = join(__dirname, 'data', 'favorites.json')
  return JSON.parse(readFileSync(dataPath, 'utf8')) as FavoritesData
}

const trackingParameter =
  /^(utm_.+|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|ref|referrer|source|campaign|campaignid|vero_id|yclid)$/i
const githubRepositoryViews = new Set([
  'actions',
  'issues',
  'pulls',
  'projects',
  'releases',
  'security',
  'settings',
])

function normalizeUrlForComparison(value: string | null | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    url.hostname = url.hostname.toLowerCase()
    url.hash = ''

    for (const parameter of [...url.searchParams.keys()]) {
      if (trackingParameter.test(parameter)) {
        url.searchParams.delete(parameter)
      }
    }
    if (url.hostname.replace(/^www\./, '') === 'github.com') {
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments.length >= 2 && githubRepositoryViews.has(segments[2]?.toLowerCase())) {
        url.pathname = `/${segments[0]}/${segments[1].replace(/\.git$/i, '')}`
      }
      if (url.searchParams.get('tab') === 'readme-ov-file') {
        url.searchParams.delete('tab')
      }
    }

    if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) {
      url.port = ''
    }
    if (url.pathname !== '/') {
      url.pathname = url.pathname.replace(/\/+$/, '')
    }

    return url.toString()
  } catch {
    return null
  }
}

function uniqueSlug(baseSlug: string, sourceHash: string, usedSlugs: Set<string>) {
  const base = baseSlug.slice(0, 180) || `favori-${sourceHash}`
  let candidate = base
  let suffix = 1

  while (usedSlugs.has(candidate)) {
    const discriminator = suffix === 1 ? sourceHash.slice(0, 8) : `${sourceHash.slice(0, 8)}-${suffix}`
    candidate = `${base.slice(0, 190 - discriminator.length)}-${discriminator}`
    suffix += 1
  }

  usedSlugs.add(candidate)
  return candidate
}

export async function importFavorites(prisma: PrismaClient) {
  const data = readCatalogData()

  const categoryEntries = [
    ...new Map(
      data.favorites.map((favorite) => [
        favorite.categorySlug,
        { name: favorite.category, slug: favorite.categorySlug },
      ]),
    ).values(),
  ]

  const categories = await Promise.all(
    categoryEntries.map((category) => {
      const metadata = data.categoryMetadata?.[category.slug] ?? categoryMetadata[category.slug] ?? {
        icon: '🔖',
        description: `Favoris importés depuis « ${category.name} ».`,
      }
      return prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          icon: metadata.icon,
          description: metadata.description,
        },
        create: {
          ...category,
          icon: metadata.icon,
          description: metadata.description,
        },
      })
    }),
  )
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]))

  const importedTagSlugs = [
    ...new Set(['favori', ...data.favorites.flatMap((favorite) => favorite.tags ?? [])]),
  ]
  const importedTags = await Promise.all(
    importedTagSlugs.map((slug) =>
      prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: slug, slug },
      }),
    ),
  )
  const tagIds = new Map(importedTags.map((tag) => [tag.slug, tag.id]))

  const existingTools = await prisma.tool.findMany({
    select: {
      id: true,
      slug: true,
      websiteUrl: true,
      githubUrl: true,
      isFavorite: true,
      status: true,
      tags: {
        select: {
          tag: {
            select: { slug: true },
          },
        },
      },
    },
  })
  const existingByUrl = new Map<string, (typeof existingTools)[number]>()

  for (const tool of existingTools) {
    for (const value of [tool.websiteUrl, tool.githubUrl]) {
      const normalizedUrl = normalizeUrlForComparison(value)
      if (normalizedUrl) existingByUrl.set(normalizedUrl, tool)
    }
  }

  const usedSlugs = new Set(existingTools.map((tool) => tool.slug))
  const matchedToolIds = new Set<string>()
  const matchedFavorites = new Map<string, ImportedFavorite>()
  const createdFavoriteTags = new Map<string, string[]>()
  const managedUpdates = []
  const creates = []

  for (const favorite of data.favorites) {
    const normalizedUrl = normalizeUrlForComparison(favorite.url)
    const existingTool = normalizedUrl ? existingByUrl.get(normalizedUrl) : undefined

    if (existingTool) {
      matchedToolIds.add(existingTool.id)
      matchedFavorites.set(existingTool.id, favorite)
      const isManagedImport =
        existingTool.status === ToolStatus.to_test &&
        existingTool.tags.some(({ tag }) => tag.slug === 'favori')
      if (isManagedImport) {
        managedUpdates.push(
          prisma.tool.update({
            where: { id: existingTool.id },
            data: {
              title: favorite.title,
              websiteUrl: favorite.websiteUrl ?? (favorite.isGithub ? null : favorite.url),
              githubUrl: favorite.githubUrl ?? (favorite.isGithub ? favorite.url : null),
              docsUrl: favorite.docsUrl ?? null,
              demoUrl: favorite.demoUrl ?? null,
              shortDescription: favorite.shortDescription,
              longDescription: favorite.longDescription ?? null,
              categoryId: categoryIds.get(favorite.categorySlug) ?? null,
              type: favorite.type ?? ToolType.other,
              license: favorite.license ?? null,
              pricing: favorite.pricing ?? null,
              isFavorite: true,
              isSelfHosted: favorite.isSelfHosted ?? false,
              hasDocker: favorite.hasDocker ?? false,
              isOpenSource: favorite.isOpenSource ?? false,
            },
          }),
        )
      }
      continue
    }

    const slug = uniqueSlug(favorite.slug, favorite.sourceHash, usedSlugs)
    createdFavoriteTags.set(slug, favorite.tags ?? [])
    creates.push({
      title: favorite.title,
      slug,
      websiteUrl: favorite.websiteUrl ?? (favorite.isGithub ? null : favorite.url),
      githubUrl: favorite.githubUrl ?? (favorite.isGithub ? favorite.url : null),
      docsUrl: favorite.docsUrl ?? null,
      demoUrl: favorite.demoUrl ?? null,
      shortDescription: favorite.shortDescription,
      longDescription: favorite.longDescription ?? null,
      categoryId: categoryIds.get(favorite.categorySlug) ?? null,
      type: favorite.type ?? ToolType.other,
      license: favorite.license ?? null,
      pricing: favorite.pricing ?? null,
      status: ToolStatus.to_test,
      isFavorite: true,
      isSelfHosted: favorite.isSelfHosted ?? false,
      hasDocker: favorite.hasDocker ?? false,
      isOpenSource: favorite.isOpenSource ?? false,
      createdAt: favorite.addedAt ? new Date(favorite.addedAt) : new Date(),
    })
  }

  const created = creates.length
    ? await prisma.tool.createMany({
        data: creates,
        skipDuplicates: true,
      })
    : { count: 0 }

  if (managedUpdates.length) {
    await prisma.$transaction(managedUpdates)
  }

  if (matchedToolIds.size) {
    await prisma.tool.updateMany({
      where: { id: { in: [...matchedToolIds] }, isFavorite: false },
      data: { isFavorite: true },
    })
  }

  const importedTools = await prisma.tool.findMany({
    where: {
      OR: [
        { id: { in: [...matchedToolIds] } },
        { slug: { in: creates.map((tool) => tool.slug) } },
      ],
    },
    select: { id: true, slug: true },
  })

  if (importedTools.length) {
    const toolTags = importedTools.flatMap((tool) => {
      const tags = matchedFavorites.get(tool.id)?.tags ?? createdFavoriteTags.get(tool.slug) ?? []
      return [...new Set(['favori', ...tags])].flatMap((slug) => {
        const tagId = tagIds.get(slug)
        return tagId ? [{ toolId: tool.id, tagId }] : []
      })
    })
    await prisma.toolTag.createMany({
      data: toolTags,
      skipDuplicates: true,
    })
  }

  return {
    sourceCount: data.sourceCount,
    duplicateCount: data.duplicateCount,
    createdCount: created.count,
    updatedCount: managedUpdates.length,
    matchedCount: matchedToolIds.size,
    categoryCount: categories.length,
    tagCount: importedTags.length,
  }
}
