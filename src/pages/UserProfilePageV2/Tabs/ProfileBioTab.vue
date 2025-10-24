<template>
  <div class="profile-bio">
    <!--div v-if="isCurrentUser || canEditUser" class="header">
      <LpiButton
        class="edit-btn"
        btn-icon="Pen"
        :label="$t('common.edit')"
        :to="editBioLink"
        data-test="edit-bio"
      />
    </div-->
    <!-- Short bio -->
    <div v-if="user.short_description" class="short-bio">
      <h3 class="subtitle">{{ $t('profile.edit.bio.short-bio.label') }}</h3>

      <div class="user-descriptions description-content">
        <p class="short-description" v-html="user?.$t?.short_description" />
      </div>
    </div>

    <!-- User descriptions -->
    <div v-if="user.description" class="long-bio">
      <h3 class="subtitle">{{ $t('profile.edit.bio.long-bio.label') }}</h3>

      <UserDescriptions v-if="user.description" :user="user" />
    </div>

    <!-- No description -->
    <p v-if="!user.description && !user.short_description" class="empty-field">
      {{ noDescription }}
    </p>
  </div>
</template>

<script setup>
import useUsersStore from '@/stores/useUsers.ts'

defineOptions({ name: 'ProfileBioTab' })

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const { t } = useNuxtI18n()

const usersStore = useUsersStore()

const isCurrentUser = computed(() => {
  return usersStore.id === props.user.id
})

const noDescription = computed(() => {
  return isCurrentUser.value ? t('me.no-bio') : t('you.no-bio')
})
</script>

<style lang="scss" scoped>
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
