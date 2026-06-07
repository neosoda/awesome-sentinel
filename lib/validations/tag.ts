import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  slug: z.string().min(1, 'Le slug est requis').max(100).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
})

export type TagFormData = z.infer<typeof tagSchema>
