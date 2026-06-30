import type BaseModel from '~/models/base.model'

export interface ReportModel extends BaseModel {
  id: number
  title: string
  message: string
  url: string
  reported_by: string
}

export type ReportForm = Omit<ReportModel, 'id'> & {
  recaptcha: string
}

export interface ContactModel extends BaseModel {
  id: number
  subject: string
  email: string
  content: string
}

export type ContactForm = Omit<ContactModel, 'id'> & {
  recaptcha: string
}
