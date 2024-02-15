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
        <TipTapEditor
            v-if="editorDescription"
            :key="editorKey"
            ref="tipTapEditor"
            :socket="true"
            :ws-data="editorDescription"
            :provider-params="providerParams"
            class="no-max-height"
            mode="full"
            @destroy="$emit('close')"
            @saved="patchProject(false)"
            @update="updateContent"
            @socket-ready="socketReady = $event"
        />
    </Drawer>
</template>

<script>
import Drawer from '@/components/lpikit/Drawer/DrawerLayout.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'

import analytics from '@/analytics'
import retry from 'async-retry'

export default {
    name: 'DescriptionDrawer',

    components: { Drawer, TipTapEditor },

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
            editorDescription: {
                originalContent: '',
                savedContent: '',
                room: '',
            },
            socketReady: false,
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
                this.editorDescription.originalContent = neo
            }
        },
    },

    methods: {
        async patchProject(closeWindowAfterPatch = true) {
            if (this.editorDescription) {
                try {
                    await retry(
                        async () => {
                            try {
                                const res = await this.$store.dispatch('projects/updateProject', {
                                    id: this.project.id,
                                    project: {
                                        description: this.editorDescription.savedContent,
                                    },
                                })

                                await this.$store.dispatch(
                                    'projects/updateCurrentProjectDescription',
                                    this.editorDescription.savedContent
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

                this.editorDescription.originalContent = this.editorDescription.savedContent

                analytics.project.updateDescription({ id: this.project.id })

                if (this.$route.name !== 'projectDescription') {
                    this.$router.push({
                        name: 'projectDescription',
                        params: { slugOrId: this.projectSlug },
                    })
                }
            }

            if (closeWindowAfterPatch) this.$emit('close')
        },

        updateContent(htmlContent) {
            this.editorDescription.savedContent = htmlContent
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
            const data = {
                id: project.id,
                description: project.description,
            }

            data.description = this.getProjectDescription(project)
            this.editorDescription = {
                room: 'description_' + data.id,
                originalContent: data.description,
                savedContent: data.description,
            }

            this.$nextTick(() => {
                this.forceRerender()
            })
        },

        closeDrawer() {
            let customEditor = this.$refs.tipTapEditor

            // If the editor does not exist, we should be able to close the modal.
            if (!customEditor.editor) this.$emit('close')

            const usersOnline = customEditor.editor.storage.collaborationCursor.users.length

            if (
                usersOnline === 1 &&
                this.editorDescription.originalContent !== this.editorDescription.savedContent
            ) {
                customEditor.openDestroyModal()
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
