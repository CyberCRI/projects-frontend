import blogEntriesStore from '@/store/modules/blog-entries'
import {
    getBlogEntries,
    postBlogEntry,
    patchBlogEntry,
    deleteBlogEntry,
} from '@/api/blogentries.service'
import { ProjectFactory } from '../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { BlogEntryInputFactory } from '../../../factories/blog-entry.factory'
import analytics from '@/analytics'

vi.mock('vuex')
vi.mock('@/api/blogentries.service')
vi.mock('@/analytics')

describe('Store module | BlogEntries | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
    }

    it('getBlogEntries', async () => {
        const blogEntries = BlogEntryInputFactory.generateMany(2)
        const getBlogEntriesMock = getBlogEntries as Mock

        getBlogEntriesMock.mockResolvedValue({ results: blogEntries })

        const result = await blogEntriesStore.actions.getBlogEntries(
            { commit, rootState },
            rootState.projects.project.id
        )

        expect(getBlogEntriesMock).toHaveBeenCalled()
        expect(commit).toHaveBeenCalledWith('projects/SET_BLOG_ENTRIES', result, { root: true })

        getBlogEntriesMock.mockImplementation(() => {
            throw new Error()
        })

        expect(getBlogEntriesMock).toThrowError()
    })

    it('postBlogEntry', async () => {
        const blogEntries = BlogEntryInputFactory.generate()
        const postBlogEntryMock = postBlogEntry as Mock
        const addBlogMock = analytics.blog.addBlog as Mock

        postBlogEntryMock.mockResolvedValue({ results: blogEntries })

        const result = await blogEntriesStore.actions.postBlogEntry(
            { commit, rootState },
            blogEntries
        )

        expect(postBlogEntryMock).toHaveBeenCalledWith(blogEntries)
        expect(commit).toHaveBeenCalledWith('projects/ADD_BLOG_ENTRY', result, { root: true })
        expect(addBlogMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            blogEntry: result,
        })

        postBlogEntryMock.mockImplementation(() => {
            throw new Error()
        })

        expect(postBlogEntryMock).toThrowError()
    })

    it('patchBlogEntry', async () => {
        const blogEntries = BlogEntryInputFactory.generate()
        const patchBlogEntryMock = patchBlogEntry as Mock
        const updateBlogMock = analytics.blog.updateBlog as Mock

        patchBlogEntryMock.mockResolvedValue({ results: blogEntries })

        const result = await blogEntriesStore.actions.patchBlogEntry(
            { commit, rootState },
            blogEntries
        )

        const index = rootState.projects.project.blog_entries.findIndex(
            (entry) => entry.id === result.id
        )

        expect(commit).toHaveBeenCalledWith(
            'projects/UPDATE_BLOG_ENTRY',
            { index, entry: result },
            { root: true }
        )

        expect(patchBlogEntryMock).toHaveBeenCalledWith({
            project_id: rootState.projects.project.id,
            body: blogEntries,
        })
        expect(updateBlogMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            blogEntry: result,
        })

        patchBlogEntryMock.mockImplementation(() => {
            throw new Error()
        })

        expect(patchBlogEntryMock).toThrowError()
    })

    it('deleteBlogEntry', async () => {
        const blogEntries = BlogEntryInputFactory.generate()
        const deleteBlogEntryMock = deleteBlogEntry as Mock
        const deleteBlogMock = analytics.blog.removeBlog as Mock

        deleteBlogEntryMock.mockResolvedValue({ results: blogEntries })

        await blogEntriesStore.actions.deleteBlogEntry({ commit, rootState }, blogEntries)

        expect(deleteBlogEntryMock).toHaveBeenCalledWith({
            id: blogEntries.id,
            project_id: rootState.projects.project.id,
        })
        expect(deleteBlogMock).toHaveBeenCalled()

        deleteBlogEntryMock.mockImplementation(() => {
            throw new Error()
        })

        expect(deleteBlogEntryMock).toThrowError()
    })
})
