<template>
    <div class="comment-ctn">
        <div v-if="!comment.deleted_at" :class="{ 'is-reply': isReply }" class="comment">
            <div class="comment-picture">
                <CroppedImage
                    :alt="`${comment.author.given_name} ${comment.author.family_name} image`"
                    :image-sizes="imageSizes"
                    :src="imageError ? defaultImage : userImage"
                    @error="placeHolderImg"
                    class="image"
                />
            </div>
            <div class="comment-body">
                <div class="comment-meta">
                    <div class="authorship">
                        <span class="author">
                            {{ comment.author.given_name }} {{ comment.author.family_name }}
                        </span>
                        <span class="separator">&bull;</span>
                        <span class="date">
                            <span v-if="showEditDate">
                                {{ $d(new Date(comment.updated_at)) }}
                            </span>
                            <span v-else>
                                {{ $d(new Date(comment.created_at)) }}
                            </span>
                        </span>
                    </div>
                </div>

                <div v-if="editing" class="comment-body">
                    <MakeComment
                        :project="project"
                        :original-comment="comment"
                        :replied-comment="repliedComment"
                        @canceled="toggleEdit"
                        @submited="toggleEdit"
                        :is-private="isPrivate"
                        @comment-edited="$emit('comment-edited', $event)"
                        @project-message-edited="$emit('project-message-posted', $event)"
                    />
                </div>
                <p v-else class="comment-content" v-html="comment.content"></p>

                <div class="comment-footer">
                    <div v-if="isConnected" class="actions">
                        <div class="reply-action">
                            <ExternalLabelButton
                                v-if="!isReply"
                                :label="$filters.capitalize($t('common.reply'))"
                                btn-icon="Reply"
                                @click="toggleReply"
                                :has-border="true"
                            />
                        </div>

                        <div v-if="canEdit" class="author-action">
                            <ExternalLabelButton
                                v-if="canEdit"
                                :label="$filters.capitalize($t('common.edit'))"
                                :has-border="true"
                                btn-icon="Pen"
                                @click="toggleEdit"
                            />

                            <ExternalLabelButton
                                v-if="canEdit"
                                :label="$filters.capitalize($t('common.delete'))"
                                :has-border="true"
                                btn-icon="TrashCanOutline"
                                @click="openConfirmModal"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else :class="{ 'is-reply': isReply }" class="comment deleted">
            <div class="comment-picture"><span class="image"></span></div>
            <div class="comment-body">
                <div class="placeholder">
                    <IconImage name="Alert" />
                    <span>
                        {{
                            isPrivate
                                ? $t('comment.private-exchange.deleted')
                                : $t('comment.deleted')
                        }}
                        {{ $d(new Date(comment.deleted_at)) }}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="replying" class="comment-reply-ctn">
            <MakeComment
                :project="project"
                :replied-comment="comment"
                @canceled="toggleReply"
                @submited="toggleReply"
                :is-private="isPrivate"
                @comment-posted="$emit('comment-posted', $event)"
                @project-message-posted="$emit('project-message-posted', $event)"
            />
        </div>
        <div v-if="comment.replies && comment.replies.length" class="comment-replies-ctn">
            <CommentItem
                v-for="reply in comment.replies"
                :key="reply.id"
                :comment="reply"
                :is-reply="true"
                :replied-comment="comment"
                :is-private="isPrivate"
                :project="project"
                @comment-posted="$emit('comment-posted', $event)"
                @comment-edited="$emit('comment-edited', $event)"
                @comment-deleted="$emit('comment-deleted', $event)"
                @project-message-posted="$emit('project-message-posted', $event)"
                @project-message-edited="$emit('project-message-posted', $event)"
                @project-message-deleted="$emit('project-message-deleted', $event)"
            />
        </div>

        <ConfirmModal
            v-if="confirmDeleteComment"
            :content="
                isPrivate
                    ? $t('comment.private-exchange.delete-description')
                    : $t('comment.delete-description')
            "
            :title="
                isPrivate ? $t('comment.private-exchange.delete-title') : $t('comment.delete-title')
            "
            @cancel="openConfirmModal"
            @confirm="deleteComment"
            :asyncing="isDeleting"
        />
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ExternalLabelButton from '@/components/base/button/ExternalLabelButton.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import fixEditorContent from '@/functs/editorUtils.ts'
import { deleteComment } from '@/api/comments.service'
import { deleteProjectMessage } from '@/api/project-messages.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'
import permissions from '@/mixins/permissions'

