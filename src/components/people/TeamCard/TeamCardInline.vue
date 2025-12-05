<template>
  <div
    class="team-card-small"
    :class="{ passive: !iconName }"
    :data-test="`user-card-${user.id}`"
    @click="iconName ? $emit('user-clicked') : null"
  >
    <div class="user-container">
      <CroppedApiImage
        :alt="
          user.keycloack_id ? `${user.given_name} ${user.family_name} image` : `${user.name} image`
        "
        class="img-container"
        :picture-data="user.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />

      <div class="user-info">
        <div v-if="$filters.isNotGroup(user)" class="name">
          {{ $filters.capitalize(user.given_name) }}
          {{ $filters.capitalize(user.family_name) }}
        </div>
        <div v-else class="name">
          {{ $filters.capitalize(user.name) }}
        </div>
        <div v-if="roleLabel" class="role">
          {{ $t(roleLabel) }}
        </div>

        <div v-if="user.job" class="title">
          {{ user.job }}
        </div>
      </div>
    </div>

    <div v-if="iconName" class="icon">
      <IconImage :name="iconName" @click="$emit('user-clicked')" />
    </div>
  </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import useUsersStore from '@/stores/useUsers.ts'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'

export default {
  name: 'TeamCardInline',

  components: { IconImage, CroppedApiImage },

  props: {
    user: {
      type: Object,
      required: true,
    },

    roleLabel: {
      type: [String, null],
      default: null,
    },

    icon: {
      type: String,
      default: null,
    },
  },

  emits: ['user-clicked'],
  setup() {
    const usersStore = useUsersStore()

    return {
      usersStore,
      DEFAULT_USER_PATATOID,
    }
  },

  computed: {
    currentUser() {
      return this.usersStore.userFromApi
    },

    iconName() {
      if (this.icon) return this.icon
      return this.user.id !== this.currentUser.id ? 'Close' : null
    },
  },
}
</script>

<style lang="scss" scoped>
.team-card-small {
  display: flex;
  align-items: center;
  padding: $space-l $space-m;
  box-sizing: border-box;
  border: $border-width-s solid $primary;
  border-radius: $border-radius-m;
  background-color: $white;
  height: pxToRem(118px);
  color: $black;
  position: relative;
  justify-content: space-between;
  cursor: pointer;

  &.passive {
    cursor: default;
    pointer-events: none;
  }

  .user-container {
    display: flex;
    align-items: center;
  }

  .img-container {
    border-radius: 50%;
    background-size: cover;
    background-position: top center;
    width: pxToRem(48px);
    height: pxToRem(48px);
    flex-shrink: 0;
  }

  .user-info {
    margin-left: $space-m;
    flex-grow: 1;

    .title {
      font-size: $font-size-xs;
      font-weight: 400;
    }
  }

  .lpi-button {
    flex-shrink: 0;
  }

  .icon {
    fill: $primary-dark;
    border: $border-width-s solid $primary-dark;
    width: pxToRem(16px);
    height: pxToRem(16px);
    position: absolute;
    right: 2px;
    top: 2px;
    border-radius: $border-radius-50;
    cursor: pointer;
  }

  .name {
    font-weight: 700;
    font-size: $font-size-s;
    margin-bottom: $space-m;
  }

  .role {
    background: $primary;
    color: $black;
    font-size: $font-size-s;
    font-weight: 700;
    display: inline-block;
    padding: $space-2xs $space-xs;
    margin-bottom: $space-m;
  }
}
</style>
