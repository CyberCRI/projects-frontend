<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$invalid || (!isAddMode && !socketReady)"
        :is-opened="isOpened"
        :title="$t('blog.entry')"
        class="blog-drawer"
        @close="checkClose"
        @confirm="submitBlogEntry"
        :asyncing="asyncing"
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

        <div class="editor-section">
            <TipTapEditor
                v-if="editorBlogEntry"
                :key="editorKey"
                ref="tiptapEditor"
                :socket="!isAddMode"
                :ws-data="editorBlogEntry"
                :provider-params="providerParams"
                class="input-field content-editor"
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
    </BaseDrawer>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import DatePicker from '@/components/base/form/DatePicker.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import permissions from '@/mixins/permissions.ts'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

export default {
    name: 'BlogDrawer',

    emits: ['close'],

    mixins: [permissions],

    components: {
        TextInput,
        TipTapEditor,
        DatePicker,
        BaseDrawer,
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
            asyncing: false,
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
                if (this.isAddMode) await this.createBlogEntry(closeWindowAfterOperation)
                else await this.updateBlogEntry(closeWindowAfterOperation)
            }
        },

        async createBlogEntry(closeWindowAfterCreate) {
            try {
                this.asyncing = true
                const res = await this.$store.dispatch('blogEntries/postBlogEntry', {
                    project_id: this.$store.getters['projects/project'].id,
                    title: this.title,
                    content: this.editorBlogEntry.savedContent,
                    images_ids: this.addedImages,
                    created_at: this.selectedDate,
                })

                const connectedUser = this.$store.getters['users/userFromApi']

                this.notifyPatch({
                    pid: this.$store.state.users.id,
                    author_name: connectedUser
                        ? connectedUser.given_name + ' ' + connectedUser.family_name
                        : '',
                    id: res.id,
                    type: 'blog-entry-create',
                    updated_at: res.updated_at,
                    scope: 'project.updated.blog-entry-create',
                })

                this.asyncing = false

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
            this.asyncing = true
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
                pid: this.$store.state.users.id,
                author_name: connectedUser
                    ? connectedUser.given_name + ' ' + connectedUser.family_name
                    : '',
                id: res.id,
                type: 'blog-entry-update',
                updated_at: res.updated_at,
                scope: 'project.updated.blog-entry',
            })

            this.asyncing = false

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
            if (this.asyncing) return
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
            if (this.asyncing) return
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

    :deep(.drawer__main) {
        gap: $space-unit;
    }

    .content-editor {
        flex-grow: 1;
        min-height: pxToRem(300px);
    }
}

.error-description {
    color: $red;
    font-size: $font-size-s;
    margin-left: $space-l;
}

.editor-section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
</style>
