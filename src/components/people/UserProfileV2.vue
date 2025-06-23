<template>
  <div v-if="user && !isLoading" class="user-profile">
    <NavPanelLayout
      :is-loading="loading"
      :is-nav-collapsed="isNavCollapsed"
      :breadcrumbs="breadCrumbs || []"
      @toggle-nav-panel="toggleNavPanel"
      @collapse-nav-panel="isNavCollapsed = true"
    >
      <template #nav-panel>
        <LazyProfileNavPanel
          v-if="!loading && !isNavCollapsed"
          :class="{ collapsed: isNavCollapsed }"
          :profile-tabs="profileTabs"
          :current-tab="currentTab"
          :user="user"
          :edit-button-label="editButtonLabel"
          :edit-profile-link="editProfileLink"
          :can-edit-user="canEditUser"
          :is-current-user="userId === null"
          class="slide-panel"
          @navigated="onNavigated"
        />
      </template>
      <template #content>
        <h2 v-if="!currentTab.noTitle" class="content-title">
          {{ user?.given_name }} {{ user?.family_name }} - {{ currentTab.label }}
        </h2>
        <NuxtPage v-bind="currentTab.props" />
      </template>
    </NavPanelLayout>
  </div>
</template>

<script>
import { getUser } from '@/api/people.service.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'UserProfileV2',

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
    // showPageLink: {
    //   type: Boolean,
    //   default: true,
    // },
    // routableTabs: {
    //   type: Boolean,
    //   default: false,
    // },
  },

  emits: ['user-not-found', 'close'],

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
    connectedUser() {
      return this.usersStore.userFromApi
    },

    isSelf() {
      return this.connectedUser && this.user.id === this.connectedUser.id
    },

    editButtonLabel() {
      return this.isSelf ? this.$t('profile.edit.edit-your-profile') : this.$t('profile.edit.edit')
    },
    editProfileLink() {
      return this.isSelf
        ? { name: 'ProfileEdit' }
        : {
            name: 'ProfileEditOtherUser',
            params: { userId: this.user?.slug || this.userId },
          }
    },

    pathInfix() {
      return this.isSelf ? '' : `${this.user.slug || this.user.id}/`
    },

    profileTabs() {
      // watch out for the order of the tabs
      // the indices are used in calls to provided method tabsLayoutSelectTab()
      // some index are used for navigation (see below)
      return [
        {
          label: this.$t('profile.snapshot'),
          key: 'snapshot',
          id: 'profile-summary',
          view: `/profile/${this.pathInfix}summary`,
          // component: ProfileSummaryTab,
          props: {
            user: this.user,
            isLoading: this.isLoading,
          },
          icon: 'Article',
          condition: true,
          noTitle: true, // no title for this tab
        },
        {
          // watch out for the order of this tab
          // this tab index (1) is used in UserDescription.vue
          label: this.$t('profile.bio'),
          key: 'bio',
          id: 'profile-bio',
          view: `/profile/${this.pathInfix}bio`,
          // component: ProfileBioTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Article',
        },
        {
          // watch out for the order of this tab
          // this tab index (2) is used in UserProjectList.vue
          label: this.$t('profile.projects'),
          key: 'projects',
          id: 'profile-projects',
          view: `/profile/${this.pathInfix}projects`,
          // component: ProfileProjectTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Article',
        },
        {
          label: this.$t('profile.groups'),
          key: 'groups',
          id: 'profile-groups',
          view: `/profile/${this.pathInfix}groups`,
          // component: ProfileGroupsTab,
          props: {
            user: this.user,
          },
          condition: true,
          icon: 'Article',
        },
        {
          // watch out for the order of this tab
          // this tab index (4) is used in SkillSummary.vue
          label: this.$t('profile.skills'),
          key: 'skills',
          id: 'profile-skills',
          view: `/profile/${this.pathInfix}skills`,
          // component: ProfileSkillTab,
          props: {
            user: this.user,
          },

          condition: true,
          icon: 'Article',
        },
      ]
    },

    currentTab() {
      return this.profileTabs.find((tab) => this.$route.path.indexOf(tab.view) === 0)
    },
  },

  async mounted() {
    try {
      if (!this.userId) {
        // get the connected user
        this.user = await this.usersStore.getUser(this.usersStore.id, true)
      } else {
        // get another user
        this.user = await getUser(this.userId, true)
      }
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
  },
}
</script>

<style lang="scss" scoped>
.project-layout {
  margin-top: pxToRem(48px);
}

.content-title {
  color: $primary-dark;
  font-size: $font-size-4xl;
}
</style>
