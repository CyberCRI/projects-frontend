<template>
    <EventListSkeleton v-if="loading" />
    <EventList v-else-if="hasEvent" :events-by-month="eventsByMonth" @reload-events="fetchEvents" />
    <p class="no-event" v-else>{{ $t('event.no-event') }}</p>
</template>
<script>
import EventList from '@/components/event/EventList/EventList.vue'
import EventListSkeleton from '@/components/event/EventList/EventListSkeleton.vue'
import { getAllEvents } from '@/api/event.service'

export default {
    name: 'FutureEvents',

    components: {
        EventListSkeleton,
        EventList,
    },

    data() {
        return {
            eventsByMonth: {},
            loading: false,
        }
    },

    mounted() {
        this.fetchEvents()
    },

    computed: {
        hasEvent() {
            return Object.entries(this.eventsByMonth).length > 0
        },
    },

    methods: {
        async fetchEvents() {
            // Fetch events
            this.loading = true
            const eventsFromAPi = (
                await getAllEvents(this.$store.getters['organizations/current']?.code, {
                    ordering: 'event_date',
                    from_date: new Date().toISOString(),
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
