<template>
  <div class="project-form">
    <BaseDrawer
      :confirm-action-disabled="v$.$invalid || hasFileError"
      :confirm-action-name="$t('common.save')"
      :is-opened="isOpened"
      :title="label"
      class="resource-modal small"
      :asyncing="isSaving"
      @close="close()"
      @confirm="addEditResource"
    >
      <!-- ADD / EDIT LINK / FILE -->
      <div>
        <template v-if="isAddMode">
          <div class="file-input-ctn">
            <ImageInput
              id="add-file-input"
              :label="$t('file.upload' + ' *')"
              class="text-input"
              @upload-image="uploadImage"
            />
            <p>{{ $t('resource.max-size') }}</p>
          </div>
          <p v-if="hasFileError" class="error error-file">
            {{ $t('common.file-required') }}
          </p>
        </template>

        <TextInput
          v-model="title"
          :label="$t('common.title' + ' *')"
          :placeholder="$t('common.title')"
          class="text-input"
          data-test="input-link-title"
          @focus="checkFile"
          @blur="v$.title.$touch"
        />
        <FieldErrors :errors="v$.title.$errors" />

        <TextInput
          v-model="description"
          :label="$t('form.description' + ' *')"
          :placeholder="$t('form.description')"
          class="text-input"
          data-test="input-link-description"
          @focus="checkFile"
          @blur="v$.description.$touch"
        />
        <FieldErrors :errors="v$.description.$errors" />
      </div>
    </BaseDrawer>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
// import analytics from '@/analytics'
import { postOrganizationFiles, patchOrganizationFile } from '@/api/organization-files.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations'
export default {
  name: 'OrganizationResourceDrawer',

  props: {
    isAddMode: {
      type: Boolean,
      default: true,
    },

    selectedItem: {
      type: Object,
      default: null,
    },

    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'reload-file-resources'],
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      v$: useVuelidate(),
      file: null,
      description: null,
      title: null,
      isSaving: false,
      hasFileError: false,
    }
  },

  validations() {
    return {
      title: {
        required: helpers.withMessage(this.$t('form.resources.title'), required),
      },
      description: {
        required: helpers.withMessage(this.$t('form.resources.description'), required),
      },
    }
  },

  computed: {
    label() {
      return this.isAddMode ? this.$t('resource.add-file') : this.$t('resource.edit-file')
    },
    orgCode() {
      return this.organizationsStore?.current?.code
    },
  },

  watch: {
    isOpened: {
      handler: function () {
        this.hasFileError = false
        if (this.selectedItem) {
          this.description = this.selectedItem.description
          this.title = this.selectedItem.title
        } else {
          this.selectedType = null
          this.file = null
          this.description = null
          this.title = null
        }
      },
      immediate: true,
    },
  },

  methods: {
    checkFile() {
      if (this.isAddMode) {
        this.hasFileError = !this.file
      }
    },

    async addEditResource() {
      const isValid = await this.v$.$validate()
      if (isValid) {
        if (this.isAddMode) this.addResource()
        else this.editResource()
      }
    },

    addResource() {
      this.addFile()
    },

    editResource() {
      this.editFile()
    },

    async addFile() {
      this.isSaving = true
      try {
        const body = {
          file: this.file,
          title: this.title,
          description: this.description,
          project_id: this.projectId,
        }

        /* const result = */ await postOrganizationFiles(this.orgCode, body)

        // TODO: use org event
        // analytics.attachmentFile.addAttachment({
        //   project: {
        //     id: this.projectId,
        //   },
        //   attachment: result,
        // })

        this.$emit('reload-file-resources')

        this.toaster.pushSuccess(this.$t('toasts.file-create.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.file-create.error')} (${error})`)
        console.error(error)
      } finally {
        this.isSaving = false
        this.close()
      }
    },

    async editFile() {
      this.isSaving = true
      const body = {
        ...this.selectedItem,
        title: this.title,
        description: this.description,
        project_id: this.projectId,
        id: this.selectedItem.id,
      }

      try {
        /* const result = */ await patchOrganizationFile(this.orgCode, body)

        // TODO: use org event
        // analytics.attachmentFile.updateAttachment({
        //   project: {
        //     id: this.projectId,
        //   },
        //   attachment: result,
        // })

        this.$emit('reload-file-resources')
        this.toaster.pushSuccess(this.$t('toasts.file-update.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.file-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.isSaving = false
        this.close()
      }
    },

    uploadImage(file) {
      this.file = file
      this.title = file.name
      this.hasFileError = false
    },

    close() {
      this.v$.$reset()
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.resource-modal {
  padding: $space-l;

  .text-input {
    padding: 0;
    padding-bottom: $space-xs;
  }

  .select-resource {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;

    .button-select {
      margin: $space-l;
    }
  }
}

.file-input-ctn {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

:deep(.input-ctn) {
  box-sizing: border-box;
}
</style>

<style lang="scss">
// To remove scroll bar on dialogue modal, not needed in this case.
.resource-modal .s-modal-content {
  overflow: hidden !important;
}
</style>
