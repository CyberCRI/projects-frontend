import type { OrganizationModel } from '~/models/organization.model'

import type { RefOrRaw } from '~/interfaces/utils'

import { getLocations as fetchGetLocations } from '~/api/locations.service'

import useAsyncAPI from '~/composables/useAsyncAPI'

import type { TranslatedLocationGeneral } from '~/interfaces/maps'
import { onlyRefs } from '~/functs/onlyRefs'

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
