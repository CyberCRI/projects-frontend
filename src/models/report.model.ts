import type BaseModel from '~/models/base.model'

export interface ReportModel extends BaseModel {
  id: number
  title: string
  message: string
  url: string
  reported_by: string
}

export type ReportForm = Omit<ReportModel, 'id'>

export interface ContactModel {
  subject: string
  email: string
  content: string
}
