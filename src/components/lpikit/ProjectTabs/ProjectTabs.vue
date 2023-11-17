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
                        left-icon="Plus"
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
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import AddToProjectDropdown from '@/components/lpikit/Dropdown/AddToProjectDropdown.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProjectTabs',

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
    },

    computed: {
        blogEntries() {
            return this.project ? this.project.blog_entries : []
        },

        linkedProjects() {
            return this.project ? this.project.linked_projects : []
        },

        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },

        projectTabs() {
            return [
                {
                    key: 'project-summary',
                    label: this.$t('project.summary'),
                    view: `/projects/${this.$route.params.slugOrId}/summary`,
                    props: {
                        project: this.project,
                        similarProjects: this.similarProjects,
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
                    condition:
                        this.project.goals.length ||
                        this.project.sdgs.length ||
                        this.isRoute('projectGoals'), // prevent error when emptying the current tab
                    dataTest: 'project-goals',
                },
                {
                    key: 'project-blog',
                    label: this.$t('blog.title'),
                    view: `/projects/${this.$route.params.slugOrId}/blog-entries`,
                    condition: !!this.blogEntries.length || this.isRoute('projectBlog'), // prevent error when emptying the current tab
                    dataTest: 'project-blog',
                },
                {
                    key: 'project-resources',
                    label: this.$t('resource.resources'),
                    view: `/projects/${this.$route.params.slugOrId}/resources`,
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
                    condition:
                        !!this.linkedProjects.length || this.isRoute('projectLinkedProjects'), // prevent error when emptying the current tab
                    dataTest: 'project-linked-projects',
                },
                {
                    key: 'project-team',
                    label: this.$t('team.team'),
                    view: `/projects/${this.$route.params.slugOrId}/team`,
                    condition: true,
                    dataTest: 'project-team',
                },
                {
                    key: 'project-comments',
                    label: this.$t('comment.comments'),
                    view: `/projects/${this.$route.params.slugOrId}/comments`,
                    condition: true,
                    dataTest: 'project-comments',
                },
                {
                    key: 'project-announcements',
                    label: this.$t('home.announcements'),
                    view: `/projects/${this.$route.params.slugOrId}/announcements`,
                    condition:
                        this.project.announcements.length > 0 ||
                        this.isRoute('projectAnnouncements'), // prevent error when emptying the current tab
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

<style lang="scss">
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
