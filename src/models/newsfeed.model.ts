import { Project } from '@playwright/test'
import { AnnouncementModel, TranslatedAnnouncement } from './announcement.model'
import { TranslatedProject } from './project.model'
import { NewsModel, TranslatedNews } from '~/models/news.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export type NewsfeedModel = {
  id: number
  type: 'project' | 'announcement' | 'news'
  project?: Project
  news?: NewsModel
  announcement?: AnnouncementModel
}

export type TranslatedNewsfeed = Pick<NewsfeedModel, 'id' | 'type'> & {
  project?: TranslatedProject
  news?: TranslatedNews
  announcement?: TranslatedAnnouncement
}
