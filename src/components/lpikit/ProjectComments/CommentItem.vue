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
                        <span>&bull;</span>
                        <span class="date">
                            <span v-if="showEditDate">
                                {{ new Date(comment.updated_at).toLocaleDateString() }}
                            </span>
                            <span v-else>
                                {{ new Date(comment.created_at).toLocaleDateString() }}
                            </span>
                        </span>
                    </div>
                </div>

                <div v-if="editing" class="comment-body">
                    <MakeComment
                        :original-comment="comment"
                        :replied-comment="repliedComment"
                        @canceled="toggleEdit"
                        @submited="toggleEdit"
                    />
                </div>
                <p v-else class="comment-content" v-html="comment.content"></p>

                <div class="comment-footer">
                    <div v-if="isConnected" class="actions">
                        <div class="reply-action">
                            <ExternalLabelButton
                                v-if="!isReply"
                                :label="$filters.capitalize($t('common.reply'))"
                                :reversed="true"
                                right-icon="Reply"
                                @click="toggleReply"
                            />
                        </div>

                        <div v-if="canEdit" class="author-action">
                            <ExternalLabelButton
                                v-if="canEdit"
                                :label="$filters.capitalize($t('common.edit'))"
                                :reversed="true"
                                right-icon="Pen"
                                @click="toggleEdit"
                            />

                            <ExternalLabelButton
                                v-if="canEdit"
                                :label="$filters.capitalize($t('common.delete'))"
                                :reversed="true"
                                right-icon="TrashCanOutline"
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
                        {{ $t('comment.deleted') }}
                        {{ new Date(comment.deleted_at).toLocaleDateString() }}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="replying" class="comment-reply-ctn">
            <MakeComment
                :replied-comment="comment"
                @canceled="toggleReply"
                @submited="toggleReply"
            />
        </div>
        <div v-if="comment.replies && comment.replies.length" class="comment-replies-ctn">
            <CommentItem
                v-for="reply in comment.replies"
                :key="reply.id"
                :comment="reply"
                :is-reply="true"
                :replied-comment="comment"
            />
        </div>

        <ConfirmModal
            v-if="confirmDeleteComment"
            :content="$t('comment.delete-description')"
            :title="$t('comment.delete-title')"
            @cancel="openConfirmModal"
            @confirm="deleteComment"
        />
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import ExternalLabelButton from '@/components/lpikit/LpiButton/ExternalLabelButton.vue'
import MakeComment from '@/components/lpikit/ProjectComments/MakeComment.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'CommentItem',

    mixins: [imageMixin],

    components: { ConfirmModal, IconImage, ExternalLabelButton, MakeComment, CroppedImage },

    props: {
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
    },

    data() {
        return {
            replying: false,
            editing: false,
            confirmDeleteComment: false,
            imageError: false,
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
            const body = {
                id: this.comment.id,
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
                this.confirmDeleteComment = false
            }
        },
        placeHolderImg() {
            this.imageError = true
        },
    },

    computed: {
        canEdit() {
            return (
                this.comment.author.keycloak_id === this.currentUserId ||
                this.$store.getters['users/isSuperAdmin']
            )
        },

        currentUserId() {
            return this.$store.state.users.keycloak_id ? this.$store.state.users.keycloak_id : null
        },

        isConnected() {
            return this.$store.getters['users/isConnected']
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
        flex-grow: 1;
        padding-bottom: $space-l;
        border-bottom: $border-width-s solid $green;

        .comment-meta {
            display: flex;
            align-items: center;
            padding-bottom: $space-l;

            .authorship {
                flex-grow: 1;
                color: $primary-dark;
                font-weight: 700;
                font-size: $font-size-m;
            }

            .action {
                flex-shrink: 0;
            }
        }

        .comment-content {
            font-size: $font-size-m;
            line-height: $font-size-2xl;
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
