<template>
  <div class="wrapper">
    <div ref="marker" class="map-pointer">
      <div class="badge">
        <div :class="location.type" class="badge__dot" />
        <div class="badge__label">
          {{ pointerLabel }}
        </div>
        <div v-if="editable" class="actions">
          <ContextActionButton
            action-icon="Pen"
            class="edit-btn small"
            @click.stop="emit('edit', location)"
          />
        </div>
      </div>

      <div class="line" />
    </div>
    <div ref="tooltip">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPointerOption } from '@/interfaces/maps'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: TranslatedLocation
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  mounted: [MapPointerOption]
  unmounted: [TranslatedLocation | null]
  edit: [TranslatedLocation | null]
}>()

const { t } = useNuxtI18n()
const pointerLabel = computed(() => {
  switch (props.location.type) {
    case 'impact':
      return t('location.impact')
    case 'team':
      return t('location.team')
    case 'address':
      return t('location.address')
  }
})

const markerRef = useTemplateRef('marker')
const tooltipRef = useTemplateRef('tooltip')
onMounted(() => {
  emit('mounted', {
    location: props.location,
    markerContent: markerRef.value,
    tooltip: tooltipRef.value,
  })
})

onUnmounted(() => {
  emit('unmounted', props.location)
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: none;
}

.map-pointer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .badge {
    background: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m;
    height: 34px;
    box-sizing: border-box;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-l;
    cursor: pointer;
    transition:
      height 0.15s ease-in-out,
      width 0.15s ease-in-out;

    &__dot {
      width: 16px;
      height: 16px;
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

    &__label {
      color: $primary-dark;
      font-size: $font-size-xs;
      text-transform: uppercase;
      font-weight: 700;
    }
  }

  .line {
    width: 3px;
    height: 35px;
    background: $primary-dark;
    position: relative;

    &::after {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: $primary-dark;
      border-radius: 50%;
    }
  }
}

.actions {
  display: inline-block;
  margin-left: 1rem;
}
</style>
