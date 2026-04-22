// import type { APIResponseList } from '@/api/types'
import type {
  BlogEntryInput /*, BlogEntryOutput*/,
  BlogEntryModel,
  QueryFilterBlogEntry,
} from '@/models/blog-entry.model'
import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type ConfigBlogEntries = UseApiOptions<QueryFilterBlogEntry>

export async function getBlogEntries(projectId: ProjectSlugOrId, config: ConfigBlogEntries = {}) {
  return await useAPI<PaginationResult<BlogEntryModel>>(`project/${projectId}/blog-entry/`, config)
}

export async function getBlogEntry(body: BlogEntryInput) {
  return await useAPI(`project/${body.project_id}/blog-entry/${body.blog_entry_id}/`, {})
}

export async function postBlogEntry(blogEntry: BlogEntryInput) {
  return await useAPI(`project/${blogEntry.project_id}/blog-entry/`, {
    body: blogEntry,
    method: 'POST',
  }) //.data.value
}

export async function patchBlogEntry({
  project_id,
  body,
}: {
  project_id: string
  body: BlogEntryInput
}) {
  return await useAPI(`project/${project_id}/blog-entry/${body.id}/`, { body, method: 'PATCH' })
  //.data.value
}

export async function deleteBlogEntry({ project_id, id }: { project_id: string; id: number }) {
  return await useAPI(`project/${project_id}/blog-entry/${id}/`, { method: 'DELETE' })
}

export async function postBlogEntryImage({ body, project_id, blog_entry_id = null }) {
  const query = blog_entry_id ? { blog_entry_id } : {}
  return await useAPI(`project/${project_id}/blog-entry-image/`, { body, method: 'POST', query }) //.data.value
}
