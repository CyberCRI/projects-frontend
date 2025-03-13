<template>
    <div class="project-comments narrow-content">
        <div class="header">
            <h2 class="title">{{ $t('comment.private-exchange.title') }}</h2>
            <p class="notice">{{ $t('comment.private-exchange.notice') }}</p>
        </div>
        <MakeComment
            :project="project"
            is-private
            @project-message-posted="$emit('reload-project-messages')"
        />

        <NoItem v-if="!projectMessages.length" message="comment.private-exchange.no-message" />

        <div v-else>
            <CommentItem
                is-private
                v-for="projectMessage in projectMessages"
                :key="projectMessage.id"
                :id="projectMessage.id"
                :project="project"
                :comment="projectMessage"
                @project-message-posted="$emit('reload-project-messages')"
                @project-message-edited="$emit('reload-project-messages')"
                @project-message-deleted="$emit('reload-project-messages')"
            />
        </div>
    </div>
</template>

<script>
import CommentItem from '@/components/project/comment/CommentItem.vue'
import NoItem from '@/components/project/comment/NoItem.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import utils from '@/functs/functions.ts'
import permissions from '@/mixins/permissions.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'ProjectPrivateExchangeTab',

    mixins: [permissions],

    emits: ['reload-project-messages'],

    components: { CommentItem, NoItem, MakeComment },

    setup() {
        const usersStore = useUsersStore()
        useScrollToTab()
        return {
            usersStore,
        }
    },
    props: {
        project: {
            type: Object,
            default: () => {},
        },
        projectMessages: {
            type: Array,
            default: () => [],
        },
        team: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        isMemberOrAdmin() {
            const members = [...this.team.members, ...this.team.owners, ...this.team.reviewers]
            return this.isAdmin || members.find((user) => this.usersStore.id === user.id)
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
                if (neo && !this.isMemberOrAdmin) {
                    this.$router.replace({
                        name: 'pageProject',
                        params: { slugOrId: this.project.slug || this.project.id },
                    })
                }
            },
            immediate: true,
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
