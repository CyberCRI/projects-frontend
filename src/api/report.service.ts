import { ReportCreateModel, ContactModel } from '@/models/report.model'
import { AxiosResponse } from 'axios'
import { axios } from '@/api/api.config'

export async function reportBug(
    orgCode: String,
    formData: ReportCreateModel
): Promise<AxiosResponse> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/report/bug/`,
            formData
        )
    ).data
}

export async function reportAbuse(
    orgCode: String,
    formData: ReportCreateModel
): Promise<AxiosResponse> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/report/abuse/`,
            formData
        )
    ).data
}

export async function contactUs(orgCode: String, formData: ContactModel): Promise<AxiosResponse> {
    return await axios.post(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/contact/us/`,
        formData
    )
}
