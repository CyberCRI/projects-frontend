<template>
    <div class="make-comment">
        <ConfirmModal
            v-if="confirmModalIsOpen"
            content=""
            :title="originalComment ? $t('comment.discard-changes') : $t('comment.discard-comment')"
            confirm-button-label="common.continue"
            @cancel="confirmModalIsOpen = false"
            @confirm="cancel"
        />

        <div v-if="isLoggedIn">
            <TipTapEditor
                :key="editorKey"
                v-model="comment"
                :save-image-callback="saveCommentImage"
                class="comment-description"
                mode="full"
                @image="handleImage"
            />

            <div class="action">
                <LpiButton :label="$t('common.cancel')" :secondary="true" @click="checkCancel" />
                <LpiButton
                    :disabled="!canSubmitComment || asyncing"
                    :btn-icon="asyncing ? 'LoaderSimple' : null"
                    :label="isPrivate ? $t('comment.private-exchange.send') : $t('comment.publish')"
                    @click="submit"
                />
            </div>
        </div>
        <div v-else class="no-account">
            <div>{{ $t('comment.need-account') }}</div>
            <div>
                <LpiButton :label="$t('common.login')" @click="login" />
            </div>
        </div>
    </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// import utils from '@/functs/functions.ts'
import permissions from '@/mixins/permissions.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import analytics from '@/analytics'
import { patchComment, postComment, postCommentImage } from '@/api/comments.service'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'

import {
    patchProjectMessage,
    postProjectMessage,
    postProjectMessageImage,
} from '@/api/project-messages.service'

export default {
    name: 'MakeComment',

    emits: [
        'submited',
        'canceled',
        'comment-posted',
        'project-message-posted',
        'comment-edited',
        'project-message-edited',
    ],

    mixins: [permissions],

    components: { LpiButton, TipTapEditor, ConfirmModal },
    setup() {
        const toaster = useToasterStore()
        const usersStore = useUsersStore()
        return {
            toaster,
            usersStore,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        repliedComment: {
            type: Object,
            default: null,
        },

        originalComment: {
            type: Object,
            default: null,
        },

        isPrivate: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            comment: this.originalComment ? this.originalComment.content : '<p></p>',
            addedImages: [],
            asyncing: false,
            confirmModalIsOpen: false,
            editorKey: 0,
        }
    },

    computed: {
        isLoggedIn() {
            return this.usersStore.isLoggedIn
        },

        canSubmitComment() {
            return this.isEdited && this.canCreateComments
        },
        isEdited() {
            return this.originalComment
                ? this.originalComment.content != this.comment
                : this.comment !== '<p></p>'
            // TODO WTF was this here for?
            // utils.editorCanEdit(this.comment, 'add')
        },
    },

    methods: {
        saveCommentImage(file) {
            const formData = new FormData()
            formData.append('file', file, file.name)
            // TODO still needed ?
            formData.append('project_id', this.project.id)
            if (this.isPrivate) {
                return postProjectMessageImage(this.project.id, formData)
            } else {
                return postCommentImage(this.project.id, formData)
            }
        },

        reset() {
            this.confirmModalIsOpen = false
            // reset comment
            this.comment = '<p></p>'
        },

        async submit() {
            if (this.originalComment) await this.updateComment()
            else {
                await this.createComment()
                this.reset()
            }
            this.editorKey++
            this.$emit('submited')
        },

        cancel() {
            this.reset()
            this.$emit('canceled')
        },

        checkCancel() {
            if (this.isEdited) this.confirmModalIsOpen = true
            else this.cancel()
        },

        async createComment() {
            this.asyncing = true
            const payload = {
                content: this.comment,
                project_id: this.project.id,
                images_ids: this.addedImages,
            }

            if (this.isPrivate) {
                if (this.repliedComment) payload.reply_on = this.repliedComment.id // // reply_on_id in comment
                try {
                    const result = await postProjectMessage(payload)
                    analytics.projectMessage.projectMessage({
                        project: {
                            id: this.project.id,
                        },
                        projectMessage: result,
                    })
                    this.toaster.pushSuccess(
                        this.$t('toasts.project-message-create.success') /* TODO */
                    )
                    this.$emit('project-message-posted', result)
                    this.$nextTick(() => {
                        if (!this.repliedComment) this.scrollToNewComment(result)
                    })
                } catch (error) {
                    this.toaster.pushError(
                        `${this.$t('toasts.project-message-create.error')} (${error})` /* TODO */
                    )
                } finally {
                    this.asyncing = false
                }
            } else {
                if (this.repliedComment) payload.reply_on_id = this.repliedComment.id
                try {
                    const result = await postComment(payload)
                    analytics.comment.comment({
                        project: {
                            id: this.project.id,
                        },
                        comment: result,
                    })
                    this.toaster.pushSuccess(this.$t('toasts.comment-create.success'))

                    this.$emit('comment-posted', result)
                    this.$nextTick(() => {
                        if (!this.repliedComment) this.scrollToNewComment(result)
                    })
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.comment-create.error')} (${error})`)
                } finally {
                    this.asyncing = false
                }
            }
        },

        async updateComment() {
            if (this.isPrivate) {
                const projectMessage = {
                    id: this.originalComment.id,
                    content: this.comment,
                    project_id: this.project.id,
                    images_ids: this.addedImages,
                }

                try {
                    const result = await patchProjectMessage(projectMessage.id, projectMessage)
                    analytics.projectMessage.updateProjectMessage({
                        project: {
                            id: this.project.id,
                        },
                        projectMessage: result,
                    })
                    this.toaster.pushSuccess(
                        this.$t('toasts.project-message-update.success') /* TODO */
                    )
                    this.$emit('project-message-edited', projectMessage)
                } catch (error) {
                    this.toaster.pushError(
                        `${this.$t('toasts.project-message-update.error')} (${error})`
                    )
                    console.error(error)
                }
            } else {
                const comment = {
                    id: this.originalComment.id,
                    content: this.comment,
                    project_id: this.project.id,
                    images_ids: this.addedImages,
                }

                try {
                    const result = await patchComment(comment.id, comment)
                    analytics.comment.updateComment({
                        project: {
                            id: this.project.id,
                        },
                        comment: result,
                    })
                    this.toaster.pushSuccess(this.$t('toasts.comment-update.success'))

                    this.$emit('comment-edited', comment)
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.comment-update.error')} (${error})`)
                    console.error(error)
                }
            }
        },

        scrollToNewComment(comment) {
            document.getElementById(comment.id)?.scrollIntoView({
                behavior: 'smooth',
            })
        },

        handleImage(image) {
            this.addedImages.push(image.id)
        },

        login() {
            goToKeycloakLoginPage()
        },
    },
}
</script>

<style lang="scss" scoped>
.make-comment {
    .action {
        display: flex;
        gap: $space-m;
        justify-content: flex-end;
        margin-top: $space-m;
    }

    .no-account {
        background-color: $almost-white;
        padding: $space-m;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
