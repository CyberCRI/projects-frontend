<template>
    <div class="project-comments narrow-content">
        <div class="header">
            <h2 class="title">{{ $t('comment.private-exchange.notice') }}</h2>
            <p class="notice">{{ $t('comment.private-exchange.notice') }}</p>
        </div>
        <MakeComment is-private />

        <NoItem v-if="!comments.length" message="comment.private-exchange.no-message" />

        <div v-else>
            <CommentItem
                is-private
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
// import { mapGetters } from 'vuex'
import ProjectTab from '@/mixins/ProjectTab.ts'
import utils from '@/functs/functions.ts'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProjectPrivateExchangeTab',

    mixins: [ProjectTab, permissions],

    components: { CommentItem, NoItem, MakeComment },

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        comments() {
            // TODO: use private comment api
            // ...mapGetters({ comments: 'comments/all' }),
            return []
        },
        isMember() {
            const members = [
                ...this.project.team.members,
                ...this.project.team.owners,
                ...this.project.team.reviewers,
            ]
            return members.find((user) => this.$store.getters['users/id'] === user.id)
        },
    },

    inject: ['projectLayoutToggleAddModal'],

    methods: {
        openCommentModal(comment) {
            this.projectLayoutToggleAddModal('comment', comment)
        },
    },

    mounted() {
        if (!this.project) {
            this.$router.replace({
                name: 'pageProject',
                params: { slugOrId: this.$route.params.slugOrId },
            })
        }
    },

    watch: {
        project: {
            handler: function (neo) {
                if (neo && !this.isAdmin && !this.isMember) {
                    this.$router.replace({
                        name: 'pageProject',
                        params: { slugOrId: this.project.slug || this.project.id },
                    })
                }
            },
            immediate: true,
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
.header {
    margin-block: 2rem;

    .title {
        font-size: $font-size-2xl;
        font-weight: 700;
        line-height: 1.25;
    }

    .notice {
        margin-top: 1rem;
        font-size: 1rem;
    }
}

.project-comments {
    margin-top: $space-2xl;
    margin-bottom: $space-l;
}
</style>
