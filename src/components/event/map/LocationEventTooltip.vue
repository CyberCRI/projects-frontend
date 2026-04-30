<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('event.view')"
    :to="{ name: 'EventPage', params: { eventId: event.id } }"
    :title="event.$t.title"
    :description="description"
  >
    <EventItem is="div" hide-see-more-button :event="event" class="hide-extra-description" />
  </CardLocationTooltip>
</template>

<script setup lang="ts">
import type { TranslatedEventLocation } from '~/models/location.model'
import type { TranslatedEventModel } from '~/models/event.model'

import CardLocationTooltip from '~/components/map/CardLocationTooltip.vue'
import EventItem from '~/components/event/EventList/EventItem.vue'

import { html2Text } from '~/functs/string'

const props = defineProps<{ location: TranslatedEventLocation; event: TranslatedEventModel }>()

const description = computed(() => html2Text(props.event.$t.content))
</script>

<style lang="scss">
.hide-extra-description {
  // same columns
  grid-template-columns: 1fr !important;

  .description-limited-transparancy {
    display: none !important;
  }
}
</style>
