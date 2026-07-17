<template>
  <CardLocationPopUp
    :location="location"
    :label="$t('event.view')"
    :to="{ name: 'EventPage', params: { eventId: event.id } }"
    :title="event.$t.title"
    :description="description"
  >
    <EventItem is="div" hide-see-more-button :event="event" class="hide-extra-description" />
  </CardLocationPopUp>
</template>

<script setup lang="ts" generic="T extends AnyTranslatedLocation">
import type { AnyTranslatedLocation, TranslatedEventModel } from 'shared-projects-frontend/models'
import type CardLocationPopUp from '@/components/map/CardLocationPopUp.vue'
import EventItem from '@/components/event/EventList/EventItem.vue'
import { html2Text } from '~/functs/tiptap'

const props = defineProps<{ location: T; event: TranslatedEventModel }>()

const description = computed(() => html2Text(props.event.$t.content))
</script>

<style lang="scss">
@use '~/design/scss/variables';

.hide-extra-description {
  // same columns
  grid-template-columns: 1fr !important;

  .description-limited-transparancy {
    display: none !important;
  }
}
</style>
