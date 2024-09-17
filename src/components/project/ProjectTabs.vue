<template>
    <div class="project-tabs">
        <TabsLayout :align-left="true" :border="false" :tabs="projectTabs" router-view>
            <template #button-1>
                <div
                    v-click-outside="() => (addToProjectMenuVisible = false)"
                    class="dropdown-ctn"
                    v-if="canEditProject"
                >
                    <LpiButton
                        v-if="canEditProject"
                        :animation="false"
                        :class="{ active: addToProjectMenuVisible }"
                        :label="$t('common.add')"
                        class="add-to-project-button"
                        btn-icon="Plus"
                        @click="toggleAddToProject"
                        data-test="add-to-project"
                    />

                    <transition name="fade">
                        <AddToProjectDropdown
                            v-if="addToProjectMenuVisible && canEditProject"
                            :project="project"
                            class="add-to-project"
                            @close-dropdown="toggleAddToProject"
                        />
                    </transition>
                </div>
            </template>
        </TabsLayout>
    </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import AddToProjectDropdown from '@/components/project/AddToProjectDropdown.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProjectTabs',

    emits: [
        'reload-comments',
        'reload-project-messages',
        'reload-announcements',
        'reload-file-resources',
        'reload-link-resources',
        'reload-blog-entries',
        'reload-goals',
        'reload-sdgs',
        'reload-team',
        'reload-reviews',
        'reload-linked-projects',
    ],

    components: { TabsLayout, LpiButton, AddToProjectDropdown },

    mixins: [permissions],

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        similarProjects: {
            type: Array,
            default: () => [],
        },
        comments: {
            type: Array,
            default: () => [],
        },
        projectMessages: {
            type: Array,
            default: () => [],
        },
        locations: {
            type: Array,
            default: () => [],
        },
        announcements: {
            type: Array,
            default: () => [],
        },
        fileResources: {
            type: Array,
            default: () => [],
        },
        linkResources: {
            type: Array,
            default: () => [],
        },
        blogEntries: {
            type: Array,
            default: () => [],
        },
        goals: {
            type: Array,
            default: () => [],
        },
        sdgs: {
            type: Array,
            default: () => [],
        },
        team: {
            type: Object,
            default: () => ({ owners: [], members: [], reviewers: [] }),
        },
        reviews: {
            type: Array,
            default: () => [],
        },
        linkedProjects: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        categories() {
            return this.$store.getters['projectCategories/hierarchy']
        },

        isMember() {
            const members = [...this.team.members, ...this.team.owners, ...this.team.reviewers]
            return members.find((user) => this.$store.getters['users/id'] === user.id)
        },

        projectTabs() {
            return [
                {
                    key: 'project-summary',
                    label: this.$t('project.summary'),
                    view: `/projects/${this.$route.params.slugOrId}/summary`,
                    props: {
                        project: this.project,
                        comments: this.comments,
                        similarProjects: this.similarProjects,
                        locations: this.locations,
                        fileResources: this.fileResources,
                        linkResources: this.linkResources,
                        blogEntries: this.blogEntries,
                        team: this.team,
                        reviews: this.reviews,
                        linkedProjects: this.linkedProjects,
                        onReloadReviews: () => this.$emit('reload-reviews'),
                    },
                    condition: true,
                    dataTest: 'project-summary',
                },
                {
                    key: 'project-description',
                    label: this.$t('form.description'),
                    view: `/projects/${this.$route.params.slugOrId}/description`,
                    props: {
                        project: this.project,
                    },
                    condition: true,
                    dataTest: 'project-description',
                },
                {
                    key: 'project-goals',
                    label: this.$t('goal.goals'),
                    view: `/projects/${this.$route.params.slugOrId}/goals`,
                    props: {
                        project: this.project,
                        goals: this.goals,
                        sdgs: this.sdgs,
                        onReloadGoals: () => this.$emit('reload-goals'),
                        onReloadSdgs: () => this.$emit('reload-sdgs'),
                    },
                    condition:
                        this.goals?.length || this.sdgs?.length || this.isRoute('projectGoals'), // prevent error when emptying the current tab
                    dataTest: 'project-goals',
                },
                {
                    key: 'project-blog',
                    label: this.$t('blog.title'),
                    view: `/projects/${this.$route.params.slugOrId}/blog-entries`,
                    props: {
                        project: this.project,
                        blogEntries: this.blogEntries,
                        onReloadBlogEntries: () => this.$emit('reload-blog-entries'),
                    },
                    condition: !!this.blogEntries.length || this.isRoute('projectBlog'), // prevent error when emptying the current tab
                    dataTest: 'project-blog',
                },
                {
                    key: 'project-resources',
                    label: this.$t('resource.resources'),
                    view: `/projects/${this.$route.params.slugOrId}/resources`,
                    props: {
                        project: this.project,
                        fileResources: this.fileResources,
                        linkResources: this.linkResources,
                        onReloadFileResources: () => this.$emit('reload-file-resources'),
                        onReloadLinkResources: () => this.$emit('reload-link-resources'),
                    },
                    condition:
                        (this.project &&
                            !!(this.project.files.length || this.project.links.length)) ||
                        this.isRoute('projectResources'), // prevent error when emptying the current tab
                    dataTest: 'project-resources',
                },
                {
                    key: 'project-linked-projects',
                    label: this.$t('project.linked-projects'),
                    view: `/projects/${this.$route.params.slugOrId}/linked-projects`,
                    props: {
                        project: this.project,
                        linkedProjects: this.linkedProjects,
                        onReloadLinkedProjects: () => this.$emit('reload-linked-projects'),
                    },
                    condition:
                        !!this.linkedProjects?.length || this.isRoute('projectLinkedProjects'), // prevent error when emptying the current tab
                    dataTest: 'project-linked-projects',
                },
                {
                    key: 'project-team',
                    label: this.$t('team.team'),
                    view: `/projects/${this.$route.params.slugOrId}/team`,
                    props: {
                        project: this.project,
                        team: this.team,
                        onReloadTeam: () => {
                            console.log('reload tabs')
                            this.$emit('reload-team')
                        },
                    },
                    condition: true,
                    dataTest: 'project-team',
                },
                {
                    key: 'project-comments',
                    label: this.$t('comment.comments'),
                    view: `/projects/${this.$route.params.slugOrId}/comments`,
                    props: {
                        project: this.project,
                        comments: this.comments,
                        onReloadComments: () => this.$emit('reload-comments'),
                    },
                    condition: true,
                    dataTest: 'project-comments',
                },
                {
                    key: 'project-private-exchange',
                    label: this.$t('comment.private-exchange.tab'),
                    view: `/projects/${this.$route.params.slugOrId}/private-exchange`,
                    props: {
                        project: this.project,
                        projectMessages: this.projectMessages,
                        onReloadProjectMessages: () => this.$emit('reload-project-messages'),
                    },
                    condition: this.isAdmin || this.isMember,
                    dataTest: 'project-private-exchange',
                },
                {
                    key: 'project-announcements',
                    label: this.$t('home.announcements'),
                    view: `/projects/${this.$route.params.slugOrId}/announcements`,
                    props: {
                        project: this.project,
                        announcements: this.announcements,
                        onReloadAnnouncements: () => this.$emit('reload-announcements'),
                    },
                    condition:
                        this.announcements?.length > 0 || this.isRoute('projectAnnouncements'), // prevent error when emptying the current tab
                    dataTest: 'project-announcements',
                },
                {
                    key: 'project-settings',
                    label: this.$t('project.settings'),
                    view: `/projects/${this.$route.params.slugOrId}/project-settings`,
                    condition: true,
                    props: {
                        project: this.project,
                        categories: this.categories,
                        onReloadTeam: () => this.$emit('reload-team'),
                        onReloadReviews: () => this.$emit('reload-reviews'),
                    },
                    dataTest: 'project-settings',
                },
            ].filter((tab) => tab.condition)
        },
    },

    data() {
        return {
            addToProjectMenuVisible: false,
        }
    },

    methods: {
        toggleAddToProject() {
            this.addToProjectMenuVisible = !this.addToProjectMenuVisible
        },

        isRoute(name) {
            return this.$route && this.$route.name === name
        },
    },
}
</script>

<style lang="scss" scoped>
.project-tabs {
    .dropdown-ctn {
        position: relative;

        .add-to-project-button:hover,
        .project-config-button:hover {
            opacity: 1 !important;
        }

        .add-to-project-button.active,
        .project-config-button.active {
            background-color: $white !important;
            color: $primary-dark !important;

            svg {
                fill: $primary-dark;
            }
        }

        .add-to-project,
        .project-config {
            position: absolute;
            z-index: $zindex-toast;
        }

        .add-to-project {
            top: 43px;
            right: 1px;
        }

        .project-config {
            top: 42px;
            right: 0;
        }
    }

    > div:nth-child(2) {
        margin: 0 pxToRem(10px) 0 pxToRem(20px);
    }
}
</style>
