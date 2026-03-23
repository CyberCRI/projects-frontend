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
          @edit="editedEvent = event"
          @delete="eventToDelete = event"
        />
      </div>
    </div>
  </div>
  <EditEventDrawer
    :is-opened="!!editedEvent"
    :event="editedEvent"
    @close="editedEvent = null"
    @edited="$emit('reload')"
  />

  <ConfirmModal
    v-if="eventToDelete"
    :content="$t('event.delete.message')"
    :title="$t('event.delete.title')"
    :asyncing="isDeletingEvent"
    @cancel="eventToDelete = null"
    @confirm="onDeleteEvent"
  />
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
    eventsByMonth?: {
      [key: string]: TranslatedEventModel[]
    }
  }>(),
  { eventsByMonth: () => ({}) }
)

const emit = defineEmits<{
  reload: []
}>()

const { t, locale } = useNuxtI18n()

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const editedEvent = ref(null)
const eventToDelete = ref(null)
const isDeletingEvent = ref(false)

const onDeleteEvent = async () => {
  isDeletingEvent.value = true
  try {
    await deleteEvent(organizationCode, eventToDelete.value.id)
    toaster.pushSuccess(t('event.delete.success'))

    emit('reload')
  } catch (err) {
    toaster.pushError(`${t('event.delete.error')} (${err})`)
    console.error(err)
  } finally {
    eventToDelete.value = null
    isDeletingEvent.value = false
  }
}

const getMonthFromDate = (yearMonth) => {
  return new Date(yearMonth).toLocaleDateString(locale.value, { month: 'long' })
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
