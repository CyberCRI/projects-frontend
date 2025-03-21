import analytics from '@/analytics'
import { ProjectAnalytic } from '@/analytics/project.analytic'

export interface Announcement {
  project: {
    id: string
  }
  announcement: {
    description: string
    title: string
    type: string
    status: string
    deadline: Date
    is_remunerated: boolean
  }
}

export default {
  /**
   * "Add announcement" analytic event
   * @param announcement
   */
  addAnnouncement(announcement: Announcement): void {
    analytics.track('add_announcement', announcement)
  },
  /**
   * "Update announcement" analytic event
   * @param announcement
   */
  updateAnnouncement(announcement: Announcement): void {
    analytics.track('update_announcement', announcement)
  },
  /**
   * "Remove announcement" analytic event
   * @param announcement
   */
  removeAnnouncement(announcement: Announcement): void {
    analytics.track('remove_announcement', announcement)
  },
  /**
   * "view announcement" analytic event
   * @param project
   */
  viewAnnouncement(project: ProjectAnalytic): void {
    analytics.track('view_announcement', {
      project: {
        id: project.id,
        name: project.title,
      },
    })
  },
  /**
   * "Announcement apply form opened" analytic event
   * @param project
   */
  applyFormAnnouncement(project: ProjectAnalytic) {
    analytics.track('apply_form_announcement', {
      project: {
        id: project.id,
        name: project.title,
      },
    })
  },
  /**
   * "Apply announcement project" analytic event
   * @param project
   */
  applyAnnouncementProject(project: ProjectAnalytic): void {
    analytics.track('apply_announcement_project', {
      project: {
        id: project.id,
        name: project.title,
      },
    })
  },
  showMoreAnnouncement() {
    analytics.track('show_more_announcement', {})
  },
  showLessAnnouncement() {
    analytics.track('show_less_announcement', {})
  },
}
