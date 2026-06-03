<template>
  <div class="location-list-item skeletons-background">
    <div class="location-title">
      <LocationType v-if="showLocationType" :location-type="location.type" />
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <ContextActionMenuInline
      class="location-actions"
      :can-edit="editable"
      :can-delete="editable"
      @edit="$emit('edit', location)"
      @delete="$emit('delete', location)"
    >
      <LpiButton
        v-if="focus"
        btn-icon="MapMarker"
        :title="$t('location.focus-on-map')"
        @click.prevent="$emit('focus', location)"
      />
    </ContextActionMenuInline>
  </div>
</template>

<script setup lang="ts">
import type { AnyTranslatedLocation } from '~/models/location.model'

import LocationType from '~/components/map/LocationType.vue'

import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import { cropIfTooLong } from '~/functs/string'

const props = withDefaults(
  defineProps<{
    location: AnyTranslatedLocation
    editable?: boolean
    focus?: boolean
    showLocationType?: boolean
    defaultTitle?: string
  }>(),
  {
    editable: false,
    focus: true,
    showLocationType: false,
    defaultTitle: null,
  }
)

defineEmits<{
  focus: [AnyTranslatedLocation]
  delete: [AnyTranslatedLocation]
  edit: [AnyTranslatedLocation]
}>()

const { t } = useNuxtI18n()

// need to safe guard with translated title (if we are in edit/create mode)
const title = computed(() =>
  cropIfTooLong(
    props.location.$t?.title || props.location.title || props.defaultTitle || t('location.address'),
    40
  )
)
const description = computed(() =>
  cropIfTooLong(props.location.$t?.description || props.location.description, 80)
)
</script>

<style scoped lang="scss">
.location-list-item {
  display: flex;
  background-color: $primary-lighter;
  border-radius: 0.8rem;
  padding: 0.5em;
  align-items: flex-start;
  gap: 1rem;

  .location-title {
    flex-grow: 1;

    h4 {
      font-weight: 600;
    }

    p {
      font-size: 0.8rem;
      font-weight: 300;
    }
  }
}

.location-actions {
  margin: auto;
}
</style>
