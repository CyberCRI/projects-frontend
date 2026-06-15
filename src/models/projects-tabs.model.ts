import type { ProjectModel } from '~/models/project.model'
import type { Translated } from '~/interfaces/translated'
import type { IconImageChoice } from '~/functs/IconImage'
import type { ImageModel } from '~/models/image.model'
import type { ProjectTabType } from '~/models/types'
import type BaseModel from '~/models/base.model'

export interface ProjectTab extends BaseModel {
  id?: number
  project?: ProjectModel
  title: string
  type: ProjectTabType
  description: string | null
  icon: IconImageChoice | null
  images?: ImageModel[]
  show_preview: boolean
  modules: {
    items: number
  }
}

export type ProjectTabForm = Partial<
  Omit<ProjectTab, 'modules' | 'images'> & {
    images_ids: number[]
  }
>

export type TranslatedProjectTab = Translated<ProjectTab, 'title' | 'description'>

export interface ProjectTabItem extends BaseModel {
  id: number
  tab?: ProjectTab
  title: string
  content: string
  images?: number[]
  created_at: string
  updated_at: string
}

export type TranslatedProjectTabItem = Translated<ProjectTabItem, 'title' | 'content'>

export type ProjectTabItemForm = Partial<
  ProjectTabItem & {
    images_ids: number[]
  }
>
