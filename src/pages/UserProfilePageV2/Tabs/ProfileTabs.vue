<template>
  <TabsLayout
    :align-left="true"
    :border="false"
    :tabs="ProfileTabs"
    :router-view="routable"
    @close="$emit('close')"
  />
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import ProfileSummaryTab from '@/pages/UserProfilePage/Tabs/ProfileSummaryTab.vue'
import ProfileBioTab from '@/pages/UserProfilePage/Tabs/ProfileBioTab.vue'
import ProfileProjectTab from '@/pages/UserProfilePage/Tabs/ProfileProjectTab.vue'
import ProfileGroupsTab from '@/pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'
import ProfileSkillTab from '@/pages/UserProfilePage/Tabs/ProfileSkillTab.vue'

export default {
  name: 'ProfileTabs',

  components: {
    TabsLayout,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },

    routable: {
      type: Boolean,
      default: false,
    },
    isCurrentUser: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  computed: {
    pathInfix() {
      return this.isCurrentUser ? '' : `${this.user.slug || this.user.id}/`
    },
    ProfileTabs() {
      // watch out for the order of the tabs
      // the indices are used in calls to provided method tabsLayoutSelectTab()
      // some index are used for navigation (see below)
      return [
        {
          label: this.$t('profile.snapshot'),
          key: 'snapshot',
          id: 'profile-summary',
          view: `/profile/${this.pathInfix}summary`,
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
          view: `/profile/${this.pathInfix}bio`,
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
          view: `/profile/${this.pathInfix}projects`,
          component: ProfileProjectTab,
          props: {
            user: this.user,
          },
        },
        {
          label: this.$t('profile.groups'),
          key: 'groups',
          id: 'profile-groups',
          view: `/profile/${this.pathInfix}groups`,
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
          view: `/profile/${this.pathInfix}skills`,
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
