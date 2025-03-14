export interface ReportCreateModel {
  title: string
  message: string
  url: string
  reported_by: string
}

export interface ContactModel {
  subject: string
  email: string
  content: string
}
