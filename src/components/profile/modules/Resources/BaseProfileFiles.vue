<script setup lang="ts">
import {
  deleteUserAttachmentFile,
  patchUserAttachmentFile,
  postUserAttachmentFile,
} from 'shared-projects-frontend/apis'
import type {
  TranslatedAttachmentFile,
  TranslatedUserModel,
  AttachmentForm,
} from 'shared-projects-frontend/models'
import { attachementFileSkeletons } from '~/skeletons/attachements.skeletons'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import ResourceDrawerV2 from '~/components/resources/ResourceDrawerV2.vue'
import { getUserAttachmentFile } from '~/api/v2/attachment-files.service'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import { refreshUserData } from '~/composables/user/refreshUser'
import SectionHeader from '~/components/base/SectionHeader.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
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
const profileId = computed(() => props.profile.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.profile.modules.files || 0, props.limit))

const {
  status,
  data: files,
  pagination,
  refresh,
  isLoading,
} = getUserAttachmentFile(organizationCode, profileId, {
  paginationConfig: {
    limit: props.limit,
  },
  checkArgs: true,
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

const fullRefresh = () =>
  refreshUserData(props.profile).then(() => {
    refresh()
    cancel()
  })

const selectedFile = ref<TranslatedAttachmentFile>()
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
  deleteUserAttachmentFile(props.profile.id, selectedFile.value.id)
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
  formData.append('user_id', props.profile.id.toString())
  formData.append('file', form.file, form.file.name)
  formData.append('mime', form.file.type)

  if (form.id) {
    // on update remove file (old things 😕)
    formData.delete('file')
    formData.delete('mime')
    patchUserAttachmentFile(props.profile.id, selectedFile.value.id, formData)
      .then(() => {
        toaster.pushSuccess(t('toasts.link-update.success'))
        fullRefresh()
      })
      .catch(() => toaster.pushError(t('toasts.link-update.error')))
      .finally(() => (asyncing.value = false))
  } else {
    postUserAttachmentFile(props.profile.id, formData)
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
        :title="$t('resource.file.label', profile.modules.files || 0)"
        :quantity="profile.modules.files || 0"
        :has-button="false"
      />
    </BaseModuleHeader>
    <div class="resource-container" :class="{ 'is-preview': preview }">
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
    <NothingHere v-if="!isLoading && files.length === 0 && !preview" />

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
      :mime="selectedFile.mime"
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
@use '~/design/scss/variables';

.resource-container {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-m;
  padding: variables.$space-m 0;

  &:empty {
    display: none;
  }

  &.is-preview {
    flex-basis: 50%;
  }

  &:not(.is-preview) > div {
    width: calc(33% - variables.$space-m);

    @media screen and (max-width: variables.$max-tablet) {
      width: calc(50% - variables.$space-m);
    }

    @media screen and (max-width: variables.$min-tablet) {
      width: 100%;
    }
  }

  &.is-preview > div {
    width: calc(50% - variables.$space-m);

    @media screen and (max-width: variables.$min-tablet) {
      width: 100%;
    }
  }
}
</style>
