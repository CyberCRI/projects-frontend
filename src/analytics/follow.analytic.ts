import analytics from '@/analytics/index'

export interface FollowAnalytic {
  project: {
    id: string
  }
  follow: {
    id: number
  }
}

export interface FollowCategoryAnalytic {
  category: {
    id: number
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
  /**
   * "Follow" analytic event
   * @param follow
   */
  followCategory(follow: FollowCategoryAnalytic): void {
    analytics.track('follow_category', follow)
  },
  /**
   * "Unfollow" analytic event
   * @param follow
   */
  unfollowCategory(follow: FollowCategoryAnalytic): void {
    analytics.track('unfollow_category', follow)
  },
}
