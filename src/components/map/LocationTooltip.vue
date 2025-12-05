<template>
  <div class="location-tooltip" :class="location.type">
    <div class="title">
      <div :class="location.type" />
      <span>{{ title }}</span>
    </div>

    <p>{{ description }}</p>
  </div>
</template>

<script setup>
import { cropIfTooLong } from '@/functs/string'

defineOptions({ name: 'LocationTooltip' })

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})

const title = computed(() => {
  return cropIfTooLong(props.location?.$t?.title, 45)
})

const description = computed(() => {
  return cropIfTooLong(props.location?.$t?.description, 85)
})
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
    }
  }
}
</style>
