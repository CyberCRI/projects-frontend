<template>
  <div>
    <div v-if="user && !isLoading" :key="user.id" class="user-profile">
      <div v-if="isPreview">
        <div class="profile-links">
          <LinkButton
            class="page-btn"
            btn-icon="Eye"
            :label="$t('profile.go-to-page')"
            :to="{
              name: 'ProfileOtherUser',
              params: { userId: user?.slug || userId },
            }"
          />
        </div>
        <ProfileSummaryTab :user="user" />
      </div>
      <NavPanelLayout
        v-else
        :is-loading="isLoading"
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="breadCrumbs || []"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <LazyProfileNavPanel
            v-if="!isLoading && !isNavCollapsed"
            :class="{ collapsed: isNavCollapsed }"
            :profile-tabs="profileTabs"
            :current-tab="currentTab"
            :user="user"
            :edit-button-label="editButtonLabel"
            :edit-profile-link="editProfileLink"
            :is-editing="isEditing"
            :can-edit-user="canEditUserOrIsSelf"
            :is-current-user="userId === null"
            class="slide-panel"
            @navigated="onNavigated"
          />
        </template>
        <template v-if="currentTab" #content>
          <SubPageTitle :title-prefix="userFullName" :current-tab="currentTab" />
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>
    <NavPanelLoader v-else />
  </div>
</template>

<script>
import { getUser } from '@/api/people.service.ts'
import useUsersStore from '@/stores/useUsers.ts'
import ProfileSummaryTab from '@/pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'

