import BaseModel from '@/models/base.model'
import { LocationType } from '@/models/types'

/**
 * @name LocationModel
 * @description Location of a project
 */
export interface LocationModel extends BaseModel {
  lat: number
  lng: number
  type: LocationType
  project: {
    id: string
  }
}

export type LocationInput = Required<LocationModel> & {
  project_id: string
}

export type LocationOutput = Required<LocationModel>
