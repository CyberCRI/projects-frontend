<script setup lang="ts">
import {
  deleteAttachmentFile,
  patchAttachmentFile,
  postAttachmentFiles,
} from '~/api/attachment-files.service'
import type { TranslatedAttachmentLink } from '~/models/attachment-link.model'
import { attachementFileSkeletons } from '~/skeletons/attachements.skeletons'
import { getProjectAttachmentFiles } from '~/api/v2/attachment-files.service'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import ResourceDrawerV2 from '~/components/resources/ResourceDrawerV2.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { AttachmentForm } from '~/models/attachment.model'
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

const { t } = useNuxtI18n()
const asyncing = ref(false)
const toaster = useToaster()
const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.files, props.limit))

const {
  status,
  data: files,
  pagination,
  refresh,
} = getProjectAttachmentFiles(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(attachementFileSkeletons, limitSkeletons.value),
})

const { stateModals, closeAllModals, openModals } = useModals({
  edit: false,
  add: false,
  delete: false,
})

const cancel = () => {
  selectedFile.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  cancel()
}

const selectedFile = ref<TranslatedAttachmentLink>()
const onEdit = (item) => {
  selectedFile.value = item
  openModals('edit')
}

const onDelete = (item) => {
  selectedFile.value = item
  openModals('delete')
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteAttachmentFile(props.project.id, selectedFile.value.id)
    .then(() => {
      toaster.pushSuccess(t('toasts.link-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.link-delete.error')))
    .finally(() => (asyncing.value = false))
}

const onSubmit = (form: AttachmentForm) => {
  asyncing.value = true

  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('description', form.description)
  formData.append('project_id', props.project.id)
  formData.append('file', form.file, form.file.name)
  formData.append('mime', form.file.type)

  if (form.id) {
    // on update remove file (old things 😕)
    formData.delete('file')
    formData.delete('mime')
    patchAttachmentFile(props.project.id, selectedFile.value.id, formData)
      .then(() => {
        toaster.pushSuccess(t('toasts.link-update.success'))
        fullRefresh()
      })
      .catch(() => toaster.pushError(t('toasts.link-update.error')))
      .finally(() => (asyncing.value = false))
  } else {
    postAttachmentFiles(props.project.id, formData)
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
    <!-- files -->
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    >
      <SectionHeader
        :title="$t('resource.file.label', project.modules.files)"
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
        :mime="item.mime"
        @delete="onDelete(item)"
        @edit="onEdit(item)"
      />
    </div>
    <NothingHere v-if="files.length === 0 && !preview" />

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
      :resource="selectedFile"
      :subtitle="selectedFile.$t.description"
      :title="selectedFile.$t.title"
      :mime="selectedFile.site_url"
      icon="File"
    />
  </ConfirmModal>

  <!-- drawer -->
  <ResourceDrawerV2
    :is-opened="stateModals.edit"
    :asyncing="asyncing"
    form-type="file"
    :resource="selectedFile"
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
