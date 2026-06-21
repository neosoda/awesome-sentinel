import { readFileSync } from 'node:fs'
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
  category: string
  categorySlug: string
  addedAt: string | null
}

type FavoritesData = {
  sourceCount: number
  duplicateCount: number
  favorites: ImportedFavorite[]
}

function normalizeUrlForComparison(value: string | null | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    url.hostname = url.hostname.toLowerCase()
    url.hash = ''

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
  const dataPath = join(__dirname, 'data', 'favorites.json')
  const data = JSON.parse(readFileSync(dataPath, 'utf8')) as FavoritesData

  const categoryEntries = [
    ...new Map(
      data.favorites.map((favorite) => [
        favorite.categorySlug,
        { name: favorite.category, slug: favorite.categorySlug },
      ]),
    ).values(),
  ]

  const categories = await Promise.all(
    categoryEntries.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: {
          ...category,
          icon: category.slug === 'a-voir' ? '🔖' : '🤖',
          description: `Favoris importés depuis « ${category.name} ».`,
        },
      }),
    ),
  )
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]))

  const favoriteTag = await prisma.tag.upsert({
    where: { slug: 'favori' },
    update: {},
    create: { name: 'favori', slug: 'favori' },
  })

  const existingTools = await prisma.tool.findMany({
    select: {
      id: true,
      slug: true,
      websiteUrl: true,
      githubUrl: true,
      isFavorite: true,
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
  const creates = []

  for (const favorite of data.favorites) {
    const normalizedUrl = normalizeUrlForComparison(favorite.url)
    const existingTool = normalizedUrl ? existingByUrl.get(normalizedUrl) : undefined

    if (existingTool) {
      matchedToolIds.add(existingTool.id)
      continue
    }

    creates.push({
      title: favorite.title,
      slug: uniqueSlug(favorite.slug, favorite.sourceHash, usedSlugs),
      websiteUrl: favorite.isGithub ? null : favorite.url,
      githubUrl: favorite.isGithub ? favorite.url : null,
      shortDescription: favorite.shortDescription,
      categoryId: categoryIds.get(favorite.categorySlug) ?? null,
      type: ToolType.other,
      status: ToolStatus.to_test,
      isFavorite: true,
      createdAt: favorite.addedAt ? new Date(favorite.addedAt) : new Date(),
    })
  }

  const created = creates.length
    ? await prisma.tool.createMany({
        data: creates,
        skipDuplicates: true,
      })
    : { count: 0 }

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
    select: { id: true },
  })

  if (importedTools.length) {
    await prisma.toolTag.createMany({
      data: importedTools.map((tool) => ({
        toolId: tool.id,
        tagId: favoriteTag.id,
      })),
      skipDuplicates: true,
    })
  }

  return {
    sourceCount: data.sourceCount,
    duplicateCount: data.duplicateCount,
    createdCount: created.count,
    matchedCount: matchedToolIds.size,
    categoryCount: categories.length,
  }
}
