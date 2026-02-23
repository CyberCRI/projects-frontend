<template>
  <div class="gallery-container">
    <!-- editable button -->
    <LpiButton
      v-if="editable"
      btn-icon="Plus"
      :label="$t('group.form.add')"
      class="edit-btn"
      @click="openModals('create')"
    />

    <FetchLoader :status="status" skeleton only-error>
      <GalleryList
        :images="data"
        :editable="editable"
        :image-size="preview ? 'small' : 'medium'"
        @click="onView"
        @delete="onDelete"
      />
      <EmptyLabel v-if="data.length === 0" :label="$t('gallery.empty')" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </FetchLoader>

    <GalleryDeleteModal
      v-if="stateModals.delete"
      :loading="loading"
      :image="selected"
      @close="closeModals('delete')"
      @submit="deleteImage"
    />
    <GalleryDrawer
      :is-opened="stateModals.gallery"
      :status="status"
      :images="data"
      :selected="selected"
      :pagination="pagination"
      @close="closeModals('gallery')"
    />
    <GalleryForm
      v-if="stateModals.create"
      :loading="loading"
      :status="imagesStatusUploading"
      @close="closeForm"
      @submit="createImage"
    />
  </div>
</template>

<script setup lang="ts">
import { deleteGroupGallery, postGroupGallery } from '@/api/groups.service'
import { getGroupGallery } from '@/api/v2/group.service'
import EmptyLabel from '@/components/base/EmptyLabel.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import GalleryDeleteModal from '@/components/base/gallery/GalleryDeleteModal.vue'
import GalleryDrawer from '@/components/base/gallery/GalleryDrawer.vue'
import GalleryForm from '@/components/base/gallery/GalleryForm.vue'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'
import { useModals } from '@/composables/useModal'
import { ImageGalleryForm } from '@/interfaces/gallery'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { imageGallerySkeleton } from '@/skeletons/gallery.skeletons'
import useToasterStore from '@/stores/useToaster'
import { AsyncDataRequestStatus } from 'nuxt/app'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  { preview: false, editable: false, limit: null }
)
const { t } = useNuxtI18n()
const loading = ref(false)
const selected = ref(null)
const toaster = useToasterStore()
const { stateModals, closeModals, openModals } = useModals({
  delete: false,
  gallery: false,
  create: false,
  status: false,
})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.gallery, props.limit))
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)
const { pagination, data, status, refresh } = getGroupGallery(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(imageGallerySkeleton, limitSkeletons.value),
})

const onView = (image) => {
  selected.value = image
  openModals('gallery')
}
const onDelete = (image) => {
  selected.value = image
  openModals('delete')
}

const deleteImage = () => {
  loading.value = true
  deleteGroupGallery(organizationCode, groupId.value, selected.value.id)
    .then(() => {
      toaster.pushSuccess(t('gallery.success-delete'))
      refreshNuxtData(`${organizationCode}::group::${groupId.value}`)
      refresh()
    })
    .catch(() => toaster.pushError(t('gallery.error-delete')))
    .finally(() => {
      loading.value = false
      closeModals('delete')
    })
}

const imagesStatusUploading = ref<Map<string, AsyncDataRequestStatus>>(null)
const createImage = (form: ImageGalleryForm) => {
  loading.value = true
  imagesStatusUploading.value = new Map()
  openModals('status')

  Promise.all(
    form.files.map((el) => {
      const body = new FormData()
      body.append('file', el.file)

      imagesStatusUploading.value.set(el.url, 'pending')
      return postGroupGallery(organizationCode, groupId.value, body)
        .then(() => {
          imagesStatusUploading.value.set(el.url, 'success')
        })
        .catch((err) => {
          imagesStatusUploading.value.set(el.url, 'error')
          throw err
        })
    })
  )
    .then(() => {
      toaster.pushSuccess(t('gallery.success-create'))
      // refetch new datas
      refreshNuxtData(`${organizationCode}::group::${groupId.value}`)
      refresh()
    })
    .catch(() => toaster.pushError(t('gallery.error-create')))
    .finally(() => (loading.value = false))
}

const closeForm = () => {
  imagesStatusUploading.value = null
  closeModals('create')
}
</script>

<style lang="scss">
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.edit-btn {
  align-self: end;
}
</style>
