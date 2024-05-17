<template>
    <div class="project-comments narrow-content">
        <MakeComment />

        <NoItem v-if="!comments.length" message="comment.no-comments" />

        <div v-else>
            <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :id="comment.id"
                :comment="comment"
                @edit-comment="openCommentModal"
                @reply-to-comment="openCommentModal"
            />
        </div>
    </div>
</template>

<script>
import CommentItem from '@/components/project/comment/CommentItem.vue'
import NoItem from '@/components/project/comment/NoItem.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import { mapGetters } from 'vuex'
import ProjectTab from '@/mixins/ProjectTab.ts'
import utils from '@/functs/functions.ts'

export default {
    name: 'ProjectCommentsTab',

    mixins: [ProjectTab],

    components: { CommentItem, NoItem, MakeComment },

    computed: {
        ...mapGetters({ comments: 'comments/all' }),
    },

    inject: ['projectLayoutToggleAddModal'],

    methods: {
        openCommentModal(comment) {
            this.projectLayoutToggleAddModal('comment', comment)
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.hash == '#tab') {
                vm.$nextTick(function () {
                    // remove hash from url so it doen't affect shared url
                    history.replaceState('', '', `${location.pathname}${location.search}`)
                    utils.scrollTo(document.querySelector('.tabs-wrapper'))
                })
            }
        })
    },
}
</script>

<style lang="scss" scoped>
.project-comments {
    margin-top: $space-2xl;
    margin-bottom: $space-l;
}
</style>
