<template>
  <AdminBlock :block-title="blockTitle">
    <template #actions />
    <template #default>
      <FetchLoader :status="status">
        <EventItem
          v-for="event in events"
          :key="event.id"
          :event="event"
          editable
          :to="{
            name: 'EventPage',
            params: { eventId: event.id },
          }"
          hide-see-more-button
          hide-groups
          @edit="editedEvent = event"
          @delete="eventToDelete = event"
        />
        <PaginationButtonsV2 :pagination="pagination" />
        <EditEventDrawer
          :is-opened="!!editedEvent"
          :event="editedEvent"
          @close="editedEvent = null"
          @edited="() => refresh()"
        />

        <ConfirmModal
          v-if="eventToDelete"
          :content="$t('event.delete.message')"
          :title="$t('event.delete.title')"
          :asyncing="isDeletingEvent"
          @cancel="eventToDelete = null"
          @confirm="onDeleteEvent"
        />
      </FetchLoader>
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

<script setup lang="ts">
import { deleteEvent } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster'
import { defaultForm } from '@/components/instruction/InstructionForm/InstructionForm.vue'
import EventItem from '@/components/event/EventList/EventItem.vue'
import { getAllEvents } from '@/api/v2/event.service'

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()

const editedEvent = ref(null)
const eventToDelete = ref(null)
const isDeletingEvent = ref(false)

const todayAtZero = new Date()
todayAtZero.setHours(0, 0, 0, 0)
const query = {
  ordering: 'start_date',
  from_date: todayAtZero.toISOString(),
}

const {
  status,
  data: events,
  pagination,
  refresh,
  isLoading,
} = getAllEvents(organizationCode, {
  query,
  paginationConfig: {
    limit: 4,
  },
})

const blockTitle = computed(() => {
  let extra = isLoading.value ? '' : ` (${pagination.count.value})`
  return t('admin.portal.events') + extra
})

const addEvent = () => (editedEvent.value = defaultForm())

const onDeleteEvent = async () => {
  isDeletingEvent.value = true
  try {
    await deleteEvent(organizationCode, eventToDelete.value.id)
    toaster.pushSuccess(t('event.delete.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('event.delete.error')} (${err})`)
    console.error(err)
  } finally {
    eventToDelete.value = null
    isDeletingEvent.value = false
  }
}
</script>
