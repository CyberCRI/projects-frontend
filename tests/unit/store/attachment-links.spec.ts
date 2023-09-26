import attachmentLinksStore from '@/store/modules/attachment-links'
import {
    postAttachmentLinks,
    getAttachmentLink,
    patchAttachmentLink,
    deleteAttachmentLink,
} from '@/api/attachment-links.service'
import { ProjectFactory } from '../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import {
    AttachmentLinkFactory,
    AttachmentLinkInputFactory,
} from '../../factories/attachment-link.factory'
import analytics from '@/analytics'

vi.mock('vuex')
vi.mock('@/analytics')
vi.mock('@/api/attachment-links.service')

const project = ProjectFactory.generate()

describe('Store module | AttachmentLinks | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project,
        },
    }

    it('postAttachmentLinks', async () => {
        const attachmentLinks = AttachmentLinkInputFactory.generate()
        const postAttachmentLinksMock = postAttachmentLinks as Mock
        const addAttachmentMock = analytics.attachmentLink.addAttachment as Mock

        postAttachmentLinksMock.mockResolvedValue({ results: attachmentLinks })

        const result = await attachmentLinksStore.actions.postAttachmentLinks(
            { commit, rootState },
            attachmentLinks
        )

        expect(commit).toHaveBeenCalledWith('projects/ADD_ATTACHMENT_LINK', result, { root: true })
        expect(postAttachmentLinksMock).toHaveBeenCalledWith(attachmentLinks)
        expect(addAttachmentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            attachment: result,
        })

        postAttachmentLinksMock.mockImplementation(() => {
            throw new Error()
        })

        expect(postAttachmentLinksMock).toThrowError()
    })

    it('getAttachmentLink', async () => {
        const attachmentLink = AttachmentLinkFactory.generate()
        const getAttachmentLinkMock = getAttachmentLink as Mock

        getAttachmentLinkMock.mockResolvedValue({ results: attachmentLink })

        await attachmentLinksStore.actions.getAttachmentLink({
            link_id: attachmentLink.id.toString(),
            project_id: '123',
        })

        expect(getAttachmentLinkMock).toHaveBeenCalledWith({
            link_id: attachmentLink.id.toString(),
            project_id: '123',
        })

        getAttachmentLinkMock.mockImplementation(() => {
            throw new Error()
        })

        expect(getAttachmentLinkMock).toThrowError()
    })

    it('patchAttachmentLink', async () => {
        const attachmentLink = AttachmentLinkInputFactory.generate()
        const patchAttachmentLinkMock = patchAttachmentLink as Mock
        const updateAttachmentMock = analytics.attachmentLink.updateAttachment as Mock

        patchAttachmentLinkMock.mockResolvedValue(attachmentLink)

        const result = await attachmentLinksStore.actions.patchAttachmentLink(
            { commit, rootState },
            attachmentLink
        )

        const index = rootState.projects.project.links.findIndex((link) => link.id === result.id)

        expect(commit).toHaveBeenCalledWith(
            'projects/UPDATE_ATTACHMENT_LINK',
            { index, link: result },
            { root: true }
        )
        expect(patchAttachmentLinkMock).toHaveBeenCalledWith(attachmentLink)
        expect(updateAttachmentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            attachment: attachmentLink,
        })

        patchAttachmentLinkMock.mockImplementation(() => {
            throw new Error()
        })

        expect(patchAttachmentLinkMock).toThrowError()
    })

    it('deleteAttachmentLink', async () => {
        const attachmentLinks = rootState.projects.project.links
        const deleteAttachmentLinkMock = deleteAttachmentLink as Mock
        const removeAttachmentMock = analytics.attachmentLink.removeAttachment as Mock

        deleteAttachmentLinkMock.mockResolvedValue({ results: attachmentLinks })

        await attachmentLinksStore.actions.deleteAttachmentLink(
            { commit, rootState },
            attachmentLinks[0].id
        )

        expect(commit).toHaveBeenCalledWith('projects/DELETE_ATTACHMENT_LINK', 0, { root: true })
        expect(deleteAttachmentLinkMock).toHaveBeenCalledWith({
            id: attachmentLinks[0].id,
            projectId: project.id,
        })

        expect(removeAttachmentMock).toHaveBeenCalled()

        deleteAttachmentLinkMock.mockImplementation(() => {
            throw new Error()
        })

        expect(deleteAttachmentLinkMock).toThrowError()
    })
})
