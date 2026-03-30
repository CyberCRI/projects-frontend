<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <LpiButton
        v-if="editable"
        btn-icon="Plus"
        :label="$t('group.form.add')"
        class="edit-btn skeletons-background"
        @click="onCreate"
      />
      <div class="list-divider events-wrapper">
        <EventItem
          v-for="event in data"
          :key="event.title"
          :event="event"
          :editable="editable"
          :hide-see-more-button="preview"
          @location="onLocation"
          @edit="onEditEvent"
          @delete="onDeleteEvent"
        />
      </div>

      <LocationDrawer
        :is-opened="stateModals.location"
        :locations="selectedEvent?.location ? [selectedEvent.location] : []"
        @close="closeModals('location')"
      />

      <ConfirmModal
        v-if="stateModals.delete"
        :title="$t('event.delete.message')"
        @confirm="onConfirmDeleteEvent"
        @cancel="onCancel"
      >
        <EventItem is="div" :event="selectedEvent" location-preview />
      </ConfirmModal>

      <PaginationButtonsV2 v-if="withPagination" :pagination="pagination" />
    </div>
  </FetchLoader>
  <EditEventDrawer
    :is-opened="stateModals.edit"
    :event="selectedEvent"
    :selected-group="false"
    @close="onCancel"
    @edited="onAfterEdit"
  />
</template>

<script setup lang="ts">
import { deleteEvent } from '@/api/event.service'
import { getGroupEvent } from '@/api/v2/group.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'
import EventItem from '@/components/event/EventList/EventItem.vue'
import { QueryFilterEvent, TranslatedEventModel } from '@/models/event.model'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { eventSkeleton } from '@/skeletons/event.skeletons'
import useToasterStore from '@/stores/useToaster'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    withPagination?: boolean
    editable?: boolean
    preview?: boolean
  }>(),
  {
    withPagination: true,
    limit: null,
    editable: false,
    preview: false,
  }
)

const { t } = useNuxtI18n()

const selectedEvent = ref<any>()
const { stateModals, openModals, closeModals } = useModals({
  delete: false,
  edit: false,
  location: false,
})
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const { query } = useQuery<QueryFilterEvent>({})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.event, props.limit))

const { status, data, pagination, refresh } = getGroupEvent(organizationCode, groupId, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(eventSkeleton, limitSkeletons.value),
})

const onEditEvent = (event: TranslatedEventModel) => {
  selectedEvent.value = event
  openModals('edit')
}
const onCreate = () => {
  selectedEvent.value = {
    people_groups: [props.group.id],
  }
  openModals('edit')
}

const onDeleteEvent = (event: TranslatedEventModel) => {
  selectedEvent.value = event
  openModals('delete')
}
const onConfirmDeleteEvent = () => {
  deleteEvent(organizationCode, selectedEvent.value.id)
    .then(() => {
      toaster.pushSuccess(t('event.delete.success'))
      onAfterEdit()
    })
    .catch(() => toaster.pushError(t('event.delete.error')))
    .finally(() => onCancel())
}

const onAfterEdit = () => {
  refreshNuxtData(`${organizationCode}::group::${groupId.value}`)
  refresh()
  onCancel()
}

const onCancel = () => {
  selectedEvent.value = null
  closeModals('edit', 'delete', 'location')
}

const onLocation = (event) => {
  selectedEvent.value = event
  openModals('location')
}
</script>

<style lang="scss" scoped>
.events-wrapper {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-l;
  padding: $space-m;
}
</style>
