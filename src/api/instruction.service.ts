import type { APIResponseList } from '@/api/types'
import type {
    InstructionModel,
    InstructionInput,
    InstructionOutput,
} from '@/models/instruction.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'

export async function getAllInstructions(orgCode: string, params: any) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : {}
    return await useAPI(`organization/${orgCode}/instruction/`, { ...adaptedParams }) //.data.value
}

export async function getInstruction(orgCode: string, idOrSlug: number | string) {
    return await useAPI(`organization/${orgCode}/instruction/${idOrSlug}/`, {}) //.data.value
}

export async function createInstruction(orgCode: string, body: InstructionInput) {
    return (await useAPI(`organization/${orgCode}/instruction/`, { body, method: 'POST' })).data
        .value
}

export async function putInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
) {
    return await useAPI(`organization/${orgCode}/instruction/${idOrSlug}/`, { body, method: 'PUT' }) //.data.value
}

export async function patchInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
) {
    return await useAPI(`organization/${orgCode}/instruction/${idOrSlug}/`, {
        body,
        method: 'PATCH',
    }) //.data.value
}

export async function deleteInstruction(orgCode: string, idOrSlug: number | string) {
    return await useAPI(`organization/${orgCode}/instruction/${idOrSlug}/`, { method: 'DELETE' })
    //.data.value
}
