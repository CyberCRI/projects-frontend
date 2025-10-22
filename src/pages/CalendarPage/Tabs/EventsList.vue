<script setup>
import { getAllEvents } from '@/api/event.service'
import EventList from '@/components/event/EventList/EventList.vue'
import EventListSkeleton from '@/components/event/EventList/EventListSkeleton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
const organizationsStore = useOrganizationsStore()
const { translateEvents } = useAutoTranslate()
const _eventsFromAPi = ref([])
const eventsFromAPi = translateEvents(_eventsFromAPi)
const loading = ref(false)

const props = defineProps({ isFuture: { type: Boolean, default: false } })

const eventsByMonth = computed(() => {
  // sort and group by month
  return eventsFromAPi.value
    .slice(0)
    ?.sort((a, b) => {
      const mul = props.isFuture ? -1 : 1
      return mul * (new Date(b.event_date) - new Date(a.event_date))
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

const fetchEvents = async () => {
  // Fetch events
  loading.value = true
  // today date at midnight
  let todayZeroHour = new Date()
  todayZeroHour.setHours(0, 0, 0, 0)
  const options = props.isFuture
    ? {
        ordering: 'event_date',
        from_date: todayZeroHour.toISOString(),
      }
    : {
        ordering: '-event_date',
        to_date: todayZeroHour.toISOString(),
      }
  _eventsFromAPi.value = (await getAllEvents(organizationsStore.current?.code, options)).results

  loading.value = false
}

onMounted(fetchEvents)
</script>
<template>
  <EventListSkeleton v-if="loading" />
  <EventList v-else-if="hasEvent" :events-by-month="eventsByMonth" @reload-events="fetchEvents" />
  <p v-else class="no-event">
    {{ $t('event.no-event') }}
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
