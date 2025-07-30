<template>
  <div class="profile-bio">
    <div v-if="isCurrentUser || canEditUser" class="header">
      <LpiButton
        class="edit-btn"
        btn-icon="Pen"
        :label="$t('common.edit')"
        :to="editBioLink"
        data-test="edit-bio"
      />
    </div>
    <!-- Short bio -->
    <div v-if="user.short_description" class="short-bio">
      <h3 class="subtitle">{{ $t('profile.edit.bio.short-bio.label') }}</h3>

      <div class="user-descriptions description-content">
        <p class="short-description" v-html="user.short_description" />
      </div>
    </div>

    <!-- User descriptions -->
    <div v-if="user.short_description" class="long-bio">
      <h3 class="subtitle">{{ $t('profile.edit.bio.long-bio.label') }}</h3>

      <UserDescriptions v-if="user.description" :user="user" />
    </div>

    <!-- No description -->
    <p v-if="!user.description && !user.short_description" class="empty-field">
      {{ noDescription }}
    </p>
  </div>
</template>

<script>
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProfileBioTab',

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const usersStore = useUsersStore()
    const { canEditUser } = usePermissions()
    return {
      usersStore,
      canEditUser,
    }
  },

  computed: {
    isCurrentUser() {
      return this.usersStore.id === this.user.id
    },

    noDescription() {
      return this.isCurrentUser ? this.$t('me.no-bio') : this.$t('you.no-bio')
    },
    editBioLink() {
      return {
        name: 'ProfileEditBio' + (this.isCurrentUser ? '' : 'Other'),
        params: this.isCurrentUser ? {} : { userId: this.user.slug || this.user.id },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-bio {
  padding: $space-l 0;
}

.empty-field {
  color: $mid-gray;
  font-weight: 700;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.subtitle {
  font-size: $font-size-l;
  font-weight: 700;
  color: $primary-dark;
}

.user-descriptions {
  padding: $space-l;
  padding-left: 0;

  &.limited {
    @media all and (min-width: $max-tablet) {
      border: $border-width-s solid $primary;
      border-radius: $border-radius-l;
    }
  }

  .description-content {
    margin-bottom: $space-l;
  }

  :deep(.title) {
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
    margin-bottom: $space-l;
  }
}
</style>
