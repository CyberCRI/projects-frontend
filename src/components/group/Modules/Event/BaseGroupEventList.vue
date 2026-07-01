<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader v-if="!preview" :editable="editable" :pagination="pagination" @add="onCreate">
      <!-- hide filter if we are in preview or nothing to show (no past/furture events) -->
      <EventFilter v-if="limitSkeletons !== 0" v-model="query" />
    </BaseModuleHeader>

    <div class="list-container">
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
        <NothingHere v-if="!data.length" :label="$t('event.empty')" />
      </div>

      <PaginationButtonsV2 v-if="withPagination" :pagination="pagination" />
    </div>
  </FetchLoader>

  <!-- drawer/modal -->

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

  <EditEventDrawer
    :is-opened="stateModals.edit"
    :event="selectedEvent"
    :selected-group="false"
    @close="onCancel"
    @edited="onAfterEdit"
  />
</template>

<script setup lang="ts">
import type { QueryFilterEvent, TranslatedEventModel } from '~/models/event.model'
import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'

import { getGroupEvent } from '~/api/v2/group.service'
import { deleteEvent } from '~/api/event.service'

import EditEventDrawer from '~/components/event/EditEventDrawer/EditEventDrawer.vue'
import EventItem from '~/components/event/EventList/EventItem.vue'
import EventFilter from '~/components/event/EventFilter.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'

import useToasterStore from '~/stores/useToaster'

import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { refreshGroupData } from '~/composables/groups/refreshGroup'
import { eventSkeleton } from '~/skeletons/event.skeletons'

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

const asyncing = ref(false)
const selectedEvent = ref<any>()
const { stateModals, openModals, closeModals } = useModals({
  delete: false,
  edit: false,
  location: false,
})
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const query = ref<QueryFilterEvent>({
  // when in preview, show all events
  ordering: props.preview ? '-created_at' : 'start_date',
})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.event, props.limit))

const { status, data, pagination, refresh } = getGroupEvent(organizationCode, groupId, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(eventSkeleton, limitSkeletons.value),
})

const onCancel = () => {
  asyncing.value = true
  selectedEvent.value = null
  closeModals('edit', 'delete', 'location')
}

const onAfterEdit = () => {
  refreshGroupData(props.group)
  refresh()
  onCancel()
}

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

const onLocation = (event) => {
  selectedEvent.value = event
  openModals('location')
}

const onConfirmDeleteEvent = () => {
  asyncing.value = true
  deleteEvent(organizationCode, selectedEvent.value.id)
    .then(() => {
      toaster.pushSuccess(t('event.delete.success'))
      onAfterEdit()
    })
    .catch(() => toaster.pushError(t('event.delete.error')))
    .finally(() => onCancel())
}
</script>

<style lang="scss" scoped>
.filter-list {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.events-wrapper {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-l;
  padding: $space-m;
}
</style>
