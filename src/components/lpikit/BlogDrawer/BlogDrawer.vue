<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$invalid || (!isAddMode && !socketReady)"
        :is-opened="isOpened"
        :title="$t('blog.entry')"
        class="blog-drawer"
        @close="checkClose"
        @confirm="submitBlogEntry"
    >
        <ConfirmModal
            v-if="confirmModalIsOpen"
            content=""
            :title="$t('description.quit-without-saving-title')"
            confirm-button-label="common.continue"
            @cancel="confirmModalIsOpen = false"
            @confirm="closeDrawer"
        />
        <div>
            <TextInput
                v-model="title"
                :label="$filters.capitalize($t('common.title'))"
                :placeholder="$filters.capitalize(titlePlaceholder)"
                class="input-field"
                @blur="v$.title.$validate"
            />
            <p v-for="error of v$.title.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
        </div>

        <div>
            <TipTapEditor
                v-if="editorBlogEntry"
                :key="editorKey"
                ref="tiptapEditor"
                :socket="!isAddMode"
                :ws-data="editorBlogEntry"
                :provider-params="providerParams"
                class="input-field content-editor no-max-height"
                mode="full"
                parent="blog-entry"
                @destroy="closeDrawer"
                @image="handleImage"
                @saved="submitBlogEntry(false)"
                @update="updateContent"
                @socket-ready="socketReady = $event"
                @blur="v$.editorBlogEntry.savedContent.$validate"
            />

            <p
                v-for="error of v$.editorBlogEntry.savedContent.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>
        <DatePicker v-model="selectedDate" class="input-field" position="top" />
    </DrawerLayout>
</template>

