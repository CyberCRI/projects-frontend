import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'

import { AttachmentFileInput, AttachmentFileOutput } from '@/models/attachment-file.model'

export async function getAttachmentFiles(
    id: string
): Promise<APIResponseList<AttachmentFileOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/file/`))
        .data
}

export async function getAttachmentFile(
    body: AttachmentFileInput
): Promise<APIResponseList<AttachmentFileOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/file/${
                body.file
            }`
        )
    ).data
}

export async function postAttachmentFiles(
    body: AttachmentFileInput
): Promise<AttachmentFileOutput> {
    const headers = {
        'Content-Type': 'multipart/form-data',
    }

    const fd = new FormData()
    fd.append('description', body.description)
    fd.append('title', body.title)
    fd.append('project_id', body.project_id)

    fd.append('src', body.file, body.file.name)
    fd.append('file', body.file)
    fd.append('mime', body.file.type || 'file')
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/file/`,
            fd,
            {
                headers,
            }
        )
    ).data
}

export async function patchAttachmentFile(
    body: AttachmentFileInput
): Promise<AttachmentFileOutput> {
    const headers = {
        'Content-Type': 'multipart/form-data',
    }

    const fd = new FormData()
    fd.append('description', body.description)
    fd.append('title', body.title)
    fd.append('project_id', body.project_id)

    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/file/${
                body.id
            }/`,
            fd,
            {
                headers,
            }
        )
    ).data
}

export async function deleteAttachmentFile({ id, projectId }): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${projectId}/file/${id}/`
    )
}
