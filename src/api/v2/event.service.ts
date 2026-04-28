import { getEvent as fetchEvent, getAllEvents as fetchAllEvents } from '~/api/event.service'
import { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'
import { onlyRefs } from '~/functs/onlyRefs'
import { RefOrRaw } from '~/interfaces/utils'
import { EventModel, QueryFilterEvent } from '~/models/event.model'
import { OrganizationModel } from '~/models/organization.model'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterEvent>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterEvent>

export const getAllEvents = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  config: ConfigPagination = {}
) => {
  const { translateEvents } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::event::all`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchAllEvents(unref(organizationCode), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateEvents(data),
      watch: onlyRefs([organizationCode]),
      ...config,
    }
  )
}

export const getEvent = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  eventId: RefOrRaw<EventModel['id']>,
  config: Config = {}
) => {
  const { translateEvent } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::event::${unref(eventId)}`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchEvent(unref(organizationCode), unref(eventId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateEvent(data),
      watch: onlyRefs([organizationCode, eventId]),
      ...config,
    }
  )
}
