<template>
    <div v-if="!user" class="loader">
        <LoaderSimple />
    </div>
    <TabsLayout
        v-else
        :align-left="true"
        :border="false"
        :tabs="ProfileTabs"
        class="profile-edit-tabs"
    />
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import ProfileGeneralEditTab from '@/pages/ProfileEditPage/Tabs/ProfileGeneralEditTab.vue'
import ProfileBioEditTab from '@/pages/ProfileEditPage/Tabs/ProfileBioEditTab.vue'
import ProfileProjectsEditTab from '@/pages/ProfileEditPage/Tabs/ProfileProjectsEditTab.vue'
import ProfileGroupsEditTab from '@/pages/ProfileEditPage/Tabs/ProfileGroupsEditTab.vue'
import ProfileSkillsEditTab from '@/pages/ProfileEditPage/Tabs/ProfileSkillsEditTab.vue'
import ProfilePrivacyEditTab from '@/pages/ProfileEditPage/Tabs/ProfilePrivacyEditTab.vue'
import permissions from '@/mixins/permissions.ts'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
    name: 'ProfileEditTabs',

    mixins: [permissions],

    emits: ['profile-edited'],

    components: {
        TabsLayout,
        LoaderSimple,
    },

    props: {
        user: {
            type: Object,
            default: null,
        },
    },

    computed: {
        ProfileTabs() {
            // watch out for the order of the tabs
            // the indices are used in calls to provided method tabsLayoutSelectTab()
            // some index are used for navigation (see below)
            return [
                {
                    label: this.$t('profile.edit.general.tab'),
                    key: 'general',
                    id: 'profile-edit-general',
                    component: ProfileGeneralEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
                {
                    label: this.$t('profile.edit.bio.tab'),
                    key: 'bio',
                    id: 'profile-edit-bio',
                    component: ProfileBioEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
                {
                    label: this.$t('profile.edit.projects.tab'),
                    key: 'projects',
                    id: 'profile-edit-projects',
                    component: ProfileProjectsEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
                {
                    label: this.$t('profile.edit.groups.tab'),
                    key: 'groups',
                    id: 'profile-edit-groups',
                    component: ProfileGroupsEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
                {
                    label: this.$t('profile.edit.skills.tab'),
                    key: 'skills',
                    id: 'profile-edit-skills',
                    component: ProfileSkillsEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
                {
                    label: this.$t('profile.edit.privacy.tab'),
                    key: 'privacy',
                    id: 'profile-edit-privacy',
                    component: ProfilePrivacyEditTab,
                    props: {
                        user: this.user,
                        onProfileEdited: () => {
                            this.$emit('profile-edited')
                        },
                    },
                },
            ]
        },
    },
}
</script>
<style scoped lang="scss">
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}
</style>
