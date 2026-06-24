<script setup lang="ts">
import {
  deleteProjectAttachmentLink,
  patchProjectAttachmentLink,
  postProjectAttachmentLinks,
} from '~/api/attachment-links.service'
import { attachementLinkSkeletons } from '~/skeletons/attachements.skeletons'
import { getProjectAttachmentLinks } from '~/api/v2/attachment-link.service'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import ResourceDrawerV2 from '~/components/resources/ResourceDrawerV2.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { AttachmentForm } from '~/models/attachment.model'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getMimeFromType } from '~/functs/imageSizesUtils'

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

const { t } = useNuxtI18n()
const asyncing = ref(false)
const toaster = useToaster()
const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.links, props.limit))

const {
  status,
  data: links,
  pagination,
  refresh,
} = getProjectAttachmentLinks(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(attachementLinkSkeletons, limitSkeletons.value),
})

const { stateModals, closeAllModals, openModals } = useModals({
  edit: false,
  add: false,
  delete: false,
})

const cancel = () => {
  selectedLink.value = null
  closeAllModals()
}

const fullRefresh = () =>
  refreshProjectData(props.project).then(() => {
    refresh()
    cancel()
  })

const selectedLink = ref()
const onEdit = (item) => {
  selectedLink.value = item
  openModals('edit')
}

const onDelete = (item) => {
  selectedLink.value = item
  openModals('delete')
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteProjectAttachmentLink(props.project.id, selectedLink.value.id)
    .then(() => {
      toaster.pushSuccess(t('toasts.link-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.link-delete.error')))
    .finally(() => (asyncing.value = false))
}

const onSubmit = (form: AttachmentForm) => {
  asyncing.value = true
  form.project_id = props.project.id
  if (form.id) {
    patchProjectAttachmentLink(props.project.id, selectedLink.value.id, form)
      .then(() => {
        toaster.pushSuccess(t('toasts.link-update.success'))
        fullRefresh()
      })
      .catch(() => toaster.pushError(t('toasts.link-update.error')))
      .finally(() => (asyncing.value = false))
  } else {
    postProjectAttachmentLinks(props.project.id, form)
      .then(() => {
        toaster.pushSuccess(t('toasts.link-create.success'))
        fullRefresh()
      })
      .catch(() => toaster.pushError(t('toasts.link-create.error')))
      .finally(() => (asyncing.value = false))
  }
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <!-- links -->
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    >
      <SectionHeader
        :title="$t('resource.link.label', project.modules.links)"
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
        :mime="getMimeFromType(item.attachment_type)"
        icon="LinkRotated"
        @delete="onDelete(item)"
        @edit="onEdit(item)"
      />
    </div>
    <NothingHere v-if="links.length === 0 && !preview" />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer / modal -->
  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('resource.delete')"
    :asyncing="asyncing"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <ResourceCard
      :resource="selectedLink"
      :subtitle="selectedLink.$t.description"
      :title="selectedLink.$t.title"
      :mime="getMimeFromType(selectedLink.attachment_type)"
      icon="LinkRotated"
    />
  </ConfirmModal>

  <!-- drawer -->
  <ResourceDrawerV2
    :is-opened="stateModals.edit"
    :asyncing="asyncing"
    form-type="link"
    :resource="selectedLink"
    @close="cancel"
    @submit="onSubmit"
  />
</template>

<style lang="scss" scoped>
.resource-container {
  display: flex;
  flex-wrap: wrap;
  gap: $space-m;
  padding: $space-m 0;

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
