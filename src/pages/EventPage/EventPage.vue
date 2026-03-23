<template>
  <div class="event-page page-section-medium page-top">
    <FetchLoader :status="status" :error="error" error404 skeleton>
      <EventItem :event="event" :show-more="true" hide-see-more-button location-preview />
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import { getEvent } from '@/api/v2/event.service'

const props = defineProps<{
  eventId: number
}>()

const eventId = computed(() => props.eventId)
const organizationCode = useOrganizationCode()
const { status, error, data: event } = getEvent(organizationCode, eventId)
</script>
