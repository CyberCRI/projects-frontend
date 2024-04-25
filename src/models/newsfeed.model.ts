import { AnnouncementModel } from './announcement.model'
import BaseModel from './base.model'
import { ProjectModel } from './project.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export interface NewsfeedModel {
    id: number
    type: 'project' | 'announcement' | 'news'
    project?: any
    news?: any
    announcement?: any
}
