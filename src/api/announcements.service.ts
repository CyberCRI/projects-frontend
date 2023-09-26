import { axios } from '@/api/api.config'
import {
    AnnouncementInput,
    AnnouncementOutput,
    AnnouncementApplyInput,
} from '@/models/announcement.model'
import { APIResponseList } from '@/api/types'
import utils from '@/functs/functions'

export async function getAnnouncements(params): Promise<APIResponseList<AnnouncementOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/announcement/`,
            utils.adaptParam(params)
        )
    ).data
}

export async function getProjectAnnouncements({
    project_id,
    params,
}: {
    project_id: string
    params
}): Promise<APIResponseList<AnnouncementOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/announcement/`,
            utils.adaptParam(params)
        )
    ).data
}

export async function postAnnouncement(body: AnnouncementInput): Promise<AnnouncementOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                body.project_id
            }/announcement/`,
            body
        )
    ).data
}

export async function patchAnnouncement(body: AnnouncementInput): Promise<AnnouncementOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                body.project_id
            }/announcement/${body.id}/`,
            body
        )
    ).data
}

export async function deleteAnnouncement(body): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project.id}/announcement/${
            body.id
        }/`
    )
}

export async function applyAnnouncement(body: AnnouncementApplyInput): Promise<void> {
    return await axios.post(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/announcement/${
            body.announcement_id
        }/apply/`,
        body
    )
}
