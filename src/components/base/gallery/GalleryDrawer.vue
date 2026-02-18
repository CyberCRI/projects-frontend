<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('gallery.title')"
    class="full transparent"
    no-footer
    @close="$emit('close')"
  >
    <template #header_clear>
      <span class="gallery-info">{{ selectedIndex + 1 }} / {{ pagination.count.value }}</span>
    </template>
    <FetchLoader :status="status" class-loading="loader-text" class-error="loader-text">
      <div class="gallery-switch">
        <div class="gallery-button">
          <LpiButton
            v-show="canPrev"
            class="skeletons-background"
            btn-icon="ArrowLeft"
            :aria-label="$t('pagination.previous')"
            :disabled="!canPrev"
            @click="prev"
          />
        </div>
        <div class="container">
          <Transition appear :name="transition">
            <GalleryItem
              :key="localindex"
              :image="imageSelected"
              class="gallery-item"
              size="original"
            />
          </Transition>
        </div>
        <div class="gallery-button">
          <LpiButton
            v-show="canNext"
            class="skeletons-background"
            btn-icon="ArrowRight"
            :aria-label="$t('pagination.next')"
            :disabled="!canNext"
            @click="next"
          />
        </div>
      </div>
    </FetchLoader>
  </BaseDrawer>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import { DEFAULT_IMAGE_PATATOID, usePatatoid } from '@/composables/usePatatoids'
import { urlToImageModel } from '@/functs/imageSizesUtils'
import { ImageModel } from '@/models/image.model'
import { AsyncDataRequestStatus } from 'nuxt/app'

const props = withDefaults(
  defineProps<{
    isOpened: boolean
    images?: ImageModel[]
    pagination: Pagination
    selected?: ImageModel
    status?: AsyncDataRequestStatus
  }>(),
  {
    status: 'success',
    images: () => [],
    selected: null,
  }
)

defineEmits(['close'])

const localindex = ref(null)
const transition = ref('')

watch(
  () => props.isOpened,
  () => {
    if (!props.isOpened) {
      localindex.value = false
    } else {
      const selected = toRaw(props.selected)
      localindex.value = props.images.findIndex((el) => el === selected)
    }
  }
)

const DEFAULT_IMAGE = urlToImageModel(usePatatoid(DEFAULT_IMAGE_PATATOID))
const imageSelected = computed(() => props.images[localindex.value] ?? DEFAULT_IMAGE)
const selectedIndex = computed(() => props.pagination.offset.value + localindex.value)

watch(
  selectedIndex,
  (newIndex, oldIndex) => {
    if (newIndex < oldIndex) {
      transition.value = 'slide-left'
    } else {
      transition.value = 'slide-right'
    }
  },
  { flush: 'pre', immediate: true }
)

const canPrev = computed(() => {
  return selectedIndex.value !== 0
})
const prev = () => {
  if (localindex.value === 0) {
    props.pagination.prev()
    localindex.value = props.pagination.limit.value - 1
  } else {
    localindex.value -= 1
  }
}
const canNext = computed(() => {
  return selectedIndex.value + 1 < props.pagination.count.value
})
const next = () => {
  if (localindex.value + 1 === props.pagination.limit.value) {
    props.pagination.next()
    localindex.value = 0
  } else {
    localindex.value += 1
  }
}
</script>

<style lang="scss" scoped>
.gallery-switch {
  display: grid;
  grid-template-columns: pxToRem(40px) 1fr pxToRem(40px);
  margin: 0 auto;
  width: 100%;
  height: calc(100% - 64px);
}

.gallery-info {
  color: white;
  font-weight: bold;
  padding: 0 1rem;
  font-style: italic;
  font-size: small;
  opacity: 0.4;
}

.gallery-button {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-item {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

.slide-right-leave-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-left-enter-active {
  transition: transform 0.2s;
  transform: translateX(0);
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(-100vw);
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(100vw);
}

.container {
  position: relative;
}
</style>

<style lang="scss">
.loader-text {
  color: white;

  .loading {
    opacity: 0.9;
  }

  svg {
    fill: white;
  }
}
</style>
