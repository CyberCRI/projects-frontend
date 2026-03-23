<template>
  <BaseListSummaryBlock :title="$t(`home.short-title.events`)" :items="events" :inlined="inlined">
    <template #default>
      <EventItem
        v-for="event in events"
        :key="event.id"
        :to="{
          name: 'EventPage',
          params: { eventId: event.id },
        }"
        :event="event"
        :cols="events.length > 2 ? 'three-col' : 'two-col'"
        hide-see-more-button
        hide-groups
        @edit="editedEvent = event"
        @delete="eventToDelete = event"
      />

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

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()
const eventToDelete = ref(null)
const isDeletingEvent = ref(false)
const editedEvent = ref(null)

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
</script>
<style lang="scss" scoped>
.event {
  padding: 0;
  flex-grow: 1;
}
</style>
