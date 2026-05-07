<script setup lang="ts">
import { attachementFileSkeletons } from '~/skeletons/attachements.skeletons'
import { getProjectAttachmentFiles } from '~/api/v2/attachment-files.service'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)

const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.files, props.limit))

const {
  status,
  data: files,
  pagination,
  key,
} = getProjectAttachmentFiles(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(attachementFileSkeletons, limitSkeletons.value),
})

const { stateModals, closeAllModals, closeModals, openModals } = useModals({
  edit: false,
  add: false,
  delete: false,
})

const cancel = () => {
  selectedFile.value = null
  closeAllModals()
}

const refreshProjectData = () => {
  refreshNuxtData([
    `${organizationCode}::project::${props.project.id}`,
    `${organizationCode}::project::${props.project.slug}`,
    key.value,
  ])
  cancel()
}

const selectedFile = ref()
const onEdit = (item) => {
  selectedFile.value = item
  openModals('edit')
}

const onDelete = (item) => {
  selectedFile.value = item
  openModals('delete')
}

const onDeleteConfirm = () => {
  cancel()
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <!-- files -->
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('add')"
    >
      <SectionHeader
        :title="$t('resource.files', project.modules.files)"
        :quantity="project.modules.files"
        :has-button="false"
      />
    </BaseModuleHeader>
    <div class="resource-container">
      <ResourceCard
        v-for="item in files"
        :key="item.id"
        :can-delete="editable"
        :can-edit="editable"
        :resource="item"
        :subtitle="item.$t.description"
        :title="item.$t.title"
        icon="File"
        @delete-clicked="onDelete(item)"
        @edit-clicked="onEdit(item)"
      />
    </div>
    <NothingHere v-if="files.length === 0 && !preview" />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer / modal -->
  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('resource.delete')"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <ResourceCard
      :resource="selectedFile"
      :subtitle="selectedFile.$t.description"
      :title="selectedFile.$t.title"
      icon="File"
    />
  </ConfirmModal>
</template>

<style lang="scss" scoped>
.resource-container {
  display: flex;
  flex-wrap: wrap;
  gap: $space-m;
  padding: $space-l 0;

  &:empty {
    display: none;
  }

  > div {
    width: calc(33% - $space-m);

    @media screen and (max-width: $max-tablet) {
      width: calc(50% - $space-m);
    }

    @media screen and (max-width: $min-tablet) {
      width: 100%;
    }
  }
}
</style>
