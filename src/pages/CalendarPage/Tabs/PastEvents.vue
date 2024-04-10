<template>
    <EventListSkeleton v-if="loading" />
    <EventList v-else :events-by-month="eventsByMonth" />
</template>
<script>
import EventListSkeleton from '@/components/lpikit/EventList/EventListSkeleton.vue'

import EventList from '@/components/lpikit/EventList/EventList.vue'
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
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const eventsFromAPi = [
                {
                    id: 1,
                    date: '2023-03-25',
                    name: 'Event 1',
                    information: 'Information 1',
                    groups: [],
                    date_edited: '2024-01-25T12:00:00Z',
                },
                {
                    id: 2,
                    date: '2023-03-28',
                    name: 'Event 2',
                    information: 'Information 2',
                    groups: [],
                    date_edited: '2024-01-25T12:00:00Z',
                },
                {
                    id: 3,
                    date: '2023-04-02',
                    name: 'Event 3',
                    information: 'Information 3',
                    groups: [],
                    date_edited: '2024-01-25T12:00:00Z',
                },
            ]

            // sort and group by month
            const eventsByMonth = eventsFromAPi
                .sort((a, b) => {
                    return new Date(b.date) - new Date(a.date)
                })
                .reduce((acc, event) => {
                    // keep the year in key !
                    const key = event.date.split('-').slice(0, 2).join('-')
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
