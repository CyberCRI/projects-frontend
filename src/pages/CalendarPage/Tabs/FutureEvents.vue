<template>
  <EventListSkeleton v-if="loading" />
  <EventList v-else-if="hasEvent" :events-by-month="eventsByMonth" @reload-events="fetchEvents" />
  <p v-else class="no-event">
    {{ $t('event.no-event') }}
  </p>
</template>
<script>
import EventList from '@/components/event/EventList/EventList.vue'
import EventListSkeleton from '@/components/event/EventList/EventListSkeleton.vue'
import { getAllEvents } from '@/api/event.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'FutureEvents',

  components: {
    EventListSkeleton,
    EventList,
  },
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      eventsByMonth: {},
      loading: false,
    }
  },

  computed: {
    hasEvent() {
      return Object.entries(this.eventsByMonth).length > 0
    },
  },

  mounted() {
    this.fetchEvents()
  },

  methods: {
    async fetchEvents() {
      // Fetch events
      this.loading = true
      // today date at midnight
      let todayZeroHour = new Date()
      todayZeroHour.setHours(0, 0, 0, 0)

      const eventsFromAPi = (
        await getAllEvents(this.organizationsStore.current?.code, {
          ordering: 'event_date',
          from_date: todayZeroHour.toISOString(),
        })
      ).results

      // sort and group by month
      const eventsByMonth = eventsFromAPi
        .sort((a, b) => {
          return new Date(a.event_date) - new Date(b.event_date)
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

      this.eventsByMonth = eventsByMonth

      this.loading = false
    },
  },
}
</script>
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
