import { ProjectModel } from '~/models/project.model'
import { Translated } from '~/interfaces/translated'
import { ImageModel } from '~/models/image.model'
import { ProjectTabType } from '~/models/types'
import BaseModel from '~/models/base.model'

export interface ProjectTab extends BaseModel {
  id?: number
  project?: ProjectModel
  type: ProjectTabType
  title: string
  description: string | null
  icon: string | null
  images?: ImageModel[]
}

export type ProjectTabForm = Partial<ProjectTab>

export type TranslatedProjectTab = Translated<ProjectTab, 'title' | 'description'>

export interface ProjectTabItem extends BaseModel {
  id?: number
  tab?: ProjectTab
  title: string
  content: string
  images?: ImageModel[]
  created_at: string
  updated_at: string
}

export type TranslatedProjectTabItem = Translated<ProjectTabItem, 'title' | 'content'>

export type ProjectTabItemForm = Partial<ProjectTabItem>
