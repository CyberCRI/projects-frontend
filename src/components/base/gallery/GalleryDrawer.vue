<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('gallery.title')"
    class="full transparent"
    no-footer
    @close="$emit('close')"
  >
    <template #header_clear>
      <span class="gallery-info">
        {{ selectedIndex + 1 }} / {{ pagination.total.value }} ({{ localindex }})
      </span>
    </template>
    <FetchLoader :status="status">
      <div class="gallery-switch">
        <div class="gallery-button">
          <LpiButton
            v-show="canPrev"
            class="skeletons-background"
            btn-icon="ArrowLeft"
            :disabled="!canPrev"
            @click="prev"
          />
        </div>
        <GalleryItem :image="selectedImage" class="gallery-item" />
        <div class="gallery-button">
          <LpiButton
            v-show="canNext"
            class="skeletons-background"
            btn-icon="ArrowRight"
            :disabled="!canNext"
            @click="next"
          />
        </div>
      </div>
    </FetchLoader>
    {{ pagination.offset.value }}
    {{ pagination.limit.value }}
  </BaseDrawer>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import { AsyncDataRequestStatus } from 'nuxt/app'

const props = defineProps<{
  isOpened: boolean
  images: any[]
  pagination: Pagination
  selected: any
  status: AsyncDataRequestStatus
}>()

defineEmits(['close'])

const localindex = ref(null)

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

const selectedIndex = computed(() => {
  return props.pagination.offset.value + localindex.value
})

const selectedImage = computed(() => {
  return props.selected
})

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
  return selectedIndex.value < props.pagination.total.value
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
  margin: auto;
  width: 100%;
  height: 100%;
}

.gallery-info {
  color: white;
  font-weight: bold;
  padding: 0 1rem;
  font-style: italic;
}

.gallery-button {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  // padding: .5rem;
}

.gallery-item {
  pointer-events: none;
}
</style>
