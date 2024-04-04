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
                    @edit-event="editedEvent = event"
                    @delete-event="eventToDelete = event"
                />
            </div>
        </div>
    </div>
    <EditEventDrawer :is-opened="!!editedEvent" :event="editedEvent" @close="editedEvent = null" />

    <ConfirmModal
        v-if="eventToDelete"
        :content="$t('event.delete.message')"
        :title="$t('event.delete.title')"
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        @cancel="eventToDelete = null"
        @confirm="deleteEvent"
        :asyncing="isDeletingEvent"
    />
</template>
<script>
import EditEventDrawer from '@/components/lpikit/EditEventDrawer/EditEventDrawer.vue'
import EventItem from './EventItem.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
export default {
    name: 'EventList',

    components: {
        EditEventDrawer,
        EventItem,
        ConfirmModal,
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
            eventToDelete: null,
            isDeletingEvent: false,
        }
    },

    methods: {
        async deleteEvent() {
            // TODO: delete event
            console.log('delete event', this.eventToDelete)
            this.isDeletingEvent = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call her
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('event.delete.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('event.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.eventToDelete = null
                this.isDeletingEvent = false
            }
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
    flex-flow: column nowrap;
    gap: $space-l;
    padding: $space-m;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-m;
}
</style>
