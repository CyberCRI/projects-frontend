<template>
  <div class="page-section-narrow page-top list-container">
    <h1 class="page-title">
      {{ $t('event.calendar.title') }}
    </h1>
    <LpiButton
      v-if="canCreateEvent"
      primary
      :label="$t('event.create.button')"
      data-test="create-event-button"
      btn-icon="Plus"
      class="create-event-button"
      :to="{ name: 'CreateEvent' }"
    />

    <EventsList />
  </div>
</template>

<script setup lang="ts">
import EventsList from '~/pages/CalendarPage/Tabs/EventsList.vue'

const { canCreateEvent } = usePermissions()
const { t } = useNuxtI18n()
useLpiHead2({
  title: computed(() => t('event.calendar.title')),
})
</script>

<style lang="scss" scoped>
.create-event-button {
  align-self: flex-end;
}
</style>
