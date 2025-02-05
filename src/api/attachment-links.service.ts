import type { APIResponseList } from '@/api/types'

import type { AttachmentLinkInput, AttachmentLinkOutput } from '@/models/attachment-link.model'

import useAPI from '@/composables/useAPI'

export async function getAttachmentLinks(id: string) {
    return (await useAPI(`project/${id}/link/`, {})).data.value
}

export async function getAttachmentLink(body: AttachmentLinkInput) {
    return (await useAPI(`project/${body.project_id}/link/${body.link_id}`, {})).data.value
}

export async function postAttachmentLinks(body: AttachmentLinkInput) {
    return (await useAPI(`project/${body.project_id}/link/`, { body, method: 'POST' })).data.value
}

export async function patchAttachmentLink(body: AttachmentLinkInput) {
    return (await useAPI(`project/${body.project_id}/link/${body.id}/`, { body, method: 'PATCH' }))
        .data.value
}

export async function deleteAttachmentLink({ id, projectId }) {
    return await useAPI(`project/${projectId}/link/${id}/`, { method: 'DELETE' })
}
