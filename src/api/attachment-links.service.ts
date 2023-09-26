import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'

import { AttachmentLinkInput, AttachmentLinkOutput } from '@/models/attachment-link.model'

export async function getAttachmentLinks(
    id: string
): Promise<APIResponseList<AttachmentLinkOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/link/`))
        .data
}

export async function getAttachmentLink(body: AttachmentLinkInput): Promise<AttachmentLinkOutput> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/link/${
                body.link_id
            }`
        )
    ).data
}

export async function postAttachmentLinks(
    body: AttachmentLinkInput
): Promise<AttachmentLinkOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/link/`,
            body
        )
    ).data
}

export async function patchAttachmentLink(
    body: AttachmentLinkInput
): Promise<AttachmentLinkOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/link/${
                body.id
            }/`,
            body
        )
    ).data
}

export async function deleteAttachmentLink({ id, projectId }): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${projectId}/link/${id}/`
    )
}
