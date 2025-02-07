// import type { APIResponseList } from '@/api/types'
import type { BlogEntryInput /*, BlogEntryOutput*/ } from '@/models/blog-entry.model'
import useAPI from '@/composables/useAPI'

export async function getBlogEntries(id) {
    return await useAPI(`project/${id}/blog-entry/`, {}) //.data.value
}

export async function getBlogEntry(body: BlogEntryInput) {
    return (await useAPI(`project/${body.project_id}/blog-entry/${body.blog_entry_id}`, {})).data
        .value
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

export async function postBlogEntryImage({ body, project_id }) {
    return (await useAPI(`project/${project_id}/blog-entry-image/`, { body, method: 'POST' })).data
        .value
}
