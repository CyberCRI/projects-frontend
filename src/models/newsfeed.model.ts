import { AnnouncementModel } from './announcement.model'
import { ProjectModel } from './project.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export interface NewsfeedModel {
  id: number
  type: 'project' | 'announcement' | 'news'
  project?: ProjectModel
  news?: any // TODO: Define news model
  announcement?: AnnouncementModel
}
