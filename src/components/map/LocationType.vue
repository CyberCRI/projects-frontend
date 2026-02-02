<template>
  <div class="location-header" :class="[location.type]" :title="typeLabel">
    <IconImage :name="pointerIcon" :class="['location-icon', location.type]" />
    <h2 v-if="label" class="location-title">
      {{ typeLabel }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { IconMapLocationType } from '@/functs/maps'
import { AnyLocation } from '@/models/location.model'

const props = withDefaults(defineProps<{ location: AnyLocation; label?: boolean }>(), {
  label: true,
})

const { t } = useNuxtI18n()

const typeLabel = computed(() => {
  switch (props.location.type) {
    case 'impact':
      return t('location.impact')
    case 'team':
      return t('location.team')
    case 'address':
      return t('location.address')
  }
})

const pointerIcon = computed(() => IconMapLocationType(props.location.type))
</script>

<style lang="scss" scoped>
.location-header {
  display: flex;
  justify-content: center;
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
  }

  .location-title {
    text-transform: uppercase;
  }
}
</style>
