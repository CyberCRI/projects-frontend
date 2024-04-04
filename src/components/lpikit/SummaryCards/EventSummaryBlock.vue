<template>
    <BaseListSummaryBlock
        :title="events.length > 2 ? $t(`home.short-title.events`) : $t(`home.long-title.events`)"
        :items="events"
        :inlined="inlined"
    >
        <template #default>
            <EventItem
                v-for="event in events"
                :key="event.id"
                :event="event"
                :cols="events.length > 2 ? 'three-col' : 'two-col'"
                @edit-event="editedEvent = event"
                @delete-event="eventToDelete = event"
            />

            <EditEventDrawer
                :is-opened="!!editedEvent"
                :event="editedEvent"
                @close="editedEvent = null"
            />

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

        <template #action>
            <SummaryAction
                :to="{ name: 'CalendarPage' }"
                action-icon="ArrowRight"
                :action-label="$t('feed.see-all')"
            />
        </template>
    </BaseListSummaryBlock>
</template>

<script>
import EventItem from '@/components/lpikit/EventList/EventItem.vue'
import BaseListSummaryBlock from '@/components/lpikit/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'
import EditEventDrawer from '@/components/lpikit/EditEventDrawer/EditEventDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'EventSummaryBlock',

    components: { EventItem, BaseListSummaryBlock, SummaryAction, EditEventDrawer, ConfirmModal },

    props: {
        events: {
            type: Array,
            default: () => [],
        },
        inlined: {
            type: Boolean,
            default: false,
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
    },
}
</script>
<style lang="scss" scoped>
.event {
    padding: 0;
}
</style>
