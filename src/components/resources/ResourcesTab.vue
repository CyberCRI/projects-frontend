<template>
  <div class="project-resources">
    <BaseModuleHeader :editable="editable" @add="$emit('edit')" />

    <SectionHeader
      v-if="fileResources.length"
      :has-button="false"
      :quantity="fileResources.length"
      :title="$t('common.file', fileResources.length)"
    />

    <div v-if="fileResources.length" class="resource-ctn">
      <ResourceCard
        v-for="file in fileResources"
        :key="file.id"
        :can-delete="isEditionEnabled"
        :can-edit="isEditionEnabled"
        :resource="file"
        :subtitle="file?.$t?.description"
        :title="file?.$t?.title"
        :mime="file?.mime"
        @edit="$emit('edit', file)"
        @delete="openModal(file, 'file')"
      />
    </div>
    <EmptyLabel v-else />

    <SectionHeader
      v-if="linkResources.length"
      :has-button="false"
      :quantity="linkResources.length"
      :title="$t('resource.web', linkResources.length)"
      class="link-header"
    />

    <div v-if="linkResources.length" class="resource-ctn">
      <ResourceCard
        v-for="link in linkResources"
        :key="link.id"
        :can-delete="isEditionEnabled"
        :can-edit="isEditionEnabled"
        :resource="link"
        :subtitle="link?.$t?.description"
        :title="link?.$t?.title"
        :mime="getMimeFromType(link?.attachment_type)"
        @edit="$emit('edit', link)"
        @delete="openModal(link, 'link')"
      />
    </div>

    <ConfirmModal
      v-if="confirmModalVisible"
      :content="confirmModalContent"
      :title="$t('common.delete')"
      :asyncing="asyncing"
      @cancel="confirmModalVisible = false"
      @confirm="deleteResource(currentResource, currentType)"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'

import type { TranslatedAttachmentLink } from '~/models/attachment-link.model'
import type { TranslatedAttachmentFile } from '~/models/attachment-file.model'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getMimeFromType } from '~/functs/imageSizesUtils'
import useToasterStore from '~/stores/useToaster'

const props = withDefaults(
  defineProps<{
    fileResources?: TranslatedAttachmentFile[]
    linkResources?: TranslatedAttachmentLink[]
    deleteAttachmentLink: (item: TranslatedAttachmentFile) => Promise<undefined>
    deleteAttachmentFile: (item: TranslatedAttachmentLink) => Promise<undefined>
    editable?: boolean
    permissions?: boolean
  }>(),
  {
    fileResources: () => [],
    linkResources: () => [],
    editable: false,
    permissions: true,
  }
)

const emit = defineEmits<{
  'reload-file-resources': []
  'reload-link-resources': []
  edit: [TranslatedAttachmentFile | TranslatedAttachmentLink] | []
}>()

const { t } = useNuxtI18n()
const toaster = useToasterStore()
useScrollToTab()

const confirmModalVisible = ref(false)
const currentType = ref(null)
const currentResource = ref(null)
const confirmModalContent = ref(null)
const asyncing = ref(false)

const isEditionEnabled = computed(() => {
  return props.permissions && props.editable
})

const openModal = (resource, type) => {
  confirmModalVisible.value = true
  currentType.value = type
  currentResource.value = resource

  confirmModalContent.value =
    currentType.value === 'link'
      ? t('resources.link-confirm-delete')
      : t('resources.file-confirm-delete')
}

const deleteResource = async (resource, type) => {
  asyncing.value = true
  if (type === 'link') {
    try {
      await props.deleteAttachmentLink(resource.id)

      emit('reload-link-resources')

      toaster.pushSuccess(t('toasts.link-delete.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.link-delete.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      confirmModalVisible.value = false
    }
  } else if (type === 'file') {
    try {
      await props.deleteAttachmentFile(resource.id)

      emit('reload-file-resources')

      toaster.pushSuccess(t('toasts.file-delete.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.file-delete.error')} (${error})`)
      console.error(error)
    } finally {
      asyncing.value = false
      confirmModalVisible.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.actions-ctn {
  position: absolute;
  top: -20px;
  right: 15px;
  display: flex;

  button:last-of-type {
    margin-left: $space-s;
  }
}

.project-resources {
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
  .project-resources .resource-ctn {
    > div {
      width: calc(50% - $space-m);
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .project-resources .resource-ctn {
    > div {
      width: 100%;
    }
  }
}
</style>
