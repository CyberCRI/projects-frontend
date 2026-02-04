<template>
  <DialogModal
    :asyncing="loading"
    :cancel-button-label="$t('common.close')"
    :no-second-button="true"
    @close="$emit('close')"
  >
    <template #header>
      {{ $t('gallery.uploading') }}
    </template>
    <template #body>
      <div class="gallery-container">
        <GalleryList v-slot="{ image }" :images="infos.images">
          <div class="pointer-events-none gallery-uploading">
            <GalleryItem
              :image="image"
              class="gallery-uploading-image"
              :style-img="{ objectFit: 'cover' }"
            />
            <div class="gallery-uploading-status">
              <LoaderSimple v-if="infos.status[image.url] === 'pending'" />
              <!-- <IconImage v-if="image.status === 'pending'" name="Circle" class="pending" /> -->
              <IconImage
                v-else-if="infos.status[image.url] === 'success'"
                name="Check"
                class="success"
              />
              <IconImage
                v-else-if="infos.status[image.url] === 'error'"
                name="Close"
                class="error"
              />
              <IconImage v-else name="Alert" class="warning" />
            </div>
          </div>
        </GalleryList>
      </div>
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { fileToImageModel } from '@/functs/imageSizesUtils'
import { AsyncDataRequestStatus } from 'nuxt/app'

const props = defineProps<{
  loading?: boolean
  status: Map<File, AsyncDataRequestStatus>
}>()
defineEmits(['close', 'submit'])

const infos = computed(() => {
  const imgStatus = {}
  const images = []
  props.status.forEach((status, file) => {
    const image = fileToImageModel(file)
    images.push(image)
    imgStatus[image.url] = status
  })
  return {
    images,
    status: imgStatus,
  }
})
</script>

<style lang="scss" scoped>
.gallery-uploading {
  position: relative;
}

.gallery-uploading-image {
  opacity: 0.6;
}

.gallery-uploading-status {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: $modal-background;

  & > * {
    margin: auto;
    width: 25%;

    &.pending {
      fill: $primary-lighter;
    }

    &.success {
      fill: $primary;
    }

    &.error {
      fill: $red;
    }

    &.warning {
      fill: $salmon;
    }
  }
}

.gallery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;

  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);

    > * {
      height: pxToRem(130px);
    }
  }
}
</style>
