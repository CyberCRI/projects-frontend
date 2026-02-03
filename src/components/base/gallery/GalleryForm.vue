<template>
  <DialogModal
    :confirm-button-label="isExist ? $t('common.edit') : $t('common.add')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="loading"
    :disabled="loading || !isValid"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #header>
      {{ isExist ? $t('gallery.edit') : $t('gallery.add') }}
    </template>

    <template #body>
      <div class="gallery-map-ctn">
        <ImageEditor
          v-model:image-sizes="form.imageSizes"
          v-model:picture="form.header_image"
          :no-resize="true"
        />
      </div>
    </template>

    <template #extra-buttons>
      <LpiButton
        class="delete-button"
        :label="$t('common.delete')"
        :btn-icon="loading ? 'LoaderSimple' : null"
        @click="$emit('delete')"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/base/modal/DialogModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { ImageGalleryForm } from '@/interfaces/gallery'
import { useGalleryImageForm } from '@/form/gallery'

withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)
defineEmits(['submit', 'close', 'delete'])

const model = defineModel<ImageGalleryForm>()

const { form, isValid } = useGalleryImageForm({ model })

const isExist = computed(() => !!form.value.id)
</script>

<style lang="scss" scoped>
.new-coords {
  text-align: center;
  font-style: italic;
  font-weight: normal;
}

.description-input {
  margin-top: $space-m;
}

.gallery-type-ctn {
  margin: $space-m 0;

  .gallery-type-label {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-2xs;
  }
}

.delete-button {
  color: $white;
  border-color: $salmon;
  background: $salmon;
}
</style>

<style>
.gallery-map-ctn .map-recap {
  height: 250px;
}
</style>
