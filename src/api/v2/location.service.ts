import { getLocations as fetchGetLocations } from '@/api/locations.services'
import useAsyncAPI from '@/composables/useAsyncAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getLocations = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::locations`)

  return useAsyncAPI(key, () => fetchGetLocations(unref(organizationCode), { ...DEFAULT_CONFIG }), {
    watch: onlyRefs([organizationCode]),
    ...config,
  })
}