<script>
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import DatePicker from '@/components/lpikit/DatePicker/DatePicker.vue'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import permissions from '@/mixins/permissions.ts'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'BlogDrawer',

    emits: ['close'],

    mixins: [permissions],

    components: {
        TextInput,
        TipTapEditor,
        DatePicker,
        DrawerLayout,
        ConfirmModal,
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

    data() {
        return {
            v$: useVuelidate(),
            editorBlogEntry: {
                room: null,
                savedContent: '',
                originalContent: '',
            },
            selectedDate: new Date(),
            title: null,
            addedImages: [],
            editorKey: 0,
            socketReady: false,
            confirmModalIsOpen: false,
        }
    },

    validations() {
        return {
            title: {
                required: helpers.withMessage(this.$t('form.blog.title'), required),
            },
            editorBlogEntry: {
                savedContent: {
                    required: helpers.withMessage(this.$t('form.blog.description'), required),
                    //$autoDirty: true,
                },
            },
        }
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
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
                projectId: this.$store.getters['projects/currentProjectId'],
                organizationId: this.$store.getters['organizations/current'].id,
            }
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                if (!this.isAddMode) {
                    this.selectedDate = this.editedBlog.created_at
                    this.title = this.editedBlog.title
                    this.editorBlogEntry = {
                        room: `blog_${this.editedBlog.id}`,
                        savedContent: this.editedBlog.content,
                        originalContent: this.editedBlog.content,
                    }
                } else {
                    this.editorBlogEntry.originalContent =
                        this.project &&
                        this.project.template &&
                        this.project.template.blogentry_placeholder
                            ? this.project.template.blogentry_placeholder
                            : ''

                    this.editorBlogEntry.room = null
                    this.editorBlogEntry.savedContent = this.editorBlogEntry.originalContent
                    this.selectedDate = new Date()
                    this.title = null
                    this.addedImages = []
                }
                this.$nextTick(() => {
                    this.forceRerender()
                    if (this.v$) this.v$.$reset()
                })
            },
            immediate: true,
        },
    },

    methods: {
        async submitBlogEntry(closeWindowAfterOperation = true) {
            const isValid = await this.v$.$validate()
            if (isValid) {
                if (this.isAddMode) this.createBlogEntry(closeWindowAfterOperation)
                else this.updateBlogEntry(closeWindowAfterOperation)
            }
        },

        async createBlogEntry(closeWindowAfterCreate) {
            try {
                const res = await this.$store.dispatch('blogEntries/postBlogEntry', {
                    project_id: this.$store.getters['projects/project'].id,
                    title: this.title,
                    content: this.editorBlogEntry.savedContent,
                    images_ids: this.addedImages,
                    created_at: this.selectedDate,
                })

                const connectedUser = this.$store.getters['users/userFromApi']

                this.notifyPatch({
                    pid: this.$store.state.users.keycloak_id,
                    author_name: connectedUser
                        ? connectedUser.given_name + ' ' + connectedUser.family_name
                        : '',
                    id: res.id,
                    type: 'blog-entry-create',
                    updated_at: res.updated_at,
                    scope: 'project.updated.blog-entry-create',
                })

                if (closeWindowAfterCreate) this.closeDrawer()

                if (this.$route.name !== 'projectBlog')
                    this.$router.push({
                        name: 'projectBlog',
                        params: { slugOrId: this.project.slug },
                    })
            } catch (error) {
                // Notification is handled in the axios config.
                console.error(error)
            }
        },

        async updateBlogEntry(closeWindowAfterPatch) {
            const body = {
                id: this.editedBlog.id,
                title: this.title,
                content: this.editorBlogEntry.savedContent,
                created_at: new Date(this.selectedDate),
                images_ids: [...this.editedBlog.images, ...this.addedImages],
            }

            const res = await this.$store.dispatch('blogEntries/patchBlogEntry', body)

            this.editorBlogEntry.originalContent = this.editorBlogEntry.savedContent

            const connectedUser = this.$store.getters['users/userFromApi']
            this.notifyPatch({
                pid: this.$store.state.users.keycloak_id,
                author_name: connectedUser
                    ? connectedUser.given_name + ' ' + connectedUser.family_name
                    : '',
                id: res.id,
                type: 'blog-entry-update',
                updated_at: res.updated_at,
                scope: 'project.updated.blog-entry',
            })

            if (closeWindowAfterPatch) {
                this.closeDrawer()
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-update.success')}`,
                    type: 'success',
                })
            } else {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-update.success')}`,
                    type: 'success',
                })
            }
        },

        checkClose() {
            const customEditor = this.$refs.tiptapEditor

            if (!this.isAddMode) {
                const usersOnline = customEditor.editor
                    ? customEditor.editor.storage.collaborationCursor.users.length
                    : 0

                if (
                    usersOnline === 1 &&
                    this.editorBlogEntry.originalContent !== this.editorBlogEntry.savedContent
                ) {
                    customEditor.openDestroyModal()
                } else if (this.title !== this.editedBlog.title) {
                    this.confirmModalIsOpen = true
                } else {
                    this.closeDrawer()
                }
            } else {
                if (
                    this.editorBlogEntry.originalContent !== this.editorBlogEntry.savedContent ||
                    this.title
                ) {
                    this.confirmModalIsOpen = true
                } else {
                    this.closeDrawer()
                }
            }
        },

        closeDrawer() {
            this.confirmModalIsOpen = false
            this.v$.$reset()
            this.$emit('close')
            this.forceRerender()
        },

        updateContent(htmlContent) {
            this.editorBlogEntry.savedContent = htmlContent

            if (htmlContent === '<p></p>') this.editorBlogEntry.savedContent = null
        },

        handleImage(img) {
            this.addedImages.push(img.id)
        },

        forceRerender() {
            this.editorKey += 1
        },
    },
}
</script>

<style lang="scss" scoped>
.blog-drawer {
    height: 100%;

    .input-field {
        margin: $space-l;
        margin-bottom: $space-xs;
    }

    .content-editor {
        flex-grow: 1;
        min-height: pxToRem(300px);
    }
}

.error-description {
    color: $salmon-dark;
    font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
    font-size: $font-size-s;
    margin-left: $space-l;
}
</style>
