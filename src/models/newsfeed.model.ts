import type { Project } from '@playwright/test'

import type { NewsModel, TranslatedNews } from '~/models/news.model'

import type { AnnouncementModel, TranslatedAnnouncement } from './announcement.model'
import type { TranslatedProject } from './project.model'

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
