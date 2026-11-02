import type {
  OrganizationModel,
  UserModel,
  QueryFilterAward,
} from 'shared-projects-frontend/models'
import { getResearcherAward as fetchAwards } from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig } from '~/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

export const getAwards = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncApiConfig<QueryFilterAward> = {}
) => {
  // const { translateAward } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::awards::${unref(researcherId)}`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAwards(unref(organizationCode), unref(researcherId), { ...DEFAULT_CONFIG, ...config }),
    {
      // translate: translateAward,
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}
