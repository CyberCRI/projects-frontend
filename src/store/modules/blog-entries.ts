import { BlogEntryOutput, BlogEntryInput } from '@/models/blog-entry.model'
import {
    getBlogEntries,
    postBlogEntry,
    patchBlogEntry,
    deleteBlogEntry,
} from '@/api/blogentries.service'
import { APIResponseList } from '@/api/types'
import analytics from '@/analytics'

const actions = {
    async getBlogEntries(
        { commit, rootState },
        projectId: string
    ): Promise<APIResponseList<BlogEntryOutput>> {
        try {
            const result = await getBlogEntries(projectId)

            commit('projects/SET_BLOG_ENTRIES', result, { root: true })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async postBlogEntry(
        { commit, rootState },
        blogEntry: BlogEntryInput
    ): Promise<BlogEntryOutput> {
        try {
            const result = await postBlogEntry(blogEntry)

            commit('projects/ADD_BLOG_ENTRY', result, { root: true })

            analytics.blog.addBlog({
                project: {
                    id: rootState.projects.project.id,
                },
                blogEntry: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchBlogEntry({ commit, rootState }, body: BlogEntryInput): Promise<BlogEntryOutput> {
        try {
            const result = await patchBlogEntry({
                project_id: rootState.projects.project.id,
                body: body,
            })

            const index = rootState.projects.project.blog_entries.findIndex(
                (entry) => entry.id === result.id
            )

            commit('projects/UPDATE_BLOG_ENTRY', { index, entry: result }, { root: true })

            analytics.blog.updateBlog({
                project: {
                    id: rootState.projects.project.id,
                },
                blogEntry: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteBlogEntry({ commit, rootState }, body: BlogEntryInput): Promise<void> {
        try {
            await deleteBlogEntry({
                id: body.id,
                project_id: rootState.projects.project.id,
            })

            const index = rootState.projects.project.blog_entries.findIndex(
                (blogEntry) => body.id === blogEntry.id
            )
            analytics.blog.removeBlog({
                project: {
                    id: rootState.projects.project.id,
                },
                blogEntry: rootState.projects.project.blog_entries[index],
            })

            commit('projects/DELETE_BLOG_ENTRY', index, { root: true })
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
