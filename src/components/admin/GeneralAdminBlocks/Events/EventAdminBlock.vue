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
        @event-edited="refresh"
      />

      <ConfirmModal
        v-if="eventToDelete"
        :content="t('event.delete.message')"
        :title="t('event.delete.title')"
        :asyncing="isDeletingEvent"
        @cancel="eventToDelete = null"
        @confirm="deleteEvent"
      />
    </template>

    <template #footer>
      <LpiButton btn-icon="Plus" :label="t('common.add')" @click="addEvent" />
      <LinkButton
        btn-icon="ArrowRight"
        :label="t('common.see-all')"
        :to="{ name: 'CalendarPage' }"
      />
    </template>
  </AdminBlock>
</template>

<script setup lang="ts">
import { deleteEvent as deleteEventApi } from '@/api/event.service'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import { defaultForm } from '@/components/event/EventForm/EventForm.vue'
import { api } from '@/api/SwaggerProjects'
import { useAsyncPaginationAPI } from '@/composables/useAsyncAPI'

defineOptions({ name: 'EventAdminBlock' })

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const editedEvent = ref(null)
const eventToDelete = ref(null)
const isDeletingEvent = ref(false)
const { t } = useNuxtI18n()

const {
  status,
  data: events,
  refresh,
  paginated,
} = useAsyncPaginationAPI(
  'organizationEventList',
  ({ query }) => {
    const todayAtZero = new Date()
    todayAtZero.setHours(0, 0, 0, 0)
    return api.v1.organizationEventList(organizationsStore.current?.code, {
      ordering: 'event_date',
      from_date: todayAtZero.toISOString(),
      ...query,
    })
  },
  {
    paginationConfig: {
      limit: 4,
    },
  }
)

// TODO(remi): use directly status ( with a wrapper in AdminBlock)
const isLoading = computed(() => status.value !== 'success')

const blockTitle = computed(() => {
  let extra = isLoading ? '' : ` (${paginated.total.value})`
  return t('admin.portal.events') + extra
})

const addEvent = () => {
  editedEvent.value = defaultForm()
}

const deleteEvent = async () => {
  // TODO: delete event
  console.log('delete event', eventToDelete.value)
  isDeletingEvent.value = true
  try {
    await deleteEventApi(organizationsStore.current?.code, eventToDelete.value.id)
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
