import { getLocations as fetchGetLocations } from '@/api/locations.services'
import useAsyncAPI from '@/composables/useAsyncAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { Locations } from '@/interfaces/maps'
import { RefOrRaw } from '@/interfaces/utils'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getLocations = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config = {}
) => {
  const { translatePeopleGroupLocations, translateProjectLocations } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::locations`)

  const translateAllModel = (data: ComputedRef<Locations>) => {
    return computed(() => {
      return {
        groups: unref(translatePeopleGroupLocations(data.value?.groups)),
        projects: unref(translateProjectLocations(data.value?.projects)),
      }
    })
  }

  return useAsyncAPI(key, () => fetchGetLocations(unref(organizationCode), { ...DEFAULT_CONFIG }), {
    translate: translateAllModel,
    watch: onlyRefs([organizationCode]),
    ...config,
  })
}
