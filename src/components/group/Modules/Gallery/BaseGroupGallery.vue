<template>
  <div class="gallery-container">
    <LpiButton
      v-if="isInEditingMode"
      btn-icon="Plus"
      :label="$t('group.form.add')"
      class="edit-btn"
      @click="showEdit = true"
    />
    <GalleryForm v-if="showEdit" v-model="form" @close="showEdit = false" @submit="submit" />
    <GalleryList :images="data" @click="onSelect" />
    <PaginationButtons2 v-if="!preview" :pagination="pagination" />
    <GalleryDrawer
      :is-opened="selected !== null"
      :status="status"
      :images="data"
      :selected="selected"
      :pagination="pagination"
      @close="selected = null"
    />
  </div>
</template>

<script setup lang="ts">
import { getGroupGallery } from '@/api/v2/group.service'
import GalleryDrawer from '@/components/base/gallery/GalleryDrawer.vue'
import GalleryForm from '@/components/base/gallery/GalleryForm.vue'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import { ImageGalleryForm } from '@/interfaces/gallery'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    preview?: boolean
    limit?: number
    isInEditingMode?: boolean
  }>(),
  { preview: false, isInEditingMode: false, limit: null }
)

const form = ref<ImageGalleryForm>({
  header_image: null,
  imageSizes: null,
})
const showEdit = ref(false)
const selected = ref(null)

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)
const { pagination, data, status } = getGroupGallery(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
})

const submit = () => {
  console.log(form.value)
  showEdit.value = false
}

const onSelect = (image) => {
  console.log('select', image)
  selected.value = image
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
