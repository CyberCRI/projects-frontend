<template>
  <div class="event-list">
    <div
      v-for="[yearMonth, events] in Object.entries(eventsByMonth)"
      :key="yearMonth"
      class="monthly-section"
    >
      <h3 class="month-title skeletons-text">
        {{ getMonthFromDate(yearMonth) }}
      </h3>
      <div class="events-wrapper list-divider">
        <EventItem
          v-for="event in events"
          :key="event.id"
          :event="event"
          editable
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>

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
    <EventItem is="div" :event="selectedEvent" />
  </ConfirmModal>
</template>

<script setup lang="ts">
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'
import EventItem from './EventItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster'
import { TranslatedEventModel } from '@/models/event.model'

defineProps<{
  eventsByMonth: Record<string, TranslatedEventModel[]>
}>()

const emit = defineEmits<{
  reload: []
}>()

const { t, locale } = useNuxtI18n()

const selectedEvent = ref()
const isDeletingEvent = ref()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const { stateModals, closeModals, openModals } = useModals({
  edit: false,
  delete: false,
})

const onDelete = (event) => {
  selectedEvent.value = event
  openModals('delete')
}
const onEdit = (event) => {
  selectedEvent.value = event
  openModals('edit')
}

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

const getMonthFromDate = (yearMonth) => {
  return new Date(yearMonth).toLocaleDateString(locale.value, { month: 'long' })
}

const onCancel = () => {
  selectedEvent.value = null
  closeModals('edit', 'delete')
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
  color: var(--almost-black);
  text-align: center;
}

.events-wrapper {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-l;
  padding: $space-m;
  border: $border-width-s solid var(--lighter-gray);
  border-radius: $border-radius-m;
}
</style>
