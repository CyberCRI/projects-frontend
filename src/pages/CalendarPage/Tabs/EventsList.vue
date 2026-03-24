<template>
  <FetchLoader :status="status" only-error skeleton>
    <EventList
      v-if="data.length"
      :events-by-month="eventsGrouped"
      :reverse-date="!props.isFuture"
      @reload="refresh"
    />
    <EmptyLabel v-else class="no-event" :label="$t('event.no-event')" />
    <PaginationButtonsV2 :pagination="pagination" />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getAllEvents } from '@/api/v2/event.service'
import EventList from '@/components/event/EventList/EventList.vue'
import { QueryFilterEvent } from '@/models/event.model'
import { factoryPagination } from '@/skeletons/base.skeletons'
import { eventSkeleton } from '@/skeletons/event.skeletons'
import { groupBy } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    isFuture?: boolean
  }>(),
  {
    isFuture: false,
  }
)

const LIMIT_SKELETON = 10
const now = new Date()
now.setHours(0, 0, 0, 0)

const organizationCode = useOrganizationCode()
const { query } = useQuery<QueryFilterEvent>({
  ordering: props.isFuture ? 'event_date' : '-event_date',
  from_date: props.isFuture ? now.toISOString() : null,
  to_date: props.isFuture ? null : now.toISOString(),
})
const { status, data, refresh, pagination } = getAllEvents(organizationCode, {
  query,
  paginationConfig: {
    limit: LIMIT_SKELETON,
  },
  default: () => factoryPagination(eventSkeleton, LIMIT_SKELETON),
})

const eventsGrouped = computed(() => {
  return groupBy(data.value, (event) => {
    const date = new Date(event.event_date)
    // reset day/hours to get only year and month
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date.toString()
  })
})
</script>

<style lang="scss" scoped>
.no-event {
  padding: 3rem 0;
}
</style>
