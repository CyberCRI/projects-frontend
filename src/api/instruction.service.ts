import type { APIResponseList } from '@/api/types'
import type {
    InstructionModel,
    InstructionInput,
    InstructionOutput,
} from '@/models/instruction.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'

export async function getAllInstructions(orgCode: string, params: any) {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (await useAPI(`/organization/${orgCode}/instruction/`, { params: adaptedParams })).data
}

export async function getInstruction(orgCode: string, idOrSlug: number | string) {
    return (await useAPI(`/organization/${orgCode}/instruction/${idOrSlug}/`, {})).data
}

export async function createInstruction(orgCode: string, body: InstructionInput) {
    return (await useAPI(`/organization/${orgCode}/instruction/`, { body, method: 'POST' })).data
}

export async function putInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
) {
    return (
        await useAPI(`/organization/${orgCode}/instruction/${idOrSlug}/`, { body, method: 'PUT' })
    ).data
}

export async function patchInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
) {
    return (
        await useAPI(`/organization/${orgCode}/instruction/${idOrSlug}/`, {
            body,
            method: 'PATCH',
        })
    ).data
}

export async function deleteInstruction(orgCode: string, idOrSlug: number | string) {
    return (await useAPI(`/organization/${orgCode}/instruction/${idOrSlug}/`, { method: 'DELETE' }))
        .data
}
