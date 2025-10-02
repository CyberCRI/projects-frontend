<template>
  <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
    <template #actions />
    <template #default>
      <EventAdminListItem
        v-for="event in events"
        :key="event.id"
        :event="event"
        @edit-event="editedEvent = event"
        @delete-event="eventToDelete = event"
      />
      <EditEventDrawer
        :is-opened="!!editedEvent"
        :event="editedEvent"
        @close="editedEvent = null"
        @event-edited="loadEvents"
      />

      <ConfirmModal
        v-if="eventToDelete"
        :content="$t('event.delete.message')"
        :title="$t('event.delete.title')"
        :asyncing="isDeletingEvent"
        @cancel="eventToDelete = null"
        @confirm="deleteEvent"
      />
    </template>

    <template #footer>
      <LpiButton btn-icon="Plus" :label="$t('common.add')" @click="addEvent" />
      <LinkButton
        btn-icon="ArrowRight"
        :label="$t('common.see-all')"
        :to="{ name: 'CalendarPage' }"
      />
    </template>
  </AdminBlock>
</template>
<script>
import { getAllEvents, deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { defaultForm } from '@/components/event/EventForm/EventForm.vue'
export default {
  name: 'EventAdminBlock',

  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
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
      const todayAtZero = new Date()
      todayAtZero.setHours(0, 0, 0, 0)
      const request = await getAllEvents(this.organizationsStore.current?.code, {
        ordering: 'event_date',
        from_date: todayAtZero.toISOString(),
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
        await deleteEvent(this.organizationsStore.current?.code, this.eventToDelete.id)
        this.toaster.pushSuccess(this.$t('event.delete.success'))

        this.loadEvents()
      } catch (err) {
        this.toaster.pushError(`${this.$t('event.delete.error')} (${err})`)
        console.error(err)
      } finally {
        this.eventToDelete = null
        this.isDeletingEvent = false
      }
    },
  },
}
</script>
