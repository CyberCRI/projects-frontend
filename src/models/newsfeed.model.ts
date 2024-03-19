import { AnnouncementModel } from './announcement.model'
import BaseModel from './base.model'
import { ProjectModel } from './project.model'

/**
 * @name NewsfeedModel
 * @description Newsfeed models
 */

export interface NewsfeedModel extends BaseModel {
    project: ProjectModel
    announcement: AnnouncementModel
    type: string
}
