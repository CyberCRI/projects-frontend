<template>
  <BaseListSummaryBlock :title="$t(`home.short-title.events`)" :items="events" :inlined="inlined">
    <template #default>
      <EventItem
        v-for="event in events"
        :key="event.id"
        :event="event"
        :cols="events.length > 2 ? 'three-col' : 'two-col'"
        hide-see-more-button
        hide-groups
        @location="onLocation"
        @edit="onEdit"
        @delete="onDelete"
      />

      <LocationDrawer
        :is-opened="stateModals.location"
        :locations="selectedEvent?.location ? [selectedEvent.location] : []"
        @close="onCancel"
      />

      <EditEventDrawer
        :is-opened="stateModals.edit"
        :event="selectedEvent"
        @close="onCancel"
        @edited="$emit('reload')"
      />

      <ConfirmModal
        v-if="stateModals.delete"
        :title="$t('event.delete.title')"
        :asyncing="isDeletingEvent"
        @cancel="onCancel"
        @confirm="onDeleteEvent"
      >
        <EventItem is="div" :event="selectedEvent" location-preview />
      </ConfirmModal>
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

<script setup lang="ts">
import EventItem from '@/components/event/EventList/EventItem.vue'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster'
import { TranslatedEventModel } from '@/models/event.model'
import useOrganizationCode from '@/composables/useOrganizationCode'

withDefaults(
  defineProps<{
    events?: TranslatedEventModel[]
    inlined?: boolean
  }>(),
  {
    events: () => [],
    inlined: false,
  }
)

const emit = defineEmits<{
  reload: []
}>()

const { stateModals, closeModals, openModals } = useModals({
  location: false,
  edit: false,
  delete: false,
})

const selectedEvent = ref()
const onDelete = (event) => {
  selectedEvent.value = event
  openModals('delete')
}
const onEdit = (event) => {
  selectedEvent.value = event
  openModals('edit')
}

const onLocation = (event) => {
  selectedEvent.value = event
  openModals('location')
}

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()
const isDeletingEvent = ref(false)

const onDeleteEvent = async () => {
  isDeletingEvent.value = true
  try {
    await deleteEvent(organizationCode, selectedEvent.value.id)
    toaster.pushSuccess(t('event.delete.success'))

    emit('reload')
  } catch (err) {
    toaster.pushError(`${t('event.delete.error')} (${err})`)
    console.error(err)
  } finally {
    isDeletingEvent.value = false
    onCancel()
  }
}

const onCancel = () => {
  selectedEvent.value = null
  closeModals('edit', 'delete', 'location')
}
</script>

<style lang="scss" scoped>
.event {
  padding: 0;
  flex-grow: 1;
}
</style>
