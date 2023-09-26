import { AttachmentLinkInput, AttachmentLinkOutput } from '@/models/attachment-link.model'
import {
    postAttachmentLinks,
    getAttachmentLink,
    patchAttachmentLink,
    deleteAttachmentLink,
} from '@/api/attachment-links.service'
import analytics from '@/analytics'

const actions = {
    async getAttachmentLink(body): Promise<AttachmentLinkOutput> {
        try {
            return await getAttachmentLink(body)
        } catch (err) {
            throw new Error(err)
        }
    },

    async postAttachmentLinks(
        { commit, rootState },
        body: AttachmentLinkInput
    ): Promise<AttachmentLinkOutput> {
        try {
            const result = await postAttachmentLinks(body)

            commit('projects/ADD_ATTACHMENT_LINK', result, { root: true })

            analytics.attachmentLink.addAttachment({
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

    async patchAttachmentLink(
        { commit, rootState },
        body: AttachmentLinkInput
    ): Promise<AttachmentLinkOutput> {
        try {
            const result = await patchAttachmentLink(body)
            const index = rootState.projects.project.links.findIndex(
                (link) => link.id === result.id
            )

            commit('projects/UPDATE_ATTACHMENT_LINK', { index, link: result }, { root: true })

            analytics.attachmentLink.updateAttachment({
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
    async deleteAttachmentLink({ commit, rootState }, id: number): Promise<void> {
        try {
            await deleteAttachmentLink({
                id,
                projectId: rootState.projects.project.id,
            })

            const index = rootState.projects.project.links.findIndex((link) => id === link.id)

            commit('projects/DELETE_ATTACHMENT_LINK', index, { root: true })

            analytics.attachmentLink.removeAttachment({
                project: {
                    id: rootState.projects.project.id,
                },
                attachment: rootState.projects.project.files[index],
            })
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
