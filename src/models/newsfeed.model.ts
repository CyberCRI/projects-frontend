import { TranslatedAnnouncement } from './announcement.model'
import { TranslatedProject } from './project.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export interface NewsfeedModel {
  id: number
  type: 'project' | 'announcement' | 'news'
  project?: TranslatedProject
  news?: any // TODO: Define news model
  announcement?: TranslatedAnnouncement
}
