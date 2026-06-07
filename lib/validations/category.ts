import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  slug: z.string().min(1, 'Le slug est requis').max(100).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  description: z.string().max(500).optional(),
  icon: z.string().max(100).optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>
