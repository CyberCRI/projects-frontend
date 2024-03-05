<template>
    <div class="event-list">
        <div
            class="monthly-section"
            v-for="[yearMonth, events] in Object.entries(eventsByMonth)"
            :key="yearMonth"
        >
            <h3 class="month-title">
                {{ $t(`event.calendar.month.${getMonthFromDate(yearMonth)}.long`) }}
            </h3>
            <div class="events-wrapper">
                <EventItem
                    :event="event"
                    v-for="event in events"
                    :key="event.id"
                    @edit-event="onEditEvent"
                    @delete-event="onDeleteEvent"
                />
            </div>
        </div>
    </div>
    <EditEventDrawer :is-opened="!!editedEvent" :event="editedEvent" @close="editedEvent = null" />
</template>
<script>
import EditEventDrawer from '@/components/lpikit/EditEventDrawer/EditEventDrawer.vue'
import EventItem from './EventItem.vue'
export default {
    name: 'EventList',

    emits: ['delete-event'],

    components: {
        EditEventDrawer,
        EventItem,
    },

    props: {
        eventsByMonth: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            editedEvent: null,
        }
    },

    methods: {
        onDeleteEvent(event) {
            this.$emit('delete-event', event)
        },

        onEditEvent(event) {
            this.editedEvent = event
        },

        getMonthFromDate(yearMonth) {
            return yearMonth.split('-')[1]
        },
    },
}
</script>
<style lang="scss" scoped>
.event-list {
    margin-bottom: 2rem;
}
.month-title {
    margin-bottom: $space-l;
    margin-top: $space-xl;
    text-transform: uppercase;
    color: $black-1;
    text-align: center;
}

.events-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: $space-l;
    padding: $space-m;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-m;
}
</style>
