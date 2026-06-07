'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { toolSchema } from '@/lib/validations/tool'
import { slugify } from '@/lib/utils'

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function getTools(params?: {
  search?: string
  categoryId?: string
  tagSlug?: string
  type?: string
  status?: string
  isSelfHosted?: boolean
  hasDocker?: boolean
  isOpenSource?: boolean
  sortBy?: string
}) {
  const where: Record<string, unknown> = {}

  if (params?.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { shortDescription: { contains: params.search, mode: 'insensitive' } },
      { longDescription: { contains: params.search, mode: 'insensitive' } },
    ]
  }
  if (params?.categoryId) where.categoryId = params.categoryId
  if (params?.type) where.type = params.type
  if (params?.status) where.status = params.status
  if (params?.isSelfHosted !== undefined) where.isSelfHosted = params.isSelfHosted
  if (params?.hasDocker !== undefined) where.hasDocker = params.hasDocker
  if (params?.isOpenSource !== undefined) where.isOpenSource = params.isOpenSource
  if (params?.tagSlug) {
    where.tags = { some: { tag: { slug: params.tagSlug } } }
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (params?.sortBy === 'name') orderBy = { title: 'asc' }
  if (params?.sortBy === 'updated') orderBy = { updatedAt: 'desc' }
  if (params?.sortBy === 'recommended') orderBy = { isRecommended: 'desc' }

  return prisma.tool.findMany({
    where,
    orderBy,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })
}

export async function getToolBySlug(slug: string) {
  return prisma.tool.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })
}

export async function getToolById(id: string) {
  return prisma.tool.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })
}

export async function createTool(formData: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = toolSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const data = parsed.data
  const { tagIds, categoryId, ...rest } = data

  // Check slug uniqueness
  const existing = await prisma.tool.findUnique({ where: { slug: rest.slug } })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const tool = await prisma.tool.create({
    data: {
      ...rest,
      websiteUrl: rest.websiteUrl || null,
      githubUrl: rest.githubUrl || null,
      docsUrl: rest.docsUrl || null,
      demoUrl: rest.demoUrl || null,
      imageUrl: rest.imageUrl || null,
      longDescription: rest.longDescription || null,
      license: rest.license || null,
      pricing: rest.pricing || null,
      publicNotes: rest.publicNotes || null,
      categoryId: categoryId || null,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  })

  revalidatePath('/tools')
  revalidatePath('/')
  return { success: true, data: { id: tool.id, slug: tool.slug } }
}

export async function updateTool(id: string, formData: unknown): Promise<ActionResult<{ slug: string }>> {
  const parsed = toolSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const data = parsed.data
  const { tagIds, categoryId, ...rest } = data

  // Check slug uniqueness (excluding current tool)
  const existing = await prisma.tool.findFirst({
    where: { slug: rest.slug, NOT: { id } },
  })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const tool = await prisma.tool.update({
    where: { id },
    data: {
      ...rest,
      websiteUrl: rest.websiteUrl || null,
      githubUrl: rest.githubUrl || null,
      docsUrl: rest.docsUrl || null,
      demoUrl: rest.demoUrl || null,
      imageUrl: rest.imageUrl || null,
      longDescription: rest.longDescription || null,
      license: rest.license || null,
      pricing: rest.pricing || null,
      publicNotes: rest.publicNotes || null,
      categoryId: categoryId || null,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  })

  revalidatePath('/tools')
  revalidatePath(`/tools/${tool.slug}`)
  revalidatePath('/')
  return { success: true, data: { slug: tool.slug } }
}

export async function deleteTool(id: string): Promise<ActionResult> {
  try {
    await prisma.tool.delete({ where: { id } })
    revalidatePath('/tools')
    revalidatePath('/admin/tools')
    revalidatePath('/')
    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Impossible de supprimer cet outil' }
  }
}

export async function generateSlug(title: string): Promise<string> {
  return slugify(title)
}
