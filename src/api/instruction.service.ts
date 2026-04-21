import type {
  InstructionId,
  InstructionInput,
  InstructionModel,
  QueryFilterInstruction,
} from '@/models/instruction.model'
import useAPI, { UseApiOptions } from '@/composables/useAPI'
import { OrganizationModel } from '@/models/organization.model'

type ConfigEvent = UseApiOptions<QueryFilterInstruction>

export async function getAllInstructions(
  organizationCode: OrganizationModel['code'],
  config?: ConfigEvent
) {
  return await useAPI<PaginationResult<InstructionModel>>(
    `organization/${organizationCode}/instruction/`,
    config
  )
}

export async function getInstruction(
  organizationCode: OrganizationModel['code'],
  idOrSlug: InstructionId,
  config?: ConfigEvent
) {
  return await useAPI<InstructionModel>(
    `organization/${organizationCode}/instruction/${idOrSlug}/`,
    config
  )
}

export async function createInstruction(
  organizationCode: OrganizationModel['code'],
  body: InstructionInput
) {
  return await useAPI<InstructionModel>(`organization/${organizationCode}/instruction/`, {
    body,
    method: 'POST',
  })
}

export async function putInstruction(
  organizationCode: OrganizationModel['code'],
  idOrSlug: InstructionId,
  body: InstructionInput
) {
  return await useAPI<InstructionModel>(
    `organization/${organizationCode}/instruction/${idOrSlug}/`,
    { body, method: 'PUT' }
  )
}

export async function patchInstruction(
  organizationCode: OrganizationModel['code'],
  idOrSlug: InstructionId,
  body: InstructionInput
) {
  return await useAPI<InstructionModel>(
    `organization/${organizationCode}/instruction/${idOrSlug}/`,
    {
      body,
      method: 'PATCH',
    }
  )
}

export async function deleteInstruction(
  organizationCode: OrganizationModel['code'],
  idOrSlug: InstructionId
) {
  return await useAPI<undefined>(`organization/${organizationCode}/instruction/${idOrSlug}/`, {
    method: 'DELETE',
  })
}
