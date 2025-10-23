<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="v$.$invalid || (!isAddMode && !inSoloMode && !socketReady)"
    :is-opened="isOpened"
    :title="$t('blog.entry')"
    class="blog-drawer"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="save"
  >
    <ConfirmModal
      v-if="confirmModalIsOpen"
      content=""
      :title="$t('description.quit-without-saving-title')"
      @cancel="confirmModalIsOpen = false"
      @confirm="closeDrawer"
    />

    <ConfirmModal
      v-if="confirmDestroyModalIsOpen"
      :content="$t('description.delete') + ' ' + $t('description.edit-saved')"
      :title="$t('description.quit-without-saving-title')"
      @cancel="confirmDestroyModalIsOpen = false"
      @confirm="handleDestroyModalConfirmed"
    />

    <ConfirmModal
      v-if="showConfirmSaveInSoloMode"
      :title="$t(`multieditor.server-unconnectable.confirm-save-title`)"
      :content="$t(`multieditor.server-unconnectable.confirm-save-text`)"
      :confirm-button-label="$t('common.save')"
      :cancel-button-label="$t('common.cancel')"
      :asyncing="asyncing"
      @cancel="showConfirmSaveInSoloMode = false"
      @confirm="submitBlogEntry(true)"
    />
    <div>
      <TextInput
        v-model="title"
        :label="capitalize($t('common.title'))"
        :placeholder="capitalize(titlePlaceholder)"
        class="input-field"
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
    </div>

    <div class="editor-section">
      <TipTapEditor
        v-if="isAddMode"
        ref="tiptapEditor"
        v-model="editorBlogEntry"
        class="input-field content-editor"
        mode="full"
        :save-image-callback="saveBlogImage"
        @image="handleImage"
        @saved="submitBlogEntry(false)"
        @blur="v$.editorBlogEntry.$validate"
      />
      <TipTapCollaborativeEditor
        v-else
        ref="tiptapEditor"
        v-model="editorBlogEntry"
        :room="room"
        :provider-params="providerParams"
        class="input-field content-editor"
        mode="full"
        save-icon-visible
        :save-image-callback="saveBlogImage"
        @unauthorized="closeDrawer"
        @image="handleImage"
        @saved="submitBlogEntry(false)"
        @socket-ready="socketReady = $event"
        @blur="v$.editorBlogEntry.$validate"
        @falled-back-to-solo-edit="inSoloMode = true"
      />

      <FieldErrors :errors="v$.editorBlogEntry.$errors" />
    </div>
    <VueDatePicker v-model="selectedDate" class="input-field" position="top" />
  </BaseDrawer>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'

import { capitalize } from '@/functs/string'

