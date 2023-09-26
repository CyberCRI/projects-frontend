import { ReportCreateModel, ContactModel } from '@/models/report.model'
import { AxiosResponse } from 'axios'
import { axios } from '@/api/api.config'

export async function reportBug(formData: ReportCreateModel): Promise<AxiosResponse> {
    return (
        await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/report/bug/`, formData)
    ).data
}

export async function reportAbuse(formData: ReportCreateModel): Promise<AxiosResponse> {
    return (
        await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/report/abuse/`, formData)
    ).data
}

export async function contactUs(formData: ContactModel): Promise<AxiosResponse> {
    return await axios.post(`${process.env.VUE_APP_API_DEFAULT_VERSION}/contact/us/`, formData)
}
