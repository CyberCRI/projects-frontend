<template>
    <DialogModal @close="$emit('close')" @submit="submit">
        <template #header>{{ $filters.capitalize($t('comment.comment')) }}</template>

        <template #body>
            <div v-if="repliedComment" class="source">
                <span class="date">{{
                    new Date(repliedComment.created_at).toLocaleDateString()
                }}</span>

                <span class="from">{{ $t('common.from') }}:</span>

                <h3 class="publication-title">
                    <span class="author">
                        <span>{{ repliedComment.author.given_name }}</span>
                        <span>{{ repliedComment.author.family_name }}</span>
                    </span>
                </h3>

                <div class="publication-content">
                    <div v-html="repliedComment.content"></div>

                    <div class="gradient"></div>
                    <IconImage name="ChevronDown" class="angle-down-icon" />
                </div>
            </div>

            <TipTapEditor
                class="comment-description"
                :key="editorKey"
                :save-icon-visible="false"
                :socket="false"
                :ws-data="comment"
                @update="updateContent"
            />
        </template>

        <template #button-1
            ><span>{{ $t('common.cancel') }}</span></template
        >

        <template #extra-buttons>
            <button
                v-if="originalComment"
                type="button"
                class="button-footer button-footer--delete"
                @click="deleteComment"
                aria-label="delete-button"
            >
                <span>{{ $t('common.delete') }}</span>
            </button>
        </template>

        <template #button-2
            ><span>{{ $t('common.publish') }}</span></template
        >
    </DialogModal>
</template>

<script>
import DialogModal from '@/components/lpikit/DialogModal/DialogModal.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import IconImage from '@/components/svgs/IconImage.vue'

/**
 * TODO: this is probably a dead component
 * check and remove if not used
 */

export default {
    name: 'CommentModal',

    emits: ['close'],

    components: { DialogModal, TipTapEditor, IconImage },

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
            comment: {
                originalContent: this.originalComment ? this.originalComment.content : '',
                savedContent: this.originalComment ? this.originalComment.content : '',
                room: '',
            },
            editorKey: '0',
        }
    },

    computed: {
        projectId() {
            return this.$store.getters['projects/currentProjectId']
        },

        user() {
            return this.$store.getters['users/user']
        },
    },

    methods: {
        submit() {
            if (this.originalComment) this.updateComment()
            else this.createComment()
        },

        async createComment() {
            const payload = {
                content: this.comment.content,
                author_id: this.user.id,
                project_id: this.projectId,
            }

            if (this.repliedComment) payload.reply_on_id = this.repliedComment.id

            try {
                await this.$store.dispatch('comments/postComment', payload)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.comment-create.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.comment-create.error')} (${error})`,
                    type: 'error',
                })
            } finally {
                this.$emit('close')
            }
        },

        async updateComment() {
            const body = {
                id: this.originalComment.id,
                comment: {
                    content: this.comment.content,
                    project_id: this.projectId,
                    author_id: this.user.id,
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
            } finally {
                this.$emit('close')
            }
        },

        async deleteComment() {
            const body = {
                id: this.originalComment.id,
                mainComment: this.repliedComment,
            }

            try {
                await this.$store.dispatch('comments/deleteComment', body)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.comment-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.comment-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
            }
        },

        updateContent(content) {
            this.comment.content = content
        },
    },
}
</script>

<style lang="scss" scoped>
.comment-description {
    margin-bottom: $space-m;
}

.button-footer--delete {
    cursor: pointer;
    color: $white;
    background: $salmon;
    margin-left: pxToRem(16px);
    padding: $space-m pxToRem(11px);
    border: $border-width-s solid $primary-dark;
    font-weight: 700;
    border-radius: 24px;
    text-transform: capitalize;

    &:hover {
        color: $white;
        background: $primary-dark;
    }
}

.source {
    margin-bottom: $space-xl;

    .date {
        color: $primary-dark;
        font-size: $space-m;
        font-weight: 700;
    }

    .from {
        font-size: $space-m;
        font-weight: 400;
        display: block;
        margin-top: $space-s;
    }

    .publication-title {
        font-size: $font-size-2xl;
        font-weight: 700;
        border-bottom: $border-width-m solid $primary-dark;
        padding-bottom: $space-m;
        margin-bottom: $space-m;
        color: $dark;

        .author span:last-of-type {
            text-transform: uppercase;
        }
    }

    .publication-content {
        color: $text-body;
        overflow: hidden;
        position: relative;
        max-height: 400px;

        .gradient {
            position: absolute;
            opacity: 1;
            transition: opacity 0.8s ease-in-out;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: linear-gradient(
                180deg,
                rgb(255 255 255 / 0%) 0%,
                rgb(255 255 255 / 10%) 70%,
                rgb(255 255 255 / 85%) 85%,
                rgb(255 255 255) 100%
            );
            pointer-events: none;
        }

        .angle-down-icon {
            height: 12px;
            fill: $primary-dark;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
