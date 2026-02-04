<template>
  <button
    class="reset-btn gallery-button shadow-box skeletons-background"
    :class="editable ? 'pointer-events-none' : ''"
    :title="$t('gallery.view')"
    @click.stop="$emit('click')"
  >
    <img :src="image.src" :alt="image.alt" :style="styleImg" class="gallery-item" />
    <LpiButton
      v-if="editable"
      :title="$t('common.delete')"
      btn-icon="Close"
      class="gallery-item-delete"
      @click.stop="$emit('delete')"
    />
  </button>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import { ImageGallery } from '@/interfaces/gallery'
import { StyleValue } from 'vue'

withDefaults(
  defineProps<{
    image: ImageGallery
    editable?: boolean
    styleImg?: StyleValue
  }>(),
  { editable: false, styleImg: null }
)

defineEmits<{
  click: []
  delete: []
}>()
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
}
</style>
