<template>
  <div class="event-page page-section-narrow page-top">
    <BreadCrumbs :breadcrumbs="breadcrumbs" />
    <FetchLoader :status="status" :error="error" error404 skeleton>
      <EventItem
        is="div"
        :event="event"
        :show-more="true"
        hide-see-more-button
        location-preview
        editable
        @edit="onEdit"
        @delete="onDelete"
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
        :asyncing="isDeletingEvent"
        @cancel="onCancel"
        @confirm="onDeleteEvent"
      >
        <EventItem is="div" :event="selectedEvent" location-preview />
      </ConfirmModal>
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import { deleteEvent } from '~/api/event.service'
import { getEvent } from '~/api/v2/event.service'
import BreadCrumbs from '~/components/base/navigation/BreadCrumbs.vue'
import { html2Text } from '~/functs/string'
import { eventSkeleton } from '~/skeletons/event.skeletons'
import useToasterStore from '~/stores/useToaster'

const props = defineProps<{ eventId: number | string }>()

const breadcrumbs = computed(() => [
  {
    name: $t('home.calendar'),
    route: {
      name: 'CalendarPage',
    },
  },
])

const router = useRouter()

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const eventId = computed(() => parseInt(props.eventId.toString(), 10))
const organizationCode = useOrganizationCode()
const {
  status,
  error,
  data: event,
  refresh,
} = getEvent(organizationCode, eventId, {
  default: () => eventSkeleton(),
})

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

const isDeletingEvent = ref(false)

const onDeleteEvent = async () => {
  isDeletingEvent.value = true
  try {
    await deleteEvent(organizationCode, selectedEvent.value.id)
    toaster.pushSuccess(t('event.delete.success'))

    router.push({ name: 'CalendarPage' })
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

useLpiHead2({
  title: computed(() => event.value?.$t.title),
  description: computed(() => html2Text(event.value?.$t.content)),
})
</script>

<style scoped>
.event-page {
  margin-bottom: 1rem;
}
</style>
