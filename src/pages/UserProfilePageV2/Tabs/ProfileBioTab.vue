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

<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import useUsersStore from '~/stores/useUserStore'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const { t } = useNuxtI18n()

const usersStore = useUsersStore()

const isCurrentUser = computed(() => usersStore.id === props.user.id)

const noDescription = computed(() => (isCurrentUser.value ? t('me.no-bio') : t('you.no-bio')))
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.empty-field {
  color: variables.$mid-gray;
  font-weight: 700;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.subtitle {
  font-size: variables.$font-size-l;
  font-weight: 700;
  color: variables.$primary-dark;
}

.user-descriptions {
  padding: variables.$space-l;
  padding-left: 0;

  &.limited {
    @media all and (min-width: variables.$max-tablet) {
      border: variables.$border-width-s solid variables.$primary;
      border-radius: variables.$border-radius-l;
    }
  }

  .description-content {
    margin-bottom: variables.$space-l;
  }

  :deep(.title) {
    font-size: variables.$font-size-m;
    font-weight: 700;
    color: variables.$primary-dark;
    margin-bottom: variables.$space-l;
  }
}
</style>
