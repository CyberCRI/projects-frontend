import announcementsStore from '@/store/modules/announcements'
import {
    postAnnouncement,
    deleteAnnouncement,
    patchAnnouncement,
} from '@/api/announcements.service'
import { ProjectFactory } from '../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import {
    AnnouncementFactory,
    AnnouncementInputFactory,
} from '../../../factories/announcement.factory'
import analytics from '@/analytics'

vi.mock('@/api/announcements.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | announcements | actions', () => {
    const state = {
        all: AnnouncementFactory.generateMany(2),
    }

    it('all', () => {
        const result = announcementsStore.getters.all(state)

        expect(result).toBe(state.all)
    })
})

describe('Store module | announcements | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
        announcements: {
            all: AnnouncementFactory.generateMany(2),
        },
    }

    // TODO recheck this (ambiguous rebase stuff)

    // it('getAnnouncements', async () => {
    //     const announcements = AnnouncementFactory.generateMany(2)
    //     const getAnnouncementsMock = getAnnouncements as Mock

    //     getAnnouncementsMock.mockResolvedValue({ results: announcements })

    //     await announcementsStore.actions.getAnnouncements({ commit, rootState }, {})

    //     expect(getAnnouncementsMock).toHaveBeenCalledWith({})

    //     getAnnouncementsMock.mockImplementation(() => {
    //         throw new Error()
    //     })

    //     expect(getAnnouncementsMock).toThrowError()
    // })

    // it('getProjectAnnouncements', async () => {
    //     const announcements = AnnouncementFactory.generateMany(2)
    //     const getProjectAnnouncementsMock = getProjectAnnouncements as Mock

    //     getProjectAnnouncementsMock.mockResolvedValue({ results: announcements })

    //     await announcementsStore.actions.getProjectAnnouncements(
    //         { commit, rootState },
    //         { project_id: rootState.projects.project.id, params: {} }
    //     )

    //     expect(commit).toHaveBeenCalledWith('SET_ALL_ANNOUNCEMENTS', announcements)
    //     expect(getProjectAnnouncementsMock).toHaveBeenCalledWith({
    //         params: {},
    //         project_id: rootState.projects.project.id,
    //     })

    //     getProjectAnnouncementsMock.mockImplementation(() => {
    //         throw new Error()
    //     })

    //     expect(getProjectAnnouncementsMock).toThrowError()
    // })

    it('postAnnouncement', async () => {
        const announcement = AnnouncementInputFactory.generate()
        const postAnnouncementAsMock = postAnnouncement as Mock
        const addAnnouncementMock = analytics.announcement.addAnnouncement as Mock

        postAnnouncementAsMock.mockResolvedValue(announcement)

        const result = await announcementsStore.actions.postAnnouncement(
            { commit, rootState },
            announcement
        )

        expect(commit).toHaveBeenCalledWith('projects/ADD_ANNOUNCEMENT', announcement, {
            root: true,
        })
        expect(postAnnouncementAsMock).toHaveBeenCalledWith(announcement)
        expect(addAnnouncementMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            announcement: result,
        })

        postAnnouncementAsMock.mockImplementation(() => {
            throw new Error()
        })

        expect(postAnnouncementAsMock).toThrowError()
    })

    it('patchAnnouncement', async () => {
        const announcement = AnnouncementInputFactory.generate()
        const patchAnnouncementAsMock = patchAnnouncement as Mock
        const updateAnnouncementMock = analytics.announcement.updateAnnouncement as Mock

        patchAnnouncementAsMock.mockResolvedValue(announcement)

        const result = await announcementsStore.actions.patchAnnouncement(
            { commit, rootState },
            announcement
        )

        const index = rootState.projects.project.announcements.findIndex(
            (announcement) => announcement.id === result.id
        )

        expect(commit).toHaveBeenCalledWith(
            'projects/UPDATE_ANNOUNCEMENT',
            { index, announcement },
            { root: true }
        )
        expect(patchAnnouncementAsMock).toHaveBeenCalledWith(announcement)
        expect(updateAnnouncementMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            announcement: result,
        })

        patchAnnouncementAsMock.mockImplementation(() => {
            throw new Error()
        })

        expect(patchAnnouncementAsMock).toThrowError()
    })

    it('deleteAnnouncement', async () => {
        const announcement = rootState.announcements.all
        const deleteAnnouncementMock = deleteAnnouncement as Mock
        const removeAnnouncementMock = analytics.announcement.removeAnnouncement as Mock

        deleteAnnouncementMock.mockResolvedValue(announcement)

        await announcementsStore.actions.deleteAnnouncement({ commit, rootState }, announcement[1])

        expect(commit).toHaveBeenCalledWith('projects/DELETE_ANNOUNCEMENT', 1, { root: true })
        expect(deleteAnnouncementMock).toHaveBeenCalledWith(announcement[1])
        expect(removeAnnouncementMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            announcement: announcement[1],
        })

        deleteAnnouncementMock.mockImplementation(() => {
            throw new Error()
        })

        expect(deleteAnnouncementMock).toThrowError()
    })
})

describe('Store module | announcements | mutations', () => {
    const state = {
        all: AnnouncementFactory.generateMany(2),
    }

    it('SET_ALL_ANNOUNCEMENTS', () => {
        const payload = AnnouncementFactory.generateMany(2)
        announcementsStore.mutations.SET_ALL_ANNOUNCEMENTS(state, payload)

        expect(state.all).toEqual(payload)
    })
})
