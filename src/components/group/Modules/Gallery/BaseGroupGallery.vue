<template>
  <div class="gallery-container">
    <LpiButton
      v-if="editable"
      btn-icon="Plus"
      :label="$t('group.form.add')"
      class="edit-btn"
      @click="openModals('create')"
    />
    <GalleryForm
      v-if="stateModals.create"
      v-model="form"
      :loading="loading"
      @close="closeModals('create')"
      @submit="createImage"
    />
    <GalleryList :images="data" :editable="editable" @click="onView" @delete="onDelete" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
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
  </div>
</template>

<script setup lang="ts">
import { deleteGroupGallery, postGroupGallery } from '@/api/groups.service'
import { getGroupGallery } from '@/api/v2/group.service'
import GalleryDeleteModal from '@/components/base/gallery/GalleryDeleteModal.vue'
import GalleryDrawer from '@/components/base/gallery/GalleryDrawer.vue'
import GalleryForm from '@/components/base/gallery/GalleryForm.vue'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'
import { useModals } from '@/composables/useModal'
import { ImageGalleryForm } from '@/interfaces/gallery'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import useToasterStore from '@/stores/useToaster'

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
const form = ref<ImageGalleryForm>({
  pictures: null,
})
const loading = ref(false)
const selected = ref(null)
const toaster = useToasterStore()
const { stateModals, closeModals, openModals } = useModals({
  delete: false,
  gallery: false,
  create: false,
})

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)
const { pagination, data, status, refresh } = getGroupGallery(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
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
      // refetch new datas
      refresh()
    })
    .catch(() => toaster.pushError(t('gallery.error-delete')))
    .finally(() => {
      loading.value = false
      closeModals('delete')
    })
}

const createImage = () => {
  loading.value = true
  postGroupGallery(organizationCode, groupId.value, form.value)
    .then(() => {
      toaster.pushSuccess(t('gallery.success-create'))
      // refetch new datas
      refresh()
    })
    .catch(() => toaster.pushError(t('gallery.error-create')))
    .finally(() => {
      loading.value = false
      closeModals('create')
    })
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
