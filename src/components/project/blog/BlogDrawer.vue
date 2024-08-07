<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="v$.$invalid || (!isAddMode && !inSoloMode && !socketReady)"
        :is-opened="isOpened"
        :title="$t('blog.entry')"
        class="blog-drawer"
        @close="checkClose"
        @confirm="save"
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
            @cancel="showConfirmSaveInSoloMode = false"
            @confirm="submitBlogEntry(true)"
            :confirm-button-label="$t('common.save')"
            :asyncing="asyncing"
        />
        <div>
            <TextInput
                v-model="title"
                :label="$filters.capitalize($t('common.title'))"
                :placeholder="$filters.capitalize(titlePlaceholder)"
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
                @update="updateContent"
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
                @update="updateContent"
                @socket-ready="socketReady = $event"
                @blur="v$.editorBlogEntry.$validate"
                @falled-back-to-solo-edit="inSoloMode = true"
            />

            <FieldErrors :errors="v$.editorBlogEntry.$errors" />
        </div>
        <DatePicker v-model="selectedDate" class="input-field" position="top" />
    </BaseDrawer>
</template>

<script>
import TipTapCollaborativeEditor from '@/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import DatePicker from '@/components/base/form/DatePicker.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import permissions from '@/mixins/permissions.ts'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { postBlogEntryImage } from '@/api/blogentries.service'

export default {
    name: 'BlogDrawer',

    emits: ['close'],

    mixins: [permissions],

    components: {
        TextInput,
        TipTapCollaborativeEditor,
        TipTapEditor,
        DatePicker,
        BaseDrawer,
        ConfirmModal,
        FieldErrors,
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
                    if (this.v$) this.v$.$reset()
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
            // TODO necessary ?
            formData.append('project_id', this.$store.getters['projects/currentProjectId'])

            return postBlogEntryImage({
                project_id: this.project.id,
                body: formData,
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
                const res = await this.$store.dispatch('blogEntries/postBlogEntry', {
                    project_id: this.$store.getters['projects/project'].id,
                    title: this.title,
                    content: this.editorBlogEntry,
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
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-create.success')}`,
                    type: 'success',
                })

                if (closeWindowAfterCreate) this.closeDrawer()

                if (this.$route.name !== 'projectBlog')
                    this.$router.push({
                        name: 'projectBlog',
                        params: { slugOrId: this.project.slug },
                    })
            } catch (error) {
                console.error(error)
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-create.error')}`,
                    type: 'error',
                })
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

                const res = await this.$store.dispatch('blogEntries/patchBlogEntry', body)

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
                }
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-update.success')}`,
                    type: 'success',
                })
            } catch (error) {
                console.log(error)
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.blog-update.error')}`,
                    type: 'error',
                })
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
            this.v$.$reset()
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
}
</style>
