import type { ProjectModel } from '~/models/project.model'
import type { Translated } from '~/interfaces/translated'
import type { IconImageChoice } from '~/functs/IconImage'
import type { ImageModel } from '~/models/image.model'
import type BaseModel from '~/models/base.model'

export interface ProjectTab extends BaseModel {
  id?: number
  project?: ProjectModel
  title: string
  description: string | null
  icon: IconImageChoice | null
  images?: ImageModel[]
  modules: {
    items: number
  }
}

export type ProjectTabForm = Partial<Omit<ProjectTab, 'modules'>>

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

export type ProjectTabItemForm = Partial<
  ProjectTabItem & {
    images_ids: number[]
  }
>
