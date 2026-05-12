import type { BlogEntryModel } from '@/models/blog-entry.model'

export const blogentriesSkeletons = (
  def?: Partial<BlogEntryModel>
): Omit<BlogEntryModel, 'id'> => ({
  title: 'title',
  content: 'Ipsum nostrud officia dolor esse exercitation mollit',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...(def || {}),
})
