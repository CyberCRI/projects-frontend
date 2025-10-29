<script setup lang="ts">
import { api } from '@/api/SwaggerProjects'
import EventList from '@/components/event/EventList/EventList.vue'
import EventListSkeleton from '@/components/event/EventList/EventListSkeleton.vue'
import { useAsyncPaginatedAPI } from '@/composables/useAsyncAPI'
import useOrganizationsStore from '@/stores/useOrganizations'

defineOptions({ name: 'EventsList' })

const props = defineProps({ isFuture: { type: Boolean, default: false } })

const organizationsStore = useOrganizationsStore()
const { translateEvents } = useAutoTranslate()
const { t } = useNuxtI18n()

const { status, data, refresh } = useAsyncPaginatedAPI('organizationEventList', ({ query }) => {
  const todayZeroHour = new Date()
  todayZeroHour.setHours(0, 0, 0, 0)
  const newQuery = {
    ...query,
    // if isFuture reverse ordering with "-"
    ordering: `${props.isFuture ? '-' : ''}event_date`,
    from_date: todayZeroHour.toISOString(),
  }
  return api.v1.organizationEventList(organizationsStore.current.code, newQuery)
})

const eventsFromAPi = translateEvents(data)
const isLoading = computed(() => status.value !== 'success')

const eventsByMonth = computed(() => {
  // sort and group by month
  return eventsFromAPi.value
    .slice(0)
    ?.sort((a, b) => {
      const mul = props.isFuture ? -1 : 1
      return mul * (new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    })
    .reduce((acc, event) => {
      // keep the year in key !
      const key = event.event_date.split('-').slice(0, 2).join('-')
      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(event)

      return acc
    }, {})
})

const hasEvent = computed(() => {
  return Object.entries(eventsByMonth.value).length > 0
})
</script>
<template>
  <EventListSkeleton v-if="isLoading" />
  <EventList v-else-if="hasEvent" :events-by-month="eventsByMonth" @reload-events="refresh" />
  <p v-else class="no-event">
    {{ t('event.no-event') }}
  </p>
</template>

<style lang="scss" scoped>
.loader-ctn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
}

.no-event {
  text-align: center;
  padding: 3rem 0;
}
</style>
