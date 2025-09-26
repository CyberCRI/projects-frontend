<template>
  <div v-if="user" class="profile-summary">
    <!-- Profile Header -->
    <ProfileHeaderV2 v-if="user && !isLoading" class="profile-header" :user="user" />

    <div>
      <!-- User descriptions -->
      <UserDescriptions
        v-if="user.description"
        :is-limited="true"
        :user="user"
        class="user-description unboxed"
      />
      <p v-else class="empty-field">
        {{ noDescription }}
      </p>
    </div>
  </div>
</template>

<script>
import UserDescriptions from '@/components/people/UserDescriptions.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProfileSummaryResearcherTab',

  components: {
    UserDescriptions,
  },

  inject: {
    selectTab: {
      from: 'tabsLayoutSelectTab',
      default: () => {},
    },
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
    }
  },

  data() {
    return {
      listLimit: 6,
    }
  },

  computed: {
    noDescription() {
      return this.isCurrentUser ? this.$t('me.no-bio') : this.$t('you.no-bio')
    },
  },
}
</script>

<style lang="scss" scoped>
.unboxed {
  border: 0 none !important;
  border-radius: 0 !important;
  padding: $space-l 0 !important;
  background: transparent !important;
}

:deep(.unboxed .section-header) {
  justify-content: space-between !important;
}

.profile-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .project-list {
    width: 100%;
  }

  .user-description {
    margin-top: $space-42;
  }

  .lists {
    padding: 0;
  }

  .skills-mobile {
    display: none;
  }
}

@media screen and (max-width: $max-tablet) {
  .profile-summary {
    padding: $space-s;

    .skills-mobile {
      display: block;
    }
  }

  .profile-summary .top {
    flex-direction: column;

    .right {
      display: none;
    }

    .left {
      width: 100%;
      margin-right: 0;
      margin-bottom: $space-l;
    }

    .lists {
      padding: 0 $layout-size-2xs;
    }
  }
}

.project-list-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: $space-2xl 0 $space-l 0;

  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: 0;
  }
}

.empty-field {
  padding-top: $space-l;
  color: $mid-gray;
  font-weight: 700;
}
</style>
