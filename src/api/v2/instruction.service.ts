import {
  getAllInstructions as fetchAllInstructions,
  getInstruction as fetchInstruction,
} from '@/api/instruction.service'
import { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { InstructionId, QueryFilterInstruction } from '@/models/instruction.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterInstruction>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterInstruction>

export const getAllInstructions = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateInstructions } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::instructions::all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllInstructions(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateInstructions(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getInstruction = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  instructionId: RefOrRaw<InstructionId>,
  config: Config = {}
) => {
  const { translateInstruction } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::instructions::${unref(instructionId)}`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchInstruction(unref(organizationCode), unref(instructionId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateInstruction(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}
