import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { FaqModel, FaqInput, FaqOutput } from '@/models/faq.model'

export async function getFaq(orgCode: string): Promise<APIResponseList<FaqModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/faq/`
        )
    ).data
}

export async function createFaq(body: FaqInput): Promise<APIResponseList<FaqModel>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization_code
            }/faq/`,
            body
        )
    ).data
}

export async function putFaq(body: FaqInput): Promise<FaqOutput> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${
                body.organization_code
            }/faq/`,
            body
        )
    ).data
}

export async function patchFaq(orgCode: string, body: FaqInput): Promise<FaqOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/faq/`,
            body
        )
    ).data
}

export async function deleteFaq({ orgCode }): Promise<FaqOutput> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/faq/`
    )
}

export async function postFaqImage({ orgCode, body }): Promise<FaqOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/faq-image/`,
            body
        )
    ).data
}
