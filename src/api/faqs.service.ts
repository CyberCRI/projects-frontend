import type { APIResponseList } from '@/api/types'
import type { FaqModel, FaqInput, FaqOutput } from '@/models/faq.model'
import useAPI from '@/composables/useAPI'

export async function getFaq(orgCode: string) {
    return (await useAPI(`organization/${orgCode}/faq/`, {})).data
}

export async function createFaq(body: FaqInput) {
    return (await useAPI(`organization/${body.organization_code}/faq/`, { body, method: 'POST' }))
        .data
}

export async function putFaq(body: FaqInput) {
    return (await useAPI(`organization/${body.organization_code}/faq/`, { body, method: 'PUT' }))
        .data
}

export async function patchFaq(orgCode: string, body: FaqInput) {
    return (await useAPI(`organization/${orgCode}/faq/`, { body, method: 'PATCH' })).data
}

export async function deleteFaq({ orgCode }) {
    return await useAPI(`organization/${orgCode}/faq/`, { method: 'DELETE' })
}

export async function postFaqImage({ orgCode, body }) {
    return (await useAPI(`organization/${orgCode}/faq-image/`, { body, method: 'POST' })).data
}
