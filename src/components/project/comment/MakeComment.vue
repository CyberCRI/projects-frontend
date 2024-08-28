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

        <div v-if="!repliedComment && !originalComment" class="header">
            <h4 class="title">{{ $t('comment.add-comment') }}</h4>
        </div>

        <div v-if="isLoggedIn">
            <TipTapEditor
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
                    :label="$t('comment.publish')"
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
import { postCommentImage } from '@/api/comments.service'

export default {
    name: 'MakeComment',

    emits: ['submited', 'canceled'],

    mixins: [permissions],

    components: { LpiButton, TipTapEditor, ConfirmModal },

    props: {
        repliedComment: {
            type: Object,
            default: null,
        },

        originalComment: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            comment: this.originalComment ? this.originalComment.content : '<p></p>',
            addedImages: [],
            asyncing: false,
            confirmModalIsOpen: false,
        }
    },

    computed: {
        ...mapGetters({
            isLoggedIn: 'users/isLoggedIn',
            projectId: 'projects/currentProjectId',
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
            formData.append('project_id', this.projectId)
            return postCommentImage(this.projectId, formData)
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
                project_id: this.projectId,
                images_ids: this.addedImages,
            }

            if (this.repliedComment) payload.reply_on_id = this.repliedComment.id

            try {
                const result = await this.$store.dispatch('comments/postComment', payload)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.comment-create.success'),
                    type: 'success',
                })
                if (!this.repliedComment) this.scrollToNewComment(result)
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.comment-create.error')} (${error})`,
                    type: 'error',
                })
            } finally {
                this.asyncing = false
            }
        },

        async updateComment() {
            const body = {
                id: this.originalComment.id,
                comment: {
                    content: this.comment,
                    project_id: this.projectId,
                    images_ids: this.addedImages,
                },
            }

            try {
                await this.$store.dispatch('comments/patchComment', {
                    body,
                    mainComment: this.repliedComment,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.comment-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.comment-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        scrollToNewComment(comment) {
            document.getElementById(comment.id).scrollIntoView({
                behavior: 'smooth',
            })
        },

        handleImage(image) {
            this.addedImages(image)
        },

        login() {
            goToKeycloakLoginPage()
        },
    },
}
</script>

<style lang="scss" scoped>
.make-comment {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: $space-m;
        flex-wrap: wrap;

        .title {
            font-size: $font-size-2xl;
            font-weight: 700;
        }

        .notice {
            font-size: $font-size-s;
        }
    }

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
