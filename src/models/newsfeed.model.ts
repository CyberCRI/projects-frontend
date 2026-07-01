import type { AnnouncementModel, TranslatedAnnouncement } from '~/models/announcement.model'
import type { ProjectModel, TranslatedProject } from '~/models/project.model'
import type { NewsModel, TranslatedNews } from '~/models/news.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export type NewsfeedModel = {
  id: number
  type: 'project' | 'announcement' | 'news'
  project?: ProjectModel
  news?: NewsModel
  announcement?: AnnouncementModel
}

export type TranslatedNewsfeed = Pick<NewsfeedModel, 'id' | 'type'> & {
  project?: TranslatedProject
  news?: TranslatedNews
  announcement?: TranslatedAnnouncement
}
