<template>
  <Drawer
    :class="{ fs: isFullScreen }"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!inSoloMode && !socketReady"
    :is-opened="isOpened"
    :title="$t('description.edit')"
    class="description-drawer"
    :asyncing="asyncing"
    @close="closeDrawer"
    @confirm="save"
  >
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
      @confirm="patchProject(true)"
    />
    <TipTapCollaborativeEditor
      ref="tiptapEditor"
      v-model="editorDescription"
      :room="room"
      save-icon-visible
      :provider-params="providerParams"
      :save-image-callback="saveDescriptionImage"
      class="no-max-height"
      mode="full"
      @unauthorized="$emit('close')"
      @saved="patchProject(false)"
      @socket-ready="socketReady = $event"
      @falled-back-to-solo-edit="inSoloMode = true"
    />
  </Drawer>
</template>

<script>
import Drawer from '@/components/base/BaseDrawer.vue'
import TipTapCollaborativeEditor from '@/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import { postProjectImage } from '@/api/projects.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import analytics from '@/analytics'
import retry from 'async-retry'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'DescriptionDrawer',

  components: { Drawer, TipTapCollaborativeEditor, ConfirmModal },

  inject: {
    notifyPatch: {
      from: 'projectLayoutProjectPatched',
      default: () => {
        console.warn('injection projectLayoutProjectPatched not found')
      },
    },
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    const projectsStore = useProjectsStore()
    const usersStore = useUsersStore()
    return {
      toaster,
      organizationsStore,
      projectsStore,
      usersStore,
    }
  },

  data() {
    return {
      isFullScreen: false,
      editorDescription: '',
      room: '',
      socketReady: false,
      confirmDestroyModalIsOpen: false,
      inSoloMode: false,
      showConfirmSaveInSoloMode: false,
      asyncing: false,
    }
  },

  computed: {
    descriptionIsNotEmpty() {
      return this.project.description !== '<p></p>' && this.project.description !== ''
    },

    projectSlug() {
      return this.projectsStore.currentProjectSlug
    },

    providerParams() {
      return {
        projectId: this.projectsStore.currentProjectId,
        organizationId: this.organizationsStore.current.id,
      }
    },
  },

  watch: {
    'project.description': function (neo, old) {
      if (neo != old) {
        this.editorDescription = neo
      }
    },
    isOpened: {
      handler: function (neo) {
        if (neo) {
          this.inSoloMode = false
          this.showConfirmSaveInSoloMode = false
          this.loadProject(this.project)
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.loadProject(this.project)
  },

  methods: {
    handleDestroyModalConfirmed() {
      this.confirmDestroyModalIsOpen = false
      this.$refs.tiptapEditor?.resetContent()
      this.$emit('close')
    },
    saveDescriptionImage(file) {
      const formData = new FormData()
      formData.append('file', file, file.name)
      return postProjectImage({
        project_id: this.project.id,
        body: formData,
      })
    },

    save() {
      if (this.inSoloMode) {
        this.showConfirmSaveInSoloMode = true
      } else {
        this.patchProject(true)
      }
    },

    async patchProject(closeWindowAfterPatch = true) {
      try {
        this.asyncing = true
        await retry(
          async () => {
            try {
              const res = await this.projectsStore.updateProject({
                id: this.project.id,
                project: {
                  description: this.editorDescription,
                },
              })

              this.toaster.pushSuccess(this.$t('toasts.description-update.success'))

              const connectedUser = this.usersStore.userFromApi

              this.notifyPatch({
                pid: this.usersStore.id,
                author_name: connectedUser
                  ? connectedUser.given_name + ' ' + connectedUser.family_name
                  : '',
                type: 'description-update',
                id: res.id,
                updated_at: res.updated_at,
                scope: 'project.updated.description',
              })

              return res
            } catch (e) {
              console.error(e)
              throw e
            }
          },
          {
            retries: 10,
          }
        )
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.description-update.error')} (${error})`)
        console.error(error)
      } finally {
        this.asyncing = false
      }

      analytics.project.updateDescription({ id: this.project.id })

      if (this.$route.name !== 'projectDescription') {
        this.$router.push({
          name: 'projectDescription',
          params: { slugOrId: this.projectSlug },
        })
      }

      if (closeWindowAfterPatch) this.$emit('close')
    },

    getProjectDescription(project) {
      if (this.descriptionIsNotEmpty) {
        return project.description
      } else if (project.template && project.template.project_description) {
        return project.template.project_description
      }
      return this.$t('description.default-project')
    },

    loadProject(project) {
      this.editorDescription = this.getProjectDescription(project)
      this.room = 'description_' + project.id
    },

    closeDrawer() {
      let customEditor = this.$refs.tiptapEditor

      // If the editor does not exist, we should be able to close the modal.
      if (!customEditor?.editor) {
        this.$emit('close')
      } else {
        const usersOnline = customEditor.editor?.storage?.collaborationCursor?.users?.length || 0

        if (usersOnline === 1 && this.project?.description !== this.editorDescription) {
          this.confirmDestroyModalIsOpen = true
        } else {
          this.$emit('close')
        }
      }
    },
  },
}
</script>

<!-- Do not scope -->
<style lang="scss">
.description-drawer .drawer-content {
  overflow-y: hidden !important;
}

.editor {
  flex-grow: 1;
  min-height: pxToRem(300px);
}
</style>
