<script setup lang="ts">
import {
  deleteOrganizationFile,
  patchOrganizationFile,
  postOrganizationFiles,
} from '~/api/organization-files.service'
import { attachementFileSkeletons } from '~/skeletons/attachements.skeletons'
import ResourceDrawerV2 from '~/components/resources/ResourceDrawerV2.vue'
import { getOrganizationFiles } from '~/api/v2/organization-files.service'
import type { AttachmentFileModel } from '~/models/attachment-file.model'
import type { AttachmentForm } from '~/models/attachment.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

const { t } = useNuxtI18n()

const toaster = useToasterStore()
const { isAdmin } = usePermissions()

const { stateModals, closeModals, openModals, closeAllModals } = useModals({
  drawer: false,
  delete: false,
})

const organizationsStore = useOrganizationsStore()
const organizationCode = useOrganizationCode()
const organization = computed(() => organizationsStore?.current)

const asyncing = ref(false)

const selectedItem = ref<AttachmentFileModel | null>(null)

const isEditionEnabled = computed(() => isAdmin.value)

const {
  status,
  data: resources,
  refresh,
  pagination,
} = getOrganizationFiles(organizationCode, {
  default: () => factoryPagination(attachementFileSkeletons),
})

const onEdit = (resource?: AttachmentFileModel) => {
  selectedItem.value = resource
  openModals('drawer')
}

const onDelete = (resource) => {
  selectedItem.value = resource
  openModals('delete')
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteOrganizationFile(organizationCode, selectedItem.value.id)
    .then(() => {
      closeAllModals()
      toaster.pushSuccess(t('toasts.file-delete.success'))
      refresh()
    })
    .catch(() => toaster.pushError(t('toasts.file-delete.error')))
    .finally(() => {
      asyncing.value = false
      closeModals('delete')
    })
}

const onSubmit = (resource: AttachmentForm) => {
  asyncing.value = true

  const formData = new FormData()
  formData.append('title', resource.title)
  formData.append('description', resource.description)
  formData.append('file', resource.file, resource.file.name)
  formData.append('mime', resource.file.type)

  if (resource.id) {
    // on update remove file (old things 😕)
    formData.delete('file')
    formData.delete('mime')

    patchOrganizationFile(organizationCode, resource.id, formData)
      .then(() => {
        closeAllModals()
        toaster.pushSuccess(t('toasts.file-update.success'))
        refresh()
      })
      .catch(() => toaster.pushError(t('toasts.file-update.success')))
      .finally(() => (asyncing.value = false))
  } else {
    postOrganizationFiles(organizationCode, formData)
      .then(() => {
        closeAllModals()
        toaster.pushSuccess(t('toasts.file-create.success'))
        refresh()
      })
      .catch(() => toaster.pushError(t('toasts.file-create.error')))
      .finally(() => (asyncing.value = false))
  }
}

useLpiHead2({
  title: t('home.documents'),
})
</script>

<template>
  <div class="page-section-narrow organization-resources-page pssi page-top">
    <h1 class="page-title">
      {{ t('documents-page.title', { platformName: organization.$t.name }) }}
    </h1>
    <p class="notice">
      {{ t('documents-page.description', { platformName: organization.$t.name }) }}
    </p>
    <FetchLoader :status="status" only-error skeleton>
      <div v-if="isEditionEnabled" class="add-resource">
        <LpiButton
          :label="t('resource.add-file')"
          class="add-item-btn skeletons-background"
          btn-icon="Plus"
          data-test="in-page-add-resources"
          @click="onEdit"
        />
      </div>
      <div class="resource-ctn">
        <ResourceCard
          v-for="file in resources"
          :key="file.id"
          :can-delete="isEditionEnabled"
          :can-edit="isEditionEnabled"
          :resource="file"
          :title="file.$t.title"
          :subtitle="file.$t.description"
          :mime="file.mime"
          @edit-clicked="onEdit(file)"
          @delete-clicked="onDelete(file)"
        />
      </div>
      <NothingHere v-if="resources.length === 0" />
      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>

    <ConfirmModal
      v-if="stateModals.delete"
      :content="t('admin.org-file-confirm-delete')"
      :title="t('common.delete')"
      :asyncing="asyncing"
      @cancel="closeModals('delete')"
      @confirm="onDeleteConfirm"
    />

    <ResourceDrawerV2
      :is-opened="stateModals.drawer"
      :resource="selectedItem"
      form-type="file"
      @close="closeModals('drawer')"
      @submit="onSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
}

.actions-ctn {
  position: absolute;
  top: -20px;
  right: 15px;
  display: flex;

  button:last-of-type {
    margin-left: $space-s;
  }
}

.organization-resources-page {
  .resource-ctn {
    display: flex;
    flex-wrap: wrap;
    gap: $space-m;
    padding: $space-l 0;

    > div {
      width: calc(33% - $space-m);
    }
  }

  .link-header {
    margin-top: $space-l;
  }

  .category-title {
    color: $primary-dark;
    text-transform: uppercase;
    font-size: $font-size-xs;
    font-weight: 700;
  }
}

.add-resource {
  display: flex;
  justify-content: flex-end;
  padding: $space-l 0;
}

@media screen and (max-width: $max-tablet) {
  .organization-resources-page .resource-ctn {
    > div {
      width: calc(50% - $space-m);
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .organization-resources-page .resource-ctn {
    > div {
      width: 100%;
    }
  }
}
</style>
