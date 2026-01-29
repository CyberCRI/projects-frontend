<template>
  <div class="location-tooltip" :class="location.type">
    <div class="location-tooltip__header">
      <div :class="location.type" class="location-tooltip__header--dot" />
      <h2 class="location-tooltip__header--title">
        {{ typeLabel }}
      </h2>
    </div>

    <div class="location-tooltip__location">
      <h3 class="location-tooltip__location--title">
        {{ title }}
      </h3>
      <p class="location-tooltip__location--description">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cropIfTooLong } from '@/functs/string'
import { TranslatedLocation } from '@/models/location.model'

const props = defineProps<{ location: TranslatedLocation }>()

const { t } = useNuxtI18n()

const title = computed(() => cropIfTooLong(props.location?.$t?.title, 45))
const description = computed(() => cropIfTooLong(props.location?.$t?.description, 85))

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
</script>

<style lang="scss" scoped>
.location-tooltip {
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100%;
  transition: opacity 0.15s ease-in-out;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: flex-start;
    padding: $space-s;

    &--title {
      color: $primary-dark;
      font-weight: 700;
      font-size: $font-size-s;
    }

    &--dot {
      width: pxToRem(16px);
      height: pxToRem(16px);
      border-radius: 50%;
      margin-right: $space-s;

      &.impact {
        background: $violet;
      }

      &.team {
        background: $primary;
      }

      &.address {
        background: $primary;
      }
    }
  }

  &__location {
    padding: $space-s;

    &--title {
      font-weight: 500;
      font-size: $font-size-xl;
    }

    &--description {
      font-weight: 400;
      font-size: $font-size-m;
    }
  }
}
</style>
