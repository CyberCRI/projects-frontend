import type {
  BlogEntryForm,
  BlogEntryId,
  BlogEntryModel,
  QueryFilterBlogEntry,
} from '@/models/blog-entry.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import type { ImageModel } from '~/models/image.model'
import useAPI from '@/composables/useAPI'

type ConfigBlogEntry = UseApiOptions
type ConfigBlogEntries = UseApiOptions<QueryFilterBlogEntry>

export async function getBlogEntries(projectId: ProjectSlugOrId, config: ConfigBlogEntries = {}) {
  return await useAPI<PaginationResult<BlogEntryModel>>(`project/${projectId}/blog-entry/`, config)
}

export async function getBlogEntry(
  projectId: ProjectSlugOrId,
  blogEntryId: BlogEntryId,
  config: ConfigBlogEntry = {}
) {
  return await useAPI<BlogEntryModel>(`project/${projectId}/blog-entry/${blogEntryId}/`, config)
}

export async function postBlogEntry(projectId: ProjectSlugOrId, body: BlogEntryForm) {
  return await useAPI<BlogEntryModel>(`project/${projectId}/blog-entry/`, {
    body,
    method: 'POST',
  })
}

export async function patchBlogEntry(
  projectId: ProjectSlugOrId,
  blogEntryId: BlogEntryId,
  body: BlogEntryForm
) {
  return await useAPI<BlogEntryModel>(`project/${projectId}/blog-entry/${blogEntryId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteBlogEntry(projectId: ProjectSlugOrId, blogEntryId: BlogEntryId) {
  return await useAPI<undefined>(`project/${projectId}/blog-entry/${blogEntryId}/`, {
    method: 'DELETE',
  })
}

export async function postBlogEntryImage(
  projectId: ProjectSlugOrId,
  body: FormData,
  config: ConfigBlogEntry = {}
) {
  return await useAPI<ImageModel>(`project/${projectId}/blog-entry-image/`, {
    ...config,
    body,
    method: 'POST',
  })
}
