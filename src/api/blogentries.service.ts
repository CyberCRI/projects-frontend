import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { BlogEntryInput, BlogEntryOutput } from '@/models/blog-entry.model'

export async function getBlogEntries(id): Promise<APIResponseList<BlogEntryOutput>> {
    return (
        await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/blog-entry/`)
    ).data
}

export async function getBlogEntry(
    body: BlogEntryInput
): Promise<APIResponseList<BlogEntryOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                body.project_id
            }/blog-entry/${body.blog_entry_id}`
        )
    ).data
}

export async function postBlogEntry(blogEntry: BlogEntryInput): Promise<BlogEntryOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                blogEntry.project_id
            }/blog-entry/`,
            blogEntry
        )
    ).data
}

export async function patchBlogEntry({
    project_id,
    body,
}: {
    project_id: string
    body: BlogEntryInput
}): Promise<BlogEntryOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/blog-entry/${
                body.id
            }/`,
            body
        )
    ).data
}

export async function deleteBlogEntry({
    project_id,
    id,
}: {
    project_id: string
    id: number
}): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/blog-entry/${id}/`
    )
}

export async function postBlogEntryImage({ body, project_id }) {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/project/${project_id}/blog-entry-image/`,
            body
        )
    ).data
}
