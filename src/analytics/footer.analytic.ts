import analytics from '@/analytics'

export default {
  /**
   * " Send bug report" analytic event
   */
  sendBugReport(): void {
    analytics.track('send_bug_report', {})
  },
}
