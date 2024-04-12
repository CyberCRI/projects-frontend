import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { InstructionModel, InstructionInput, InstructionOutput } from '@/models/instruction.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

export async function getAllInstructions(
    orgCode: string,
    params: any
): Promise<APIResponseList<InstructionModel>> {
    const adaptedParams = params ? _adaptParamsToGetQuery(params) : null
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/`,
            adaptedParams
        )
    ).data
}

export async function getInstruction(
    orgCode: string,
    idOrSlug: number | string
): Promise<APIResponseList<InstructionModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/${idOrSlug}/`
        )
    ).data
}

export async function createInstruction(
    orgCode: string,
    body: InstructionInput
): Promise<APIResponseList<InstructionModel>> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/`,
            body
        )
    ).data
}

export async function putInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
): Promise<InstructionOutput> {
    return (
        await axios.put(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/${idOrSlug}/`,
            body
        )
    ).data
}

export async function patchInstruction(
    orgCode: string,
    idOrSlug: number | string,
    body: InstructionInput
): Promise<InstructionOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/${idOrSlug}/`,
            body
        )
    ).data
}

export async function deleteInstruction(
    orgCode: string,
    idOrSlug: number | string
): Promise<InstructionOutput> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${orgCode}/instruction/${idOrSlug}/`
        )
    ).data
}
