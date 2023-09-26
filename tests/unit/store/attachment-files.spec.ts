import attachmentFilesStore from '@/store/modules/attachment-files'
import {
    postAttachmentFiles,
    patchAttachmentFile,
    deleteAttachmentFile,
} from '@/api/attachment-files.service'
import analytics from '@/analytics'
import { ProjectFactory } from '../../factories/project.factory'

import {
    AttachmentFileFactory,
    AttachmentFileInputFactory,
} from '../../factories/attachment-file.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/attachment-files.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | AttachmentFiles | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
        attachmentFiles: {
            all: AttachmentFileFactory.generateMany(2),
        },
    }

    it('postAttachmentFiles', async () => {
        const attachmentFiles = AttachmentFileInputFactory.generate()
        const postAttachmentFilesMock = postAttachmentFiles as Mock
        const addAttachmentMock = analytics.attachmentFile.addAttachment as Mock

        postAttachmentFilesMock.mockResolvedValue({ results: attachmentFiles })

        const result = await attachmentFilesStore.actions.postAttachmentFiles(
            { commit, rootState },
            attachmentFiles
        )
        expect(commit).toHaveBeenCalledWith('projects/ADD_ATTACHMENT_FILE', result, { root: true })
        expect(postAttachmentFilesMock).toHaveBeenCalledWith({
            body: attachmentFiles,
            project_id: rootState.projects.project.id,
        })
        expect(addAttachmentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            attachment: result,
        })

        addAttachmentMock.mockImplementation(() => {
            throw new Error()
        })

        expect(addAttachmentMock).toThrowError()
    })

    it('patchAttachmentFile', async () => {
        const attachmentFile = AttachmentFileInputFactory.generate()
        const patchAttachmentFileMock = patchAttachmentFile as Mock
        const updateAttachmentMock = analytics.attachmentFile.updateAttachment as Mock

        patchAttachmentFileMock.mockResolvedValue({ results: attachmentFile })

        const result = await attachmentFilesStore.actions.patchAttachmentFile(
            { commit, rootState },
            attachmentFile
        )
        const index = rootState.projects.project.files.findIndex((file) => file.id === result.id)

        expect(commit).toHaveBeenCalledWith(
            'projects/UPDATE_ATTACHMENT_FILE',
            { index, file: result },
            { root: true }
        )
        expect(patchAttachmentFileMock).toHaveBeenCalledWith(attachmentFile)
        expect(updateAttachmentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            attachment: result,
        })

        patchAttachmentFileMock.mockImplementation(() => {
            throw new Error()
        })

        expect(patchAttachmentFileMock).toThrowError()
    })

    it('deleteAttachmentFile', async () => {
        const files = rootState.projects.project.files
        const deleteAttachmentFileMock = deleteAttachmentFile as Mock
        const removeAttachmentMock = analytics.attachmentFile.removeAttachment as Mock

        deleteAttachmentFileMock.mockResolvedValue(files)

        await attachmentFilesStore.actions.deleteAttachmentFile({ commit, rootState }, files[1].id)

        expect(commit).toHaveBeenCalledWith('projects/DELETE_ATTACHMENT_FILE', 1, { root: true })
        expect(deleteAttachmentFileMock).toHaveBeenCalledWith({
            id: files[1].id,
            projectId: rootState.projects.project.id,
        })
        expect(removeAttachmentMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            attachment: files[1],
        })

        deleteAttachmentFileMock.mockImplementation(() => {
            throw new Error()
        })

        expect(deleteAttachmentFileMock).toThrowError()
    })
})
