import analytics from '@/analytics/index'
import { ProjectMessageModel } from '@/models/project-message.model'

export interface ProjectMessageAnalytic {
  project: {
    id: string
  }
  projectMessage: ProjectMessageModel
}

export default {
  /**
   * "ProjectMessage" analytic event
   * @param projectMessage
   */
  projectMessage(projectMessage: ProjectMessageAnalytic): void {
    analytics.track('project_message', projectMessage)
  },
  /**
   * "Update Project Message" analytic event
   * @param projectMessage
   */
  updateProjectMessage(projectMessage: ProjectMessageAnalytic): void {
    analytics.track('update_project_message', projectMessage)
  },
  /**
   * "Delete Project Message" analytic event
   * @param projectMessage
   */
  deleteProjectMessage(projectMessage: ProjectMessageAnalytic): void {
    analytics.track('delete_project_message', projectMessage)
  },
}
