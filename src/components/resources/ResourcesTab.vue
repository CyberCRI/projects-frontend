<template>
  <div class="project-resources">
    <div v-if="isEditionEnabled" class="add-resource">
      <LpiButton
        :label="$t('resource.add')"
        class="add-item-btn"
        btn-icon="Plus"
        data-test="in-page-add-resources"
        @click="$emit('edit')"
      />
    </div>

    <SectionHeader
      v-if="fileResources.length"
      :has-button="false"
      :quantity="fileResources.length"
      :title="$t('files', fileResources.length)"
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
        icon="File"
        @edit-clicked="$emit('edit', file)"
        @delete-clicked="openModal(file, 'file')"
      />
    </div>

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
        icon="LinkRotated"
        @edit-clicked="$emit('edit', link)"
        @delete-clicked="openModal(link, 'link')"
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

<script>
import SectionHeader from '@/components/base/SectionHeader.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ResourceCard from '@/components/resources/ResourceCard.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useToasterStore from '@/stores/useToaster.ts'

export default {
  name: 'ResourcesTab',

  components: {
    SectionHeader,
    ResourceCard,
    ConfirmModal,
    LpiButton,
  },

  props: {
    fileResources: {
      type: Array,
      default: () => [],
    },
    linkResources: {
      type: Array,
      default: () => [],
    },
    deleteAttachmentLink: {
      type: Function,
      required: true,
    },
    deleteAttachmentFile: {
      type: Function,
      required: true,
    },
    isInEditingMode: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['reload-file-resources', 'reload-link-resources', 'edit'],

  setup() {
    const toaster = useToasterStore()
    useScrollToTab()
    return {
      toaster,
    }
  },

  data() {
    return {
      confirmModalVisible: false,
      currentType: null,
      currentResource: null,
      confirmModalContent: null,
      asyncing: false,
    }
  },

  computed: {
    isEditionEnabled() {
      return this.permissions && this.isInEditingMode
    },
  },

  methods: {
    openModal(resource, type) {
      this.confirmModalVisible = true
      this.currentType = type
      this.currentResource = resource

      this.confirmModalContent =
        this.currentType === 'link'
          ? this.$t('resources.link-confirm-delete')
          : this.$t('resources.file-confirm-delete')
    },

    async deleteResource(resource, type) {
      this.asyncing = true
      if (type === 'link') {
        try {
          await this.deleteAttachmentLink(resource.id)

          this.$emit('reload-link-resources')

          this.toaster.pushSuccess(this.$t('toasts.link-delete.success'))
        } catch (error) {
          this.toaster.pushError(`${this.$t('toasts.link-delete.error')} (${error})`)
          console.error(error)
        } finally {
          this.asyncing = false
          this.confirmModalVisible = false
        }
      } else if (type === 'file') {
        try {
          await this.deleteAttachmentFile(resource.id)

          this.$emit('reload-file-resources')

          this.toaster.pushSuccess(this.$t('toasts.file-delete.success'))
        } catch (error) {
          this.toaster.pushError(`${this.$t('toasts.file-delete.error')} (${error})`)
          console.error(error)
        } finally {
          this.asyncing = false
          this.confirmModalVisible = false
        }
      }
    },
  },
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