import TipTapCollaborativeEditor from '@/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { postBlogEntryImage } from '@/api/blogentries.service'
import { postBlogEntry, patchBlogEntry } from '@/api/blogentries.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'BlogDrawer',

  components: {
    TextInput,
    TipTapCollaborativeEditor,
    TipTapEditor,
    BaseDrawer,
    ConfirmModal,
    FieldErrors,
    VueDatePicker,
  },

  inject: {
    notifyPatch: {
      from: 'projectLayoutProjectPatched',
      default: () => {
        console.warn('injection projectLayoutProjectPatched not found')
      },
    },
  },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },

    isAddMode: {
      type: Boolean,
      default: true,
    },

    editedBlog: {
      type: Object,
      default: null,
    },
  },

  emits: ['close', 'reload-blog-entries'],

  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    const projectsStore = useProjectsStore()
    const usersStore = useUsersStore()
    const v$ = useVuelidate()
    return {
      toaster,
      organizationsStore,
      projectsStore,
      usersStore,
      v$,
      capitalize,
    }
  },

  data() {
    return {
      editorBlogEntry: '',
      room: null,
      selectedDate: new Date(),
      title: null,
      addedImages: [],
      socketReady: false,
      confirmModalIsOpen: false,
      confirmDestroyModalIsOpen: false,
      asyncing: false,
      inSoloMode: false,
      showConfirmSaveInSoloMode: false,
    }
  },

  validations() {
    return {
      title: {
        required: helpers.withMessage(this.$t('form.blog.title'), required),
      },
      editorBlogEntry: {
        required: helpers.withMessage(this.$t('form.blog.description'), required),
        //$autoDirty: true,
      },
    }
  },

  computed: {
    project() {
      return this.projectsStore.project
    },

    titlePlaceholder() {
      if (
        this.project &&
        this.project.template &&
        this.project.template.blogentry_title_placeholder
      )
        return this.project.template.blogentry_title_placeholder
      return this.$t('common.title')
    },

    providerParams() {
      return {
        blogId: this.editedBlog ? this.editedBlog.id : null,
        projectId: this.projectsStore.currentProjectId,
        organizationId: this.organizationsStore.current.id,
      }
    },
  },

  watch: {
    isOpened: {
      handler: function () {
        this.inSoloMode = false
        this.showConfirmSaveInSoloMode = false
        if (!this.isAddMode) {
          this.selectedDate = this.editedBlog.created_at
          this.title = this.editedBlog.title
          this.editorBlogEntry = this.editedBlog.content
          this.room = `blog_${this.editedBlog.id}`
        } else {
          this.editorBlogEntry = this.getNewBlogIniatialContent()

          this.room = null
          this.selectedDate = new Date()
          this.title = null
          this.addedImages = []
        }
        this.$nextTick(() => {
          if (import.meta.client && this.v$) this.v$.$reset()
        })
      },
      immediate: true,
    },
  },

  methods: {
    getNewBlogIniatialContent() {
      return this.project?.template?.blogentry_placeholder || '<p></p>'
    },

    handleDestroyModalConfirmed() {
      this.confirmDestroyModalIsOpen = false
      this.$refs.tiptapEditor?.resetContent()
      this.$emit('close')
    },
    saveBlogImage(file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      return postBlogEntryImage({
        project_id: this.project.id,
        body: formData,
        blog_entry_id: this.editedBlog?.id || null,
      })
    },

    save() {
      if (this.inSoloMode) {
        this.showConfirmSaveInSoloMode = true
      } else {
        this.submitBlogEntry()
      }
    },

    async submitBlogEntry(closeWindowAfterOperation = true) {
      const isValid = await this.v$.$validate()
      if (isValid) {
        if (this.isAddMode) await this.createBlogEntry(closeWindowAfterOperation)
        else await this.updateBlogEntry(closeWindowAfterOperation)
      }
    },

    async createBlogEntry(closeWindowAfterCreate) {
      try {
        this.asyncing = true

        const body = {
          project_id: this.project.id,
          title: this.title,
          content: this.editorBlogEntry,
          images_ids: this.addedImages,
          created_at: this.selectedDate,
        }

        const result = await postBlogEntry(body)

        analytics.blog.addBlog({
          project: {
            id: this.project.id,
          },
          blogEntry: result,
        })

        const connectedUser = this.usersStore.userFromApi

        this.notifyPatch({
          pid: this.usersStore.id,
          author_name: connectedUser
            ? connectedUser.given_name + ' ' + connectedUser.family_name
            : '',
          id: result.id,
          type: 'blog-entry-create',
          updated_at: result.updated_at,
          scope: 'project.updated.blog-entry-create',
        })

        this.$emit('reload-blog-entries')

        this.asyncing = false
        this.toaster.pushSuccess(this.$t('toasts.blog-create.success'))

        if (closeWindowAfterCreate) this.closeDrawer()

        if (this.$route.name !== 'projectBlog')
          this.$router.push({
            name: 'projectBlog',
            params: { slugOrId: this.project.slug },
          })
      } catch (error) {
        console.error(error)
        this.toaster.pushError(this.$t('toasts.blog-create.error'))
      } finally {
        this.asyncing = false
      }
    },

    async updateBlogEntry(closeWindowAfterPatch) {
      try {
        this.asyncing = true
        const body = {
          id: this.editedBlog.id,
          title: this.title,
          content: this.editorBlogEntry,
          created_at: new Date(this.selectedDate),
          images_ids: [...this.editedBlog.images, ...this.addedImages],
        }

        const result = await patchBlogEntry({
          project_id: this.project.id,
          body: body,
        })

        analytics.blog.updateBlog({
          project: {
            id: this.project.id,
          },
          blogEntry: result,
        })

        const connectedUser = this.usersStore.userFromApi
        this.notifyPatch({
          pid: this.usersStore.id,
          author_name: connectedUser
            ? connectedUser.given_name + ' ' + connectedUser.family_name
            : '',
          id: result.id,
          type: 'blog-entry-update',
          updated_at: result.updated_at,
          scope: 'project.updated.blog-entry',
        })

        this.asyncing = false

        this.$emit('reload-blog-entries')

        if (closeWindowAfterPatch) {
          this.closeDrawer()
        }
        this.toaster.pushSuccess(`${this.$t('toasts.blog-update.success')}`)
      } catch (error) {
        console.log(error)
        this.toaster.pushError(`${this.$t('toasts.blog-update.error')}`)
      } finally {
        this.asyncing = false
      }
    },

    checkClose() {
      if (this.asyncing) return
      const customEditor = this.$refs.tiptapEditor
      if (!this.isAddMode) {
        const usersOnline = customEditor?.editor
          ? customEditor.editor.storage.collaborationCursor.users.length
          : 0

        if (usersOnline === 1 && this.editedBlog.content !== this.editorBlogEntry) {
          this.confirmDestroyModalIsOpen = true
        } else if (this.title !== this.editedBlog.title) {
          this.confirmModalIsOpen = true
        } else {
          this.closeDrawer()
        }
      } else {
        if (this.editorBlogEntry !== this.getNewBlogIniatialContent || this.title) {
          this.confirmModalIsOpen = true
        } else {
          this.closeDrawer()
        }
      }
    },

    closeDrawer() {
      if (this.asyncing) return
      this.confirmModalIsOpen = false
      if (import.meta.client) this.v$.$reset()
      this.$emit('close')
    },

    handleImage(img) {
      this.addedImages.push(img.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.blog-drawer {
  height: 100%;

  :deep(.drawer__main) {
    gap: $space-unit;
  }

  .content-editor {
    flex-grow: 1;
    min-height: pxToRem(300px);
  }
}

.editor-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
