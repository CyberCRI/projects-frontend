<template>
  <ConfirmModal
    :title="$t('gallery.delete')"
    :asyncing="loading"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <div class="gallery-container">
      <span class="m-auto">{{ $t('gallery.confirm-delete') }}</span>
      <GalleryItem :image="image" class="pointer-events-none" size="full" />
    </div>
  </ConfirmModal>
</template>

<script setup lang="ts">
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { ImageModel } from '@/models/image.model'

defineProps<{ image: ImageModel; loading?: boolean }>()
defineEmits(['close', 'submit'])
</script>

<style lang="scss">
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
