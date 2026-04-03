import { getLocations as fetchGetLocations } from '@/api/locations.services'
import useAsyncAPI from '@/composables/useAsyncAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { TranslatedLocationGeneral } from '@/interfaces/maps'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getLocations = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::locations`)
  const { translateLocations } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) => fetchGetLocations(unref(organizationCode), { ...DEFAULT_CONFIG, ...config }),
    {
      watch: onlyRefs([organizationCode]),
      translate: (data) => translateLocations<TranslatedLocationGeneral>(data),
      ...config,
    }
  )
}
