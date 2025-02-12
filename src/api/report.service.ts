import type { ReportCreateModel, ContactModel } from '@/models/report.model'
import useAPI from '@/composables/useAPI'

export async function reportBug(orgCode: String, formData: ReportCreateModel) {
    return await useAPI(`organization/${orgCode}/report/bug/`, { body: formData, method: 'POST' })
    //.data.value
}

export async function reportAbuse(orgCode: String, formData: ReportCreateModel) {
    return await useAPI(`organization/${orgCode}/report/abuse/`, { body: formData, method: 'POST' }) //.data.value
}

export async function contactUs(orgCode: String, formData: ContactModel) {
    return await useAPI(`organization/${orgCode}/contact/us/`, { body: formData, method: 'POST' })
}
