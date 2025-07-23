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
    router-view
  />
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
  name: 'ProfileEditTabs',

  components: {
    TabsLayout,
    LoaderSimple,
  },

  props: {
    user: {
      type: Object,
      default: null,
    },
    isSelf: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['profile-edited'],

  computed: {
    ProfileTabs() {
      // watch out for the order of the tabs
      // the indices are used in calls to provided method tabsLayoutSelectTab()
      // some index are used for navigation (see below)
      const roadSuffix = this.isSelf ? '' : 'Other'
      const params = this.isSelf ? {} : { userId: this.user.id }
      const props = {
        user: this.user,
        onProfileEdited: () => {
          this.$emit('profile-edited')
        },
      }
      return [
        {
          label: this.$t('profile.edit.general.tab'),
          key: 'general',
          id: 'profile-edit-general',
          view: {
            name: 'ProfileEditGeneral' + roadSuffix,
            params,
          },
          props,
        },
        {
          label: this.$t('profile.edit.bio.tab'),
          key: 'bio',
          id: 'profile-edit-bio',
          view: {
            name: 'ProfileEditBio' + roadSuffix,
            params,
          },
          props,
        },
        {
          label: this.$t('profile.edit.projects.tab'),
          key: 'projects',
          id: 'profile-edit-projects',
          view: {
            name: 'ProfileEditProjects' + roadSuffix,
            params,
          },
          props,
        },
        {
          label: this.$t('profile.edit.groups.tab'),
          key: 'groups',
          id: 'profile-edit-groups',
          view: {
            name: 'ProfileEditGroups' + roadSuffix,
            params,
          },
          props,
        },
        {
          label: this.$t('profile.edit.skills.tab'),
          key: 'skills',
          id: 'profile-edit-skills',
          view: {
            name: 'ProfileEditSkills' + roadSuffix,
            params,
          },
          props,
        },
        {
          label: this.$t('profile.edit.privacy.tab'),
          key: 'privacy',
          id: 'profile-edit-privacy',
          view: {
            name: 'ProfileEditPrivacy' + roadSuffix,
            params,
          },
          props,
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
