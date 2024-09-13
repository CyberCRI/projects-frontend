import { FollowInput, FollowOutput } from '@/models/follow.model'
import { deleteFollow, postFollow, postFollowMany } from '@/api/follows.service'
import analytics from '@/analytics'

async function follow(follow: FollowInput): Promise<FollowOutput> {
    const result = await postFollow(follow)

    // commit('projects/ADD_FOLLOW', result, { root: true })

    analytics.follow.follow({
        project: {
            id: follow.project_id,
        },
        follow: {
            id: follow.follower_id,
        },
    })

    return result
}

async function followMany({ id, body }: { id: string; body: any }) {
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
            // commit('projects/ADD_FOLLOW', follow, { root: true })
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
}

async function unfollow({ follower_id, project_id }: FollowInput): Promise<void> {
    const result = await deleteFollow({ follower_id, project_id })

    // commit('projects/DELETE_FOLLOW', { root: true })

    analytics.follow.unfollow({
        project: {
            id: project_id,
        },
        follow: {
            id: follower_id,
        },
    })

    return result
}

export default {
    follow,
    followMany,
    unfollow,
}