export default {
  name: 'UserProfileV2',

  components: {
    ProfileSummaryTab,
  },
  provide() {
    return {
      tabsLayoutSelectTab: this.selectTab,
    }
  },

  props: {
    userId: {
      type: [Number, String, null],
      default: null,
    },

    // isEditing: {
    //   type: Boolean,
    //   default: false,
    // },
    // showPageLink: {
    //   type: Boolean,
    //   default: true,
    // },
    // routableTabs: {
    //   type: Boolean,
    //   default: false,
    // },

    isPreview: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['user-not-found', 'close', 'profile-edited'],

  setup() {
    const usersStore = useUsersStore()
    const { canEditUser } = usePermissions()

    const { t } = useI18n()
    const uniqueId = 'project-nav-panel'
    const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
      useToggleableNavPanel(uniqueId)

    const onNavigated = collapseIfUnderBreakpoint

    const breadCrumbs = computed(() => [
      {
        name: t('common.people'),
        route: { name: 'People' },
      },
    ])

    return {
      usersStore,
      canEditUser,
      isNavCollapsed,
      toggleNavPanel,
      onNavigated,
      breadCrumbs,
    }
  },

  data() {
    return {
      user: null,

      // TODO: add back once we can edit user
      // projectUser: null,
      // isEditMode: false,
      // canEdit: false,
      // payload: {
      //     editorShortDescription: {
      //         savedContent: '',
      //         originalContent: '',
      //     },
      //     editorProfessionalDescription: {
      //         savedContent: '',
      //         originalContent: '',
      //     },
      //     editorPersonalDescription: {
      //         savedContent: '',
      //         originalContent: '',
      //     },
      // },
      isLoading: true,
    }
  },

  computed: {
    // connectedUser() {
    //   return this.usersStore.userFromApi
    // },

    userFullName() {
      const parts = []
      if (this.user?.given_name) {
        parts.push(this.user.given_name)
      }
      if (this.user?.family_name) {
        parts.push(this.user.family_name)
      }
      return parts.join(' ')
    },

    isSelf() {
      return !this.userId // this.connectedUser && this.user.id === this.connectedUser.id
    },

    canEditUserOrIsSelf() {
      return this.canEditUser || this.isSelf
    },

    editButtonLabel() {
      return this.isSelf ? this.$t('profile.edit.edit-your-profile') : this.$t('profile.edit.edit')
    },
    editProfileLink() {
      // return this.isSelf
      //   ? { name: 'ProfileEditGeneral' }
      //   : {
      //       name: 'ProfileEditOtherUser',
      //       params: { userId: this.user?.slug || this.userId },
      //     }
      return this.currentTab.altView
    },

    profileTabs() {
      return this.isEditing ? this.profileEditTabsFiltered : this.profileDisplayTabsFiltered
    },

    profileDisplayTabs() {
      // watch out for the order of the tabs
      // the indices are used in calls to provided method tabsLayoutSelectTab()
      // some index are used for navigation (see below)

      const roadSuffix = this.isSelf ? '' : 'Other'
      const params = this.isSelf ? {} : { userId: this.user.slug || this.user.id }
      return [
        {
          label: this.$t('profile.snapshot'),
          key: 'snapshot',
          id: 'profile-summary',
          // view: `/profile/${this.pathInfix}summary`,
          view: {
            name: 'ProfileSummary' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditGeneral' + roadSuffix,
            params,
          },
          // component: ProfileSummaryTab,
          props: {
            user: this.user,
          },
          icon: 'Home',
          condition: true,
          noTitle: true, // no title for this tab
        },
        {
          // watch out for the order of this tab
          // this tab index (1) is used in UserDescription.vue
          label: this.$t('profile.bio'),
          key: 'bio',
          id: 'profile-bio',
          // view: `/profile/${this.pathInfix}bio`,
          view: {
            name: 'ProfileBio' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditBio' + roadSuffix,
            params,
          },
          // component: ProfileBioTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Account',
        },
        {
          // watch out for the order of this tab
          // this tab index (2) is used in UserProjectList.vue
          label: this.$t('profile.projects'),
          key: 'projects',
          id: 'profile-projects',
          //view: `/profile/${this.pathInfix}projects`,
          view: {
            name: 'ProfileProjects' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditProjects' + roadSuffix,
            params,
          },
          // component: ProfileProjectTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Archive',
        },
        {
          label: this.$t('profile.publications'),
          key: 'publications',
          id: 'profile-publications',
          view: {
            name: 'ProfilePublications' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditPublications' + roadSuffix,
            params,
          },
          props: {
            user: this.user,
          },
          // dispay publications only if user have publications
          condition: this.user?.publications?.length > 0,
          icon: 'Pen',
        },
        {
          label: this.$t('profile.groups'),
          key: 'groups',
          id: 'profile-groups',
          //view: `/profile/${this.pathInfix}groups`,
          view: {
            name: 'ProfileGroups' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditGroups' + roadSuffix,
            params,
          },
          // component: ProfileGroupsTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Users',
        },
        {
          // watch out for the order of this tab
          // this tab index (4) is used in SkillSummary.vue
          label: this.$t('profile.skills'),
          key: 'skills',
          id: 'profile-skills',
          // view: `/profile/${this.pathInfix}skills`,
          view: {
            name: 'ProfileSkills' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileEditSkills' + roadSuffix,
            params,
          },
          // component: ProfileSkillTab,
          props: {
            user: this.user,
          },

          condition: true,
          icon: 'VipCrownLine',
        },
      ]
    },

    profileDisplayTabsFiltered() {
      return this.profileDisplayTabs.map((entry) => ({ ...entry, dataTest: entry.key }))
    },

    profileEditTabs() {
      // watch out for the order of the tabs
      // the indices are used in calls to provided method tabsLayoutSelectTab()
      // some index are used for navigation (see below)
      const roadSuffix = this.isSelf ? '' : 'Other'
      const params = this.isSelf ? {} : { userId: this.user.slug || this.user.id }
      const props = {
        user: this.user,
        onProfileEdited: () => {
          this.loadUser()
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
          altView: {
            name: 'ProfileSummary' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'Home',
          actionIcon: 'Pen',
        },
        {
          label: this.$t('profile.edit.bio.tab'),
          key: 'bio',
          id: 'profile-edit-bio',
          view: {
            name: 'ProfileEditBio' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileBio' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'Account',
          actionIcon: 'Pen',
        },
        {
          label: this.$t('profile.edit.projects.tab'),
          key: 'projects',
          id: 'profile-edit-projects',
          view: {
            name: 'ProfileEditProjects' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileProjects' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'Archive',
          actionIcon: 'Pen',
        },
        {
          label: this.$t('profile.edit.groups.tab'),
          key: 'groups',
          id: 'profile-edit-groups',
          view: {
            name: 'ProfileEditGroups' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileGroups' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'Users',
          actionIcon: 'Pen',
        },
        {
          label: this.$t('profile.edit.skills.tab'),
          key: 'skills',
          id: 'profile-edit-skills',
          view: {
            name: 'ProfileEditSkills' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileSkills' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'VipCrownLine',
          actionIcon: 'Pen',
        },
        {
          label: this.$t('profile.edit.privacy.tab'),
          key: 'privacy',
          id: 'profile-edit-privacy',
          view: {
            name: 'ProfileEditPrivacy' + roadSuffix,
            params,
          },
          altView: {
            name: 'ProfileSummary' + roadSuffix,
            params,
          },
          props,
          condition: true,
          icon: 'Cog',
          actionIcon: 'Pen',
        },
      ].map((entry) => ({
        ...entry,
        isEditing: true,
        actionIcon: 'Pen',
      }))
    },

    profileEditTabsFiltered() {
      return this.profileEditTabs.map((entry) => ({ ...entry, dataTest: entry.key }))
    },

    allProfileTabs() {
      return [...this.profileDisplayTabs, ...this.profileEditTabs]
    },

    currentTab() {
      return this.allProfileTabs.find((tab) => this.$route.name === tab.view.name)
    },

    isEditing() {
      return this.currentTab?.isEditing || false
    },
  },

  async mounted() {
    try {
      await this.loadUser()
    } catch (err) {
      // TODO distinguish 404 from real error
      this.$emit('user-not-found', err)
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    // TODO: add back once we can edit user
    // initPayloads() {
    //     this.payload = {
    //         editorShortDescription: {
    //             savedContent: this.user.short_description,
    //             originalContent: this.user.short_description,
    //         },
    //         editorProfessionalDescription: {
    //             savedContent: this.user.professional_description,
    //             originalContent: this.user.professional_description,
    //         },
    //         editorPersonalDescription: {
    //             savedContent: this.user.personal_description,
    //             originalContent: this.user.personal_description,
    //         },
    //     }
    // },
    // updateContent(selectedEditor, htmlContent) {
    //     this.payload[selectedEditor].savedContent = htmlContent
    // },

    selectTab(index) {
      // this.current = index
      // if (this.routerView) {
      //   this.$router.push(this.tabs[this.current].view)
      // }

      // this.closeTabList()
      this.$router.push(this.profileTabs[index].view)
    },

    async loadUser() {
      if (!this.userId || this.userId === this.usersStore.id) {
        // get the connected user
        this.user = await this.usersStore.getUser(this.usersStore.id, true)
      } else {
        // get another user
        this.user = await getUser(this.userId, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-links {
  display: inline-flex;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 24px;
  text-transform: none;
  gap: $space-unit;
}
</style>
