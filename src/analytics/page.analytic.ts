import analytics from '@/analytics'

export interface PageAnalytic {
  name: string
  url: string
}

export default {
  /**
   * "Page viewed" analytic event
   * @param page
   * @param additionalProperties
   */
  viewed(page: PageAnalytic, additionalProperties?: any): void {
    analytics.track('page_viewed', {
      page,
      ...additionalProperties,
    })
    // Increment page views for user authenticated
    analytics.mixpanel.people.increment('page_views')
  },
}
