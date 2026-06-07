import { z } from 'zod'

export const ToolTypeEnum = z.enum([
  'self_hosted',
  'saas',
  'cli',
  'desktop',
  'mobile',
  'api',
  'library',
  'browser_extension',
  'devtool',
  'other',
])

export const ToolStatusEnum = z.enum([
  'to_test',
  'tested',
  'recommended',
  'abandoned',
  'watching',
])

export const toolSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis').max(200).regex(/^[a-z0-9-]+$/, 'Slug invalide (minuscules, chiffres, tirets uniquement)'),
  websiteUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  githubUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  docsUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  demoUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  shortDescription: z.string().min(1, 'La description courte est requise').max(500),
  longDescription: z.string().optional(),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  type: ToolTypeEnum.default('other'),
  license: z.string().max(100).optional(),
  pricing: z.string().max(200).optional(),
  status: ToolStatusEnum.default('to_test'),
  personalScore: z.coerce.number().min(0).max(10).optional().nullable(),
  publicNotes: z.string().optional(),
  isFavorite: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  isSelfHosted: z.boolean().default(false),
  hasDocker: z.boolean().default(false),
  isOpenSource: z.boolean().default(false),
  tagIds: z.array(z.string()).default([]),
})

export type ToolFormData = z.infer<typeof toolSchema>
