import analytics from '@/analytics/index'

export interface FollowAnalytic {
    project: {
        id: string
    }
    follow: {
        id: number
    }
}

export default {
    /**
     * "Follow" analytic event
     * @param follow
     */
    follow(follow: FollowAnalytic): void {
        analytics.track('follow_project', follow)
    },
    /**
     * "Unfollow" analytic event
     * @param follow
     */
    unfollow(follow: FollowAnalytic): void {
        analytics.track('unfollow_project', follow)
    },
}