export default {
    name: 'CommentItem',

    mixins: [imageMixin, permissions],

    emits: [
        'comment-posted',
        'project-message-posted',
        'comment-edited',
        'project-message-edited',
        'comment-deleted',
        'project-message-deleted',
    ],

    components: { ConfirmModal, IconImage, ExternalLabelButton, MakeComment, CroppedImage },
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
        comment: {
            type: Object,
            default: () => {},
        },

        repliedComment: {
            type: Object,
            default: () => {},
        },

        isReply: {
            type: Boolean,
            default: false,
        },

        isPrivate: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            replying: false,
            editing: false,
            confirmDeleteComment: false,
            imageError: false,
            isDeleting: false,
        }
    },

    methods: {
        toggleEdit() {
            this.editing = !this.editing
        },

        toggleReply() {
            this.replying = !this.replying
        },

        openConfirmModal() {
            this.confirmDeleteComment = !this.confirmDeleteComment
        },

        async deleteComment() {
            this.isDeleting = true
            if (this.isPrivate) {
                try {
                    await deleteProjectMessage(this.project.id, this.comment.id)

                    analytics.projectMessage.deleteProjectMessage({
                        project: {
                            id: this.project.id,
                        },
                        projectMessage: this.comment,
                    })
                    this.toaster.pushSuccess(
                        this.$t('toasts.project-message-delete.success') /* TODO */
                    )
                    this.$emit('project-message-deleted', this.comment)
                } catch (error) {
                    this.toaster.pushError(
                        `${this.$t('toasts.comment-delete.error')} (${error})` /* TODO */
                    )
                    console.error(error)
                } finally {
                    this.confirmDeleteComment = false
                    this.isDeleting = false
                }
            } else {
                try {
                    await deleteComment(this.project.id, this.comment.id)
                    analytics.comment.deleteComment({
                        project: {
                            id: this.project.id,
                        },
                        comment: this.comment,
                    })
                    this.toaster.pushSuccess(this.$t('toasts.comment-delete.success'))

                    this.$emit('comment-deleted', this.comment)
                } catch (error) {
                    this.toaster.pushError(`${this.$t('toasts.comment-delete.error')} (${error})`)
                    console.error(error)
                } finally {
                    this.confirmDeleteComment = false
                    this.isDeleting = false
                }
            }
        },
        placeHolderImg() {
            this.imageError = true
        },
    },

    computed: {
        canEdit() {
            return this.comment.author.id === this.currentUserId || this.isAdmin
        },

        currentUserId() {
            return this.usersStore.id || null
        },

        isConnected() {
            return this.usersStore.isConnected
        },

        userImage() {
            return this.comment.author.profile_picture
                ? this.comment.author.profile_picture.variations.medium
                : null
        },
        imageSizes() {
            return this.imageError
                ? null
                : pictureApiToImageSizes(this.comment.author.profile_picture)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },

        showEditDate() {
            return (
                new Date(this.comment.updated_at).toLocaleString() !==
                new Date(this.comment.created_at).toLocaleString()
            )
        },
    },
    watch: {
        'comment.content': {
            handler: function (neo, old) {
                if (neo != old) {
                    // give time to render content
                    this.$nextTick(() => {
                        const contentNode = this.$el.querySelector('.comment-content')
                        fixEditorContent(contentNode)
                    })
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
$comment-pic-size: pxToRem(72px);

.comment {
    display: flex;
    align-items: stretch;
    padding: 0;
    padding-top: $space-l;

    .comment-picture {
        flex-shrink: 0;
        padding-right: $space-l;

        .image {
            display: inline-block;
            width: $comment-pic-size;
            height: $comment-pic-size;
            border-radius: 50%;
        }
    }

    .comment-body {
        width: 100%;
        flex-grow: 1;
        padding-bottom: $space-l;
        border-bottom: $border-width-s solid $primary;

        .comment-meta {
            display: flex;
            align-items: center;
            padding-bottom: $space-l;

            .authorship {
                flex-grow: 1;
                color: $primary-dark;
                font-weight: 700;
                font-size: $font-size-m;

                .separator {
                    padding: 0 0.5rem;
                }
            }

            .action {
                flex-shrink: 0;
            }
        }

        .comment-content {
            font-size: $font-size-m;
        }
    }

    .comment-footer {
        padding-top: $space-l;

        .actions {
            display: flex;
            justify-content: space-between;

            .external-btn + .external-btn {
                margin-left: $space-l;
            }
        }
    }

    &.deleted .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            height: 24px;
            width: 24px;
            margin-right: $space-s;
        }
    }
}

.comment-reply-ctn,
.comment-replies-ctn {
    margin: $space-2xs 0 0 #{$comment-pic-size + $space-l};
}
</style>
