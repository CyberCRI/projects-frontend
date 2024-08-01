<template>
    <Drawer
        :class="{ fs: isFullScreen }"
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="!socketReady"
        :is-opened="isOpened"
        :title="$t('description.edit')"
        class="description-drawer"
        @close="closeDrawer"
        @confirm="patchProject(true)"
    >
        <ConfirmModal
            v-if="confirmDestroyModalIsOpen"
            :content="$t('description.delete') + ' ' + $t('description.edit-saved')"
            :title="$t('description.quit-without-saving-title')"
            @cancel="confirmDestroyModalIsOpen = false"
            @confirm="handleDestroyModalConfirmed"
        />
        <TipTapCollaborativeEditor
            :key="editorKey"
            ref="tiptapEditor"
            v-model="editorDescription"
            :room="room"
            save-icon-visible
            :provider-params="providerParams"
            :save-image-callback="saveDescriptionImage"
            class="no-max-height"
            mode="full"
            @destroy="$emit('close')"
            @saved="patchProject(false)"
            @socket-ready="socketReady = $event"
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

export default {
    name: 'DescriptionDrawer',

    components: { Drawer, TipTapCollaborativeEditor, ConfirmModal },

    emits: ['close'],

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

    inject: {
        notifyPatch: {
            from: 'projectLayoutProjectPatched',
            default: () => {
                console.warn('injection projectLayoutProjectPatched not found')
            },
        },
    },

    data() {
        return {
            editorKey: 0,
            isFullScreen: false,
            editorDescription: '',
            room: '',
            socketReady: false,
            confirmDestroyModalIsOpen: false,
        }
    },

    mounted() {
        this.loadProject(this.project)
    },

    computed: {
        emptyDescription() {
            return this.project.description !== '<p></p>' && this.project.description !== ''
        },

        projectSlug() {
            return this.$store.getters['projects/currentProjectSlug']
        },

        providerParams() {
            return {
                projectId: this.$store.getters['projects/currentProjectId'],
                organizationId: this.$store.getters['organizations/current'].id,
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
                    this.loadProject(this.project)
                }
            },
            immediate: true,
        },
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
            // TODO still needed ?
            formData.append('project_id', this.project.id)
            return postProjectImage({
                project_id: this.project.id,
                body: formData,
            })
        },

        async patchProject(closeWindowAfterPatch = true) {
            try {
                await retry(
                    async () => {
                        try {
                            const res = await this.$store.dispatch('projects/updateProject', {
                                id: this.project.id,
                                project: {
                                    description: this.editorDescription,
                                },
                            })

                            await this.$store.dispatch(
                                'projects/updateCurrentProjectDescription',
                                this.editorDescription
                            )

                            this.$store.dispatch('notifications/pushToast', {
                                message: this.$t('toasts.description-update.success'),
                                type: 'success',
                            })

                            const connectedUser = this.$store.getters['users/userFromApi']

                            this.notifyPatch({
                                pid: this.$store.state.users.id,
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
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.description-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.forceRerender()
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
            if (this.emptyDescription) {
                return project.description
            } else if (project.template && project.template.description_placeholder) {
                return project.template.description_placeholder
            }
            return this.$t('description.default-placeholder')
        },

        loadProject(project) {
            this.editorDescription = this.getProjectDescription(project)
            this.room = 'description_' + project.id

            this.$nextTick(() => {
                this.forceRerender()
            })
        },

        closeDrawer() {
            let customEditor = this.$refs.tiptapEditor

            // If the editor does not exist, we should be able to close the modal.
            if (!customEditor.editor) this.$emit('close')

            const usersOnline = customEditor.editor.storage.collaborationCursor.users.length

            if (usersOnline === 1 && this.project?.description !== this.editorDescription) {
                this.confirmDestroyModalIsOpen = true
            } else {
                this.$emit('close')
            }
        },

        forceRerender() {
            this.editorKey += 1
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
