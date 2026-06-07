'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations/tag'
import type { ActionResult } from './tools'

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { tools: true } } },
  })
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: { _count: { select: { tools: true } } },
  })
}

export async function createTag(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = tagSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const existing = await prisma.tag.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const tag = await prisma.tag.create({ data: parsed.data })

  revalidatePath('/admin/tags')
  return { success: true, data: { id: tag.id } }
}

export async function updateTag(id: string, formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = tagSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const existing = await prisma.tag.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const tag = await prisma.tag.update({ where: { id }, data: parsed.data })

  revalidatePath('/admin/tags')
  return { success: true, data: { id: tag.id } }
}

export async function deleteTag(id: string): Promise<ActionResult> {
  try {
    await prisma.tag.delete({ where: { id } })
    revalidatePath('/admin/tags')
    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Impossible de supprimer ce tag' }
  }
}
