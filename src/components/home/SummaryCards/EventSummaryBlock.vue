<template>
  <BaseListSummaryBlock :title="$t(`home.short-title.events`)" :items="events" :inlined="inlined">
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
        @event-edited="$emit('reload-events')"
      />

      <ConfirmModal
        v-if="eventToDelete"
        :content="$t('event.delete.message')"
        :title="$t('event.delete.title')"
        cancel-button-label="common.cancel"
        confirm-button-label="common.delete"
        :asyncing="isDeletingEvent"
        @cancel="eventToDelete = null"
        @confirm="deleteEvent"
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
import EventItem from '@/components/event/EventList/EventItem.vue'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
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

  emits: ['reload-events'],
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
      editedEvent: null,
      eventToDelete: null,
      isDeletingEvent: false,
    }
  },

  methods: {
    async deleteEvent() {
      this.isDeletingEvent = true
      try {
        await deleteEvent(this.organizationsStore.current?.code, this.eventToDelete.id)
        this.toaster.pushSuccess(this.$t('event.delete.success'))

        this.$emit('reload-events')
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
<style lang="scss" scoped>
.event {
  padding: 0;
}
</style>
