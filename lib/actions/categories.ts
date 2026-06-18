'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations/category'
import { isAdmin } from '@/lib/auth'
import type { ActionResult } from './tools'

function unauthorizedActionResult<T = never>(): ActionResult<T> {
  return { success: false, error: 'Action non autorisée.' }
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { tools: true } } },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { tools: true } } },
  })
}

export async function createCategory(formData: unknown): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return unauthorizedActionResult()

  const parsed = categorySchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
    },
  })

  revalidatePath('/categories')
  revalidatePath('/admin/categories')
  return { success: true, data: { id: category.id } }
}

export async function updateCategory(id: string, formData: unknown): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return unauthorizedActionResult()

  const parsed = categorySchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const existing = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  })
  if (existing) {
    return { success: false, error: 'Ce slug est déjà utilisé' }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
    },
  })

  revalidatePath('/categories')
  revalidatePath('/admin/categories')
  return { success: true, data: { id: category.id } }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return unauthorizedActionResult()
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/categories')
    revalidatePath('/admin/categories')
    return { success: true, data: null }
  } catch {
    return { success: false, error: 'Impossible de supprimer cette catégorie (outils liés ?)' }
  }
}
