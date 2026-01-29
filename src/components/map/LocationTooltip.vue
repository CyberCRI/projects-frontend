<template>
  <div class="location-tooltip" :class="location.type">
    <div class="title">
      <div :class="location.type" />
      <span>{{ title }}</span>
    </div>

    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { cropIfTooLong } from '@/functs/string'
import { TranslatedLocation } from '@/models/location.model'

const props = defineProps<{ location: TranslatedLocation }>()

const title = computed(() => cropIfTooLong(props.location?.$t?.title, 45))
const description = computed(() => cropIfTooLong(props.location?.$t?.description, 85))
</script>

<style lang="scss" scoped>
.location-tooltip {
  min-width: 100px;
  padding: $space-m;

  .title {
    color: $primary-dark;
    font-weight: 700;
    margin-bottom: $space-xs;
    font-size: $font-size-m;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    > div {
      height: 15px;
      width: 15px;
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
}
</style>
