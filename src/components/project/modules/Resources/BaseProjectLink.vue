<script setup lang="ts">
import { attachementLinkSkeletons } from '~/skeletons/attachements.skeletons'
import { getProjectAttachmentLinks } from '~/api/v2/attachment-link.service'
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
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.links, props.limit))

const {
  status,
  data: links,
  pagination,
  key,
} = getProjectAttachmentLinks(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(attachementLinkSkeletons, limitSkeletons.value),
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
    <!-- links -->
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('add')"
    >
      <SectionHeader
        :title="$t('resource.links', project.modules.links)"
        :quantity="project.modules.links"
        :has-button="false"
      />
    </BaseModuleHeader>
    <div class="resource-container">
      <ResourceCard
        v-for="item in links"
        :key="item.id"
        :can-delete="editable"
        :can-edit="editable"
        :resource="item"
        :subtitle="item.$t.description"
        :title="item.$t.title"
        icon="LinkRotated"
        @delete-clicked="onDelete(item)"
        @edit-clicked="onEdit(item)"
      />
    </div>
    <NothingHere v-if="links.length === 0 && !preview" />

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
