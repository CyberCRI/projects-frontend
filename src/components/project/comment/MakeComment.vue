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
import { mapGetters } from 'vuex'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// import utils from '@/functs/functions.ts'
import permissions from '@/mixins/permissions.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import analytics from '@/analytics'
import { patchComment, postComment, postCommentImage } from '@/api/comments.service'

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
        ...mapGetters({
            isLoggedIn: 'users/isLoggedIn',
        }),

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

        async postComment(comment) {
            try {
                const result = await postComment(comment)

                // if (comment.reply_on_id) {
                //     commit('SET_REPLY', { id: comment.reply_on_id, comment: result })
                // } else {
                //     commit('SET_COMMENT', result)
                // }

                analytics.comment.comment({
                    project: {
                        id: this.project.id,
                    },
                    comment: result,
                })

                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        async postProjectMessage(projectMessage) {
            try {
                const result = await postProjectMessage(projectMessage)

                // reply_on_id in comment
                // if (projectMessage.reply_on) {
                //     commit('SET_REPLY', { id: projectMessage.reply_on, projectMessage: result }) // reply_on_id in comment
                // } else {
                //     commit('SET_PROJECT_MESSAGE', result)
                // }

                analytics.projectMessage.projectMessage({
                    project: {
                        id: this.project.id,
                    },
                    projectMessage: result,
                })

                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        async patchProjectMessage(projectMessage) {
            try {
                const result = await patchProjectMessage(projectMessage.id, projectMessage)

                // if (mainProjectMessage) {
                //     commit('UPDATE_REPLY_PROJECT_MESSAGE', { reply: result, mainProjectMessage })
                // } else {
                //     commit('UPDATE_PROJECT_MESSAGE', result)
                // }

                analytics.projectMessage.updateProjectMessage({
                    project: {
                        id: this.project.id,
                    },
                    projectMessage: result,
                })

                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        async patchComment(comment) {
            try {
                const result = await patchComment(comment.id, comment)

                // if (mainComment) {
                //     commit('UPDATE_REPLY_COMMENT', { reply: result, mainComment })
                // } else {
                //     commit('UPDATE_COMMENT', result)
                // }

                analytics.comment.updateComment({
                    project: {
                        id: this.project.id,
                    },
                    comment: result,
                })

                return result
            } catch (err) {
                throw new Error(err)
            }
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
                    const result = await this.postProjectMessage(payload)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.comment-create.success'), // TODO
                        type: 'success',
                    })
                    this.$emit('project-message-posted', result)
                    this.$nextTick(() => {
                        if (!this.repliedComment) this.scrollToNewComment(result)
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.comment-create.error')} (${error})`, // TODO
                        type: 'error',
                    })
                } finally {
                    this.asyncing = false
                }
            } else {
                if (this.repliedComment) payload.reply_on_id = this.repliedComment.id
                try {
                    const result = await this.postComment(payload)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.comment-create.success'),
                        type: 'success',
                    })
                    this.$emit('comment-posted', result)
                    this.$nextTick(() => {
                        if (!this.repliedComment) this.scrollToNewComment(result)
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.comment-create.error')} (${error})`,
                        type: 'error',
                    })
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
                    await this.patchProjectMessage(projectMessage)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.comment-update.success'), // TODO
                        type: 'success',
                    })
                    this.$emit('project-message-edited', projectMessage)
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.comment-update.error')} (${error})`, // TODO
                        type: 'error',
                    })
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
                    await this.patchComment(comment)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.comment-update.success'),
                        type: 'success',
                    })
                    this.$emit('comment-edited', comment)
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.comment-update.error')} (${error})`,
                        type: 'error',
                    })
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
