<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton btn-icon="Plus" :label="$t('common.add')" @click="addEvent"></LinkButton>
        </template>
        <template #default>
            <EventAdminListItem
                v-for="event in events"
                :key="event.id"
                :event="event"
                @edit-event="editedEvent = event"
                @delete-event="eventToDelete = event"
            ></EventAdminListItem>
        </template>

        <template #footer>
            <LinkButton
                btn-icon="ArrowRight"
                :label="$t('common.see-all')"
                :to="{ name: 'CalendarPage' }"
            />
        </template>
    </AdminBlock>

    <EditEventDrawer
        :is-opened="!!editedEvent"
        @close="editedEvent = null"
        :event="editedEvent"
        @event-edited="loadEvents"
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
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import EditEventDrawer from '@/components/lpikit/EditEventDrawer/EditEventDrawer.vue'
import { defaultForm } from '@/components/lpikit/EventForm/EventForm.vue'
import EventAdminListItem from './EventAdminListItem.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import { getAllEvents, deleteEvent } from '@/api/event.service'
export default {
    name: 'EventAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        EditEventDrawer,
        EventAdminListItem,
        ConfirmModal,
    },

    data() {
        return {
            events: [],
            eventsCount: 0,
            isLoading: true,
            editedEvent: null,
            eventToDelete: null,
            isDeletingEvent: false,
        }
    },

    computed: {
        blockTitle() {
            let extra = this.isLoading ? '' : ` (${this.eventsCount})`
            return this.$t('admin.portal.events') + extra
        },
    },

    async mounted() {
        await this.loadEvents()
    },

    methods: {
        async loadEvents() {
            this.isLoading = true
            const request = await getAllEvents(this.$store.getters['organizations/current']?.code, {
                ordering: 'event_date',
                from_date: new Date().toISOString(),
                limit: 4,
            })
            this.events = request.results
            this.eventsCount = request.count
            this.isLoading = false
        },

        addEvent() {
            this.editedEvent = defaultForm()
        },

        async deleteEvent() {
            // TODO: delete event
            console.log('delete event', this.eventToDelete)
            this.isDeletingEvent = true
            try {
                await deleteEvent(
                    this.$store.getters['organizations/current']?.code,
                    this.eventToDelete.id
                )
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('event.delete.success'),
                    type: 'success',
                })
                this.loadEvents()
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
