<template>
    <EventListSkeleton v-if="loading" />
    <EventList v-else :events-by-month="eventsByMonth" @reload-events="fetchEvents" />
</template>
<script>
import EventListSkeleton from '@/components/event/EventList/EventListSkeleton.vue'
import EventList from '@/components/event/EventList/EventList.vue'
import { getAllEvents } from '@/api/event.service'

export default {
    name: 'PastEvents',

    components: {
        EventListSkeleton,
        EventList,
    },

    data() {
        return {
            eventsByMonth: [],
            loading: false,
        }
    },

    mounted() {
        this.fetchEvents()
    },

    methods: {
        async fetchEvents() {
            // Fetch events
            this.loading = true
            const eventsFromAPi = (
                await getAllEvents(this.$store.getters['organizations/current']?.code, {
                    ordering: '-event_date',
                    to_date: new Date().toISOString(),
                })
            ).results

            // sort and group by month
            const eventsByMonth = eventsFromAPi
                .sort((a, b) => {
                    return new Date(b.event_date) - new Date(a.event_date)
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
</style>
