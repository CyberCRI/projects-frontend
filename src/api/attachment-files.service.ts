import type { APIResponseList } from '@/api/types'

import type { AttachmentFileInput, AttachmentFileOutput } from '@/models/attachment-file.model'

import useAPI from '@/composables/useAPI'

export async function getAttachmentFiles(id: string) {
    return (await useAPI(`project/${id}/file/`, {})).data.value
}

export async function getAttachmentFile(body: AttachmentFileInput) {
    return (await useAPI(`project/${body.project_id}/file/${body.file}`, {})).data.value
}

export async function postAttachmentFiles(body: AttachmentFileInput) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'cache-control': 'no-cache',
    }

    const fd = new FormData()
    fd.append('description', body.description)
    fd.append('title', body.title)
    fd.append('project_id', body.project_id)

    fd.append('file', body.file, body.file.name)
    fd.append('mime', body.file.type || 'file')
    return (
        await useAPI(`project/${body.project_id}/file/`, {
            body: fd,
            headers,
            method: 'POST',
        })
    ).data.value
}

export async function patchAttachmentFile(body: AttachmentFileInput) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'cache-control': 'no-cache',
    }

    const fd = new FormData()
    fd.append('description', body.description)
    fd.append('title', body.title)
    fd.append('project_id', body.project_id)

    return (
        await useAPI(`project/${body.project_id}/file/${body.id}/`, {
            headers,
            body: fd,
            method: 'PATCH',
        })
    ).data.value
}

export async function deleteAttachmentFile({ id, projectId }) {
    return await useAPI(`project/${projectId}/file/${id}/`, { method: 'DELETE' })
}
