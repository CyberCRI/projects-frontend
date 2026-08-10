import type { OrganizationModel, TranslatedLocationGeneral } from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import { getLocations as fetchGetLocations } from 'shared-projects-frontend/apis'

import useAsyncAPI from '~/composables/useAsyncAPI'

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
    ({ config }) =>
      fetchGetLocations(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode]),
      translate: (data) => translateLocations<TranslatedLocationGeneral>(data),
      ...config,
    }
  )
}
