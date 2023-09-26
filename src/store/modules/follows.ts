import { FollowInput, FollowOutput } from '@/models/follow.model'
import { deleteFollow, postFollow, postFollowMany } from '@/api/follows.service'
import analytics from '@/analytics'

const actions = {
    async addFollow({ commit, rootState }, follow: FollowInput): Promise<FollowOutput> {
        try {
            const result = await postFollow(follow)

            commit('projects/ADD_FOLLOW', result, { root: true })

            analytics.follow.follow({
                project: {
                    id: rootState.projects.project.id,
                },
                follow: {
                    id: result.id,
                },
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async addFollowMany(
        { commit },
        {
            id,
            body,
        }: {
            id: string
            body: any
        }
    ) {
        try {
            const result = await postFollowMany({ id, body })
            const targets = []
            const body_followed_projects = body.follows
            for (let i = 0; i < body_followed_projects.length; i++) {
                const project = body_followed_projects[i]
                targets.push(project['project_id'])
            }
            for (let i = 0; i < result.length; i++) {
                const follow = result[i]
                if (targets.includes(follow.project['id'])) {
                    commit('projects/ADD_FOLLOW', follow, { root: true })
                    analytics.follow.follow({
                        project: {
                            id: follow.project.id,
                        },
                        follow: {
                            id: follow.id,
                        },
                    })
                }
            }

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteFollow({ commit }, { follower_id, project_id }: FollowInput): Promise<void> {
        try {
            const result = await deleteFollow({ follower_id, project_id })

            commit('projects/DELETE_FOLLOW', { root: true })

            analytics.follow.unfollow({
                project: {
                    id: project_id,
                },
                follow: {
                    id: follower_id,
                },
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
