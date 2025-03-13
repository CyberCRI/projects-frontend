<template>
    <div class="project-comments narrow-content">
        <div class="header">
            <h2 class="title">{{ $t('comment.add-comment') }}</h2>
        </div>

        <MakeComment @comment-posted="$emit('reload-comments')" :project="project" />

        <NoItem v-if="!comments.length" message="comment.no-comments" />

        <div v-else>
            <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :id="comment.id"
                :comment="comment"
                :project="project"
                @edit-comment="openCommentModal"
                @reply-to-comment="openCommentModal"
                @comment-posted="$emit('reload-comments')"
                @comment-edited="$emit('reload-comments')"
                @comment-deleted="$emit('reload-comments')"
            />
        </div>
    </div>
</template>

<script>
import CommentItem from '@/components/project/comment/CommentItem.vue'
import NoItem from '@/components/project/comment/NoItem.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import utils from '@/functs/functions.ts'

export default {
    name: 'ProjectCommentsTab',

    emits: ['reload-comments'],

    components: { CommentItem, NoItem, MakeComment },

    props: {
        project: {
            type: Object,
            default: () => {},
        },
        comments: {
            type: Array,
            default: () => [],
        },
    },

    inject: ['projectLayoutToggleAddModal'],

    setup() {
        useScrollToTab()
        return {}
    },

    methods: {
        openCommentModal(comment) {
            this.projectLayoutToggleAddModal('comment', comment)
        },
    },
}
</script>

<style lang="scss" scoped>
.header {
    margin-block: 2rem;

    .title {
        font-size: $font-size-2xl;
        font-weight: 700;
        line-height: 1.25;
    }

    .notice {
        margin-top: 1rem;
        font-size: $font-size-m;
    }
}

.project-comments {
    margin-top: $space-2xl;
    margin-bottom: $space-l;
}
</style>
