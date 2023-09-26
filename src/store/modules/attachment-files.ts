import { AttachmentFileInput, AttachmentFileOutput } from '@/models/attachment-file.model'

import {
    postAttachmentFiles,
    patchAttachmentFile,
    deleteAttachmentFile,
} from '@/api/attachment-files.service'
import analytics from '@/analytics'

const actions = {
    async postAttachmentFiles(
        { commit, rootState },
        body: AttachmentFileInput
    ): Promise<AttachmentFileOutput> {
        try {
            const result = await postAttachmentFiles({
                project_id: rootState.projects.project.id,
                body,
            })

            commit('projects/ADD_ATTACHMENT_FILE', result, { root: true })

            analytics.attachmentFile.addAttachment({
                project: {
                    id: rootState.projects.project.id,
                },
                attachment: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchAttachmentFile(
        { commit, rootState },
        body: AttachmentFileInput
    ): Promise<AttachmentFileOutput> {
        try {
            const result = await patchAttachmentFile(body)
            const index = rootState.projects.project.files.findIndex(
                (file) => file.id === result.id
            )

            commit('projects/UPDATE_ATTACHMENT_FILE', { index, file: result }, { root: true })
            analytics.attachmentFile.updateAttachment({
                project: {
                    id: rootState.projects.project.id,
                },
                attachment: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteAttachmentFile({ commit, rootState }, id: number): Promise<void> {
        try {
            await deleteAttachmentFile({ id: id, projectId: rootState.projects.project.id })

            const index = rootState.projects.project.files.findIndex((file) => id === file.id)
            analytics.attachmentFile.removeAttachment({
                project: {
                    id: rootState.projects.project.id,
                },
                attachment: rootState.projects.project.files[index],
            })

            commit('projects/DELETE_ATTACHMENT_FILE', index, { root: true })
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
