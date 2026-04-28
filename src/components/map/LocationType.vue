<template>
  <div class="location-header" :class="[locationType]" :title="typeLabel">
    <IconImage
      :name="pointerIcon"
      :class="['location-icon', 'skeletons-background', locationType]"
    />
    <h2 v-if="label" class="location-title skeletons-text">
      {{ typeLabel }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import type { LocationType } from '~/models/types'

import { IconMapLocationType } from '~/functs/maps'

const props = withDefaults(defineProps<{ locationType: LocationType; label?: boolean }>(), {
  label: true,
})

const { t } = useNuxtI18n()

const typeLabel = computed(() => {
  switch (props.locationType) {
    case 'impact':
      return t('location.impact')
    case 'team':
      return t('location.team')
    case 'address':
      return t('location.address')
    case 'news':
      return t('location.news')
    case 'event':
      return t('location.event')
    default:
      return ''
  }
})

const pointerIcon = computed(() => IconMapLocationType(props.locationType))
</script>

<style lang="scss" scoped>
.location-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .location-icon {
    width: 16px;
    height: 16px;
    padding: 0.3rem;
    border-radius: 100%;

    &.impact {
      background-color: $location-impact;
    }

    &.team {
      background-color: $location-team;
    }

    &.address {
      background-color: $location-address;
    }

    &.news {
      background-color: $location-news;
    }

    &.event {
      background-color: $location-event;
    }
  }

  .location-title {
    text-transform: uppercase;
  }
}
</style>
