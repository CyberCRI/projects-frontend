<template>
    <TabsLayout
        :align-left="true"
        :border="false"
        :tabs="ProfileTabs"
        :router-view="isCurrentUser"
        @close="$emit('close')"
    />
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import ProfileSummaryTab from '@/components/Layouts/Profile/Tabs/ProfileSummaryTab.vue'
import ProfileBioTab from '@/components/Layouts/Profile/Tabs/ProfileBioTab.vue'
import ProfileProjectTab from '@/components/Layouts/Profile/Tabs/ProfileProjectTab.vue'
import ProfileGroupsTab from '@/components/Layouts/Profile/Tabs/ProfileGroupsTab.vue'
import ProfileSkillTab from '@/components/Layouts/Profile/Tabs/ProfileSkillTab.vue'

export default {
    name: 'ProfileTabs',

    emits: ['close'],

    components: {
        TabsLayout,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },

        isCurrentUser: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ProfileTabs() {
            // watch out for the order of the tabs
            // the indices are used in calls to provided method tabsLayoutSelectTab()
            // some index are used for navigation (see below)
            return [
                {
                    label: this.$t('profile.snapshot'),
                    key: 'snapshot',
                    id: 'profile-summary',
                    view: '/profile/summary',
                    component: ProfileSummaryTab,
                    props: {
                        user: this.user,
                    },
                },
                {
                    // watch out for the order of this tab
                    // this tab index (1) is used in UserDescription.vue
                    label: this.$t('profile.bio'),
                    key: 'bio',
                    id: 'profile-bio',
                    view: '/profile/bio',
                    component: ProfileBioTab,
                    props: {
                        user: this.user,
                    },
                },
                {
                    // watch out for the order of this tab
                    // this tab index (2) is used in UserProjectList.vue
                    label: this.$t('profile.projects'),
                    key: 'projects',
                    id: 'profile-projects',
                    view: '/profile/projects',
                    component: ProfileProjectTab,
                    props: {
                        user: this.user,
                    },
                },
                {
                    label: this.$t('profile.groups'),
                    key: 'groups',
                    id: 'profile-groups',
                    view: '/profile/groups',
                    component: ProfileGroupsTab,
                    props: {
                        user: this.user,
                    },
                },
                {
                    // watch out for the order of this tab
                    // this tab index (4) is used in SkillSummary.vue
                    label: this.$t('profile.skills'),
                    key: 'skills',
                    id: 'profile-skills',
                    view: '/profile/skills',
                    component: ProfileSkillTab,
                    props: {
                        user: this.user,
                    },
                },
            ]
        },
    },
}
</script>
