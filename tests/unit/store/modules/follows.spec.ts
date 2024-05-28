import followsStore from '@/store/modules/follows'

import { FollowFactory, FollowInputFactory } from '../../../factories/follow.factory'
import { deleteFollow, postFollow, getUserFollows } from '@/api/follows.service'
import analytics from '@/analytics'
import { ProjectFactory } from '../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/follows.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | Follows | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
        // TODO: needed ?
        // users: {
        //     keycloak_id: '',
        // },
    }

    // TODO: recheck this ambiguous nrebase stuff (removed from store)
    // it('getUserFollows', async () => {
    //     const follow = FollowFactory.generateMany(1)
    //     const getUserFollowsMock = getUserFollows as Mock

    //     getUserFollowsMock.mockResolvedValue({ results: follow })

    //     await followsStore.actions.getUserFollows(
    //         { commit, rootState },
    //         {
    //             follower_id: follow[0].id,
    //             project_id: rootState.projects.project.id,
    //         }
    //     )

    //     expect(getUserFollowsMock).toHaveBeenCalledWith({
    //         follower_id: follow[0].id,
    //         project_id: rootState.projects.project.id,
    //     })
    // })
    it('postFollow', async () => {
        const follow = FollowInputFactory.generate()
        const postFollowAsMock = postFollow as Mock
        const setFollowMock = analytics.follow.follow as Mock

        postFollowAsMock.mockResolvedValue(follow)

        const result = await followsStore.actions.addFollow({ commit, rootState }, follow)

        expect(result).toBe(follow)
        expect(setFollowMock).toHaveBeenCalled()
    })

    it('deleteFollow', async () => {
        const follow = FollowInputFactory.generate()
        const deleteFollowAsMock = deleteFollow as Mock
        const setUnfollowMock = analytics.follow.unfollow as Mock

        deleteFollowAsMock.mockResolvedValue(follow)

        const result = await followsStore.actions.deleteFollow({ commit }, follow)

        expect(result).toBe(follow)
        expect(setUnfollowMock).toHaveBeenCalled()
    })
})
