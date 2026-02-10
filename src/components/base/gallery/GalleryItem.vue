<template>
  <button
    class="reset-btn gallery-button shadow-box skeletons-background"
    :class="editable ? 'pointer-events-none' : ''"
    type="button"
    rel="noopener"
    :aria-label="$t('gallery.view')"
    @click.stop="$emit('click', image)"
  >
    <img :src="src" :alt="image.name" :style="styleImg" class="gallery-item" @error="onError" />
    <LpiButton
      v-if="editable"
      btn-icon="Close"
      :aria-label="$t('common.delete')"
      class="gallery-item-delete"
      @click.stop="$emit('delete', image)"
    />
  </button>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import { DEFAULT_IMAGE_PATATOID, usePatatoid } from '@/composables/usePatatoids'
import { ImageModel } from '@/models/image.model'
import { StyleValue } from 'vue'

const props = withDefaults(
  defineProps<{
    image: ImageModel
    editable?: boolean
    styleImg?: StyleValue
    size?: keyof ImageModel['variations']
  }>(),
  { editable: false, styleImg: null, size: 'medium' }
)

defineEmits<{
  click: [ImageModel]
  delete: [ImageModel]
}>()

const defaultPicture = usePatatoid(DEFAULT_IMAGE_PATATOID)

const error = ref(false)
const onError = () => (error.value = true)

const src = computed(() => {
  if (error.value) {
    return defaultPicture
  }
  return props.image.variations[props.size]
})
</script>

<style lang="scss">
.gallery-button {
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
}

.gallery-item {
  width: 100%;
  max-height: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 5px;
}

.gallery-item-delete {
  position: absolute;
  pointer-events: all;
  top: 0;
  right: 0;
  margin: -5px;
  height: 30px !important;
  width: 30px !important;
}
</style>
