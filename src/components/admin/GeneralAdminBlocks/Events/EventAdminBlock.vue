<template>
  <AdminBlock :block-title="blockTitle">
    <template #actions />
    <template #default>
      <FetchLoader :status="status">
        <div class="list-divider list-container">
          <EventItem
            v-for="event in events"
            :key="event.id"
            :event="event"
            editable
            hide-see-more-button
            hide-groups
            @location="onLocation"
            @edit="onEdit"
            @delete="onDelete"
          />
        </div>
        <PaginationButtonsV2 :pagination="pagination" />
        <LocationDrawer
          :is-opened="stateModals.location"
          :locations="selectedEvent?.location ? [selectedEvent.location] : []"
          @close="onCancel"
        />

        <EditEventDrawer
          :is-opened="stateModals.edit"
          :event="selectedEvent"
          @close="onCancel"
          @edited="() => refresh()"
        />

        <ConfirmModal
          v-if="stateModals.delete"
          :title="$t('event.delete.title')"
          :asyncing="asyncingDelete"
          @cancel="onCancel"
          @confirm="onDeleteEvent"
        >
          <EventItem is="div" :event="selectedEvent" />
        </ConfirmModal>
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

const selectedEvent = ref(null)
const asyncingDelete = ref(false)
const { stateModals, closeModals, openModals } = useModals({
  location: false,
  edit: false,
  delete: false,
})

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

const addEvent = () => {
  selectedEvent.value = defaultForm()
  openModals('edit')
}
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
  asyncingDelete.value = true
  try {
    await deleteEvent(organizationCode, selectedEvent.value.id)
    toaster.pushSuccess(t('event.delete.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('event.delete.error')} (${err})`)
    console.error(err)
  } finally {
    asyncingDelete.value = false
    onCancel()
  }
}

const onCancel = () => {
  selectedEvent.value = null
  closeModals('edit', 'delete', 'location')
}
</script>
