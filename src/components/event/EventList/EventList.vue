<template>
  <div class="event-list">
    <div v-for="[yearMonth, events] in Object.entries(eventsByMonth)" :key="yearMonth">
      <h3 class="month-title skeletons-text">
        {{ getMonthFromDate(yearMonth) }}
      </h3>
      <ul class="events-wrapper list-divider">
        <li v-for="event in events" :key="event.id">
          <EventItem
            :event="event"
            :reverse-date="reverseDate"
            editable
            @location="onLocation"
            @edit="onEdit"
            @delete="onDelete"
          />
        </li>
      </ul>
    </div>
  </div>
  <LocationDrawer
    :is-opened="stateModals.location"
    :locations="selectedEvent?.location ? [selectedEvent.location] : []"
    @close="closeModals('location')"
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

<script setup lang="ts">
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'
import EventItem from './EventItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster'
import { TranslatedEventModel } from '@/models/event.model'

withDefaults(
  defineProps<{
    eventsByMonth: Record<string, TranslatedEventModel[]>
    reverseDate?: boolean
  }>(),
  {
    reverseDate: false,
  }
)

const emit = defineEmits<{
  reload: []
}>()

const { t, locale } = useNuxtI18n()

const selectedEvent = ref()
const isDeletingEvent = ref()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const { stateModals, closeModals, openModals } = useModals({
  location: false,
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
const onLocation = (event) => {
  selectedEvent.value = event
  openModals('location')
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
  closeModals('edit', 'delete', 'location')
}
</script>

<style lang="scss" scoped>
.event-list {
  margin-bottom: 2rem;
}

.month-title {
  margin: $space-xl auto;
  text-transform: uppercase;
  color: var(--almost-black);
  text-align: center;
  width: fit-content;
}

.events-wrapper {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-l;
  padding: $space-m;
  border: $border-width-s solid var(--lighter-gray);
  border-radius: $border-radius-m;
  margin-top: 1rem;
}
</style>
