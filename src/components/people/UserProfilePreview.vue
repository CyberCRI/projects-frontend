<template>
  <div>
    <div v-if="user && !isLoading" :key="user.id" class="user-profile">
      <div>
        <div class="profile-links">
          <LinkButton
            class="page-btn"
            btn-icon="Eye"
            :label="$t('profile.go-to-page')"
            :to="{
              name: 'ProfileUser',
              params: { userIdOrSlug: user?.slug || userId },
            }"
          />
        </div>
        <ProfileSummaryTab :user="user" />
      </div>
    </div>
    <NavPanelLoader v-else />
  </div>
</template>

<script>
import { getUser } from 'shared-projects-frontend/apis'

import useUsersStore from '~/stores/useUsers'

import { usePermissionUser } from '~/composables/usePermissions/useUserPermissions'
import ProfileSummaryTab from '~/pages/UserPageV2/Tabs/ProfileSummaryTab.vue'

export default {
  name: 'UserProfilePreview',

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
  },

  emits: ['user-not-found', 'close', 'profile-edited'],

  setup(props) {
    const usersStore = useUsersStore()
    const { canEditUser } = usePermissionUser(computed(() => props.userId))
    const { onboardingTrap } = useOnboardingStatus()
    const { t } = useNuxtI18n()
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
    const originalUser = ref(null)
    const { translateUser } = useAutoTranslate()
    const user = translateUser(originalUser)
    const isLoading = ref(true)
    return {
      usersStore,
      canEditUser,
      isNavCollapsed,
      toggleNavPanel,
      onNavigated,
      breadCrumbs,
      originalUser,
      user,
      isLoading,
      onboardingTrap,
    }
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
    async loadUser() {
      if (!this.userId || this.userId === this.usersStore.id) {
        // get the connected user
        this.originalUser = await this.usersStore.refreshUser()
      } else if (this.userId) {
        // get another user
        this.originalUser = await getUser(this.userId, { noError: true })
      } else {
        throw new Error('userId is empty')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.profile-links {
  display: inline-flex;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 24px;
  text-transform: none;
  gap: variables.$space-unit;
}
</style>
