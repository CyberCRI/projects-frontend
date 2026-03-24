<template>
  <div class="page-section-narrow page-top">
    <h1 class="page-title">
      {{ $t('event.calendar.title') }}
    </h1>
    <div class="create-event-button-ctn">
      <LpiButton
        v-if="canCreateEvent"
        primary
        :label="$t('event.create.button')"
        data-test="create-event-button"
        btn-icon="Plus"
        class="create-event-button"
        @click="createEvent"
      />
    </div>

    <TabsLayout :tabs="tabs" :border="false" align-left router-view />
  </div>
</template>

<script setup lang="ts">
const { canCreateEvent } = usePermissions()
const { t } = useNuxtI18n()
const router = useRouter()
const tabs = computed(() => {
  return [
    {
      key: 'future-events',
      label: t('event.calendar.future'),
      view: { name: 'FutureEvents' },
    },
    {
      key: 'past-events',
      label: t('event.calendar.past'),
      view: { name: 'PastEvents' },
    },
  ]
})

const createEvent = () => router.push({ name: 'CreateEvent' })

useLpiHead2({
  title: computed(() => t('event.calendar.title')),
})
</script>

<style lang="scss" scoped>
.page-title {
  margin-bottom: pxToRem(60px);
}

.create-event-button-ctn {
  margin: 2rem 0;
}

.create-event-button {
  margin-left: auto;
}
</style>
