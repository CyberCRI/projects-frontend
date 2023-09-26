import {
    postAnnouncement,
    deleteAnnouncement,
    patchAnnouncement,
} from '@/api/announcements.service'
import { AnnouncementInput, AnnouncementOutput } from '@/models/announcement.model'
import analytics from '@/analytics'

export interface AnnouncementsState {
    all: Array<AnnouncementOutput>
}

const state = () => ({
    all: [],
})

const getters = {
    all: (state: AnnouncementsState) => state.all,
}

const actions = {
    async postAnnouncement(
        { commit, rootState },
        body: AnnouncementInput
    ): Promise<AnnouncementOutput> {
        try {
            const result = await postAnnouncement(body)

            commit('projects/ADD_ANNOUNCEMENT', result, { root: true })

            analytics.announcement.addAnnouncement({
                project: {
                    id: rootState.projects.project.id,
                },
                announcement: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchAnnouncement(
        { commit, rootState },
        body: AnnouncementInput
    ): Promise<AnnouncementOutput> {
        try {
            const result = await patchAnnouncement(body)

            const index = rootState.projects.project.announcements.findIndex(
                (announcement) => announcement.id === result.id
            )

            commit('projects/UPDATE_ANNOUNCEMENT', { index, announcement: result }, { root: true })

            analytics.announcement.updateAnnouncement({
                project: {
                    id: rootState.projects.project.id,
                },
                announcement: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteAnnouncement({ commit, rootState }, body): Promise<void> {
        try {
            await deleteAnnouncement(body)

            const index = rootState.announcements.all.findIndex(
                (announcement) => body.id === announcement.id
            )

            commit('projects/DELETE_ANNOUNCEMENT', index, { root: true })

            analytics.announcement.removeAnnouncement({
                project: {
                    id: rootState.projects.project.id,
                },
                announcement: rootState.announcements.all[index],
            })
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_ALL_ANNOUNCEMENTS(state: AnnouncementsState, announcement: AnnouncementOutput[]): void {
        state.all = announcement
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
