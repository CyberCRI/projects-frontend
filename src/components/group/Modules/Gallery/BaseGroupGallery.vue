<template>
  <div class="gallery-container">
    <GalleryList :images="images" @click="onSelect" />
    <PaginationButtons2 v-if="pagination" :pagination="pagination" />
    <GalleryDrawer
      :is-opened="selected !== null"
      :status="status"
      :images="images"
      :selected="selected"
      :pagination="pagination"
      @close="selected = null"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryDrawer from '@/components/base/gallery/GalleryDrawer.vue'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import { AsyncDataRequestStatus } from 'nuxt/app'

// withDefaults(
//   defineProps<{
//     group: TranslatedPeopleGroupModel
//     preview?: boolean
//     limit?: number
//   }>(),
//   { preview: false }
// )

const images = [
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
  {
    src: 'https://www.airproducts.fr/-/media/images/1440x810/masthead/949946968-laboratory-16x9.jpg?as=0&w=1439&hash=BECD74768EC803085E4B64DA85E5BA12',
    atl: '',
  },
]

const res = ref<PaginationResult>({
  count: 66,
  total_page: 44,
  current_page: 1,
  results: [],
})
const selected = ref(null)
const pagination = usePagination(res)

const onSelect = (image) => {
  console.log('select', image)
  selected.value = image
}

const status = ref<AsyncDataRequestStatus>('success')
watch(pagination.current, () => {
  status.value = 'pending'

  setTimeout(() => (status.value = 'success'), 2000)
})
</script>

<style lang="scss">
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
