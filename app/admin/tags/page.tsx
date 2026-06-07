import { getTags } from '@/lib/actions/tags'
import { AdminTagsClient } from '@/components/admin/AdminTagsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tags' }

export default async function AdminTagsPage() {
  const tags = await getTags()
  return (
    <div className="max-w-3xl">
      <AdminTagsClient tags={tags} />
    </div>
  )
}
