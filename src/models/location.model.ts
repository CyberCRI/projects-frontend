import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { ProjectModel, TranslatedProject } from '@/models/project.model'
import { LocationType } from '@/models/types'

/**
 * @name LocationModel
 * @description Location of a project
 */
export interface LocationModel extends BaseModel {
  id: number
  lat: number
  lng: number
  type: LocationType
  project: ProjectModel
  title: string
  description: string
}

export type TranslatedLocation = Omit<
  Translated<LocationModel, 'title' | 'description'>,
  'project'
> & {
  project: TranslatedProject
}

export type LocationInput = Required<LocationModel> & {
  project_id: string
}

export type LocationOutput = Omit<Required<LocationModel>, 'project'>
