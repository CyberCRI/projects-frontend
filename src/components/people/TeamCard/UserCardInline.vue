<template>
  <div
    class="user-card-small"
    :class="{ selected: selected, passive: passive }"
    :data-test="`user-card-${user.given_name}`"
    @click="emit('user-clicked')"
  >
    <div class="user-container">
      <CroppedApiImage
        :alt="
          user.keycloack_id ? `${user.given_name} ${user.family_name} image` : `${user.name} image`
        "
        class="img-container"
        :picture-data="userImage"
        picture-size="medium"
        default-picture="/placeholders/user_placeholder.svg"
      />
      <div class="user-info">
        <div v-if="isNotGroup(user)" class="name">
          {{ capitalize(user.given_name) }}
          {{ capitalize(user.family_name) }}
        </div>
        <div v-else class="name">
          {{ capitalize(user.name) }}
        </div>

        <div v-if="role" class="role">
          {{ roleLabel }}
        </div>

        <div v-if="user.job" class="title">
          {{ user.job }}
        </div>

        <div v-if="user.short_description" class="title" v-html="user.short_description" />
      </div>
    </div>

    <div v-if="icon" class="icon" :class="{ 'icon--selected': selected }">
      <IconImage :name="icon" />
    </div>
  </div>
</template>

<script setup>
import { capitalize } from '@/functs/string'
import { isNotGroup } from '@/functs/users'

import IconImage from '@/components/base/media/IconImage.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

defineOptions({ name: 'UserCardInline' })
const { t } = useNuxtI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  role: {
    type: String,
    default: null,
  },

  icon: {
    type: String,
    default: null,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  passive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['user-clicked'])

const roleLabel = () => {
  if (props.role) {
    if (props.role === 'owners') return t('role.editor')
    else if (props.role === 'members') return t('role.teammate')
    else if (props.role === 'reviewers') return t('role.reviewer')
  }
  return null
}

const userImage = () => {
  if (isNotGroup(props.user)) {
    return props.user.profile_picture
  }
  return props.user.header_image
}
</script>

<style lang="scss" scoped>
.user-card-small {
  display: flex;
  align-items: center;
  padding: $space-s;
  box-sizing: border-box;
  border: $border-width-s solid $primary;
  border-radius: $border-radius-m;
  background-color: $white;
  height: pxToRem(70px);
  color: $black;
  position: relative;
  justify-content: space-between;
  cursor: pointer;
  width: pxToRem(240px);

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
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }
  }

  .lpi-button {
    flex-shrink: 0;
  }

  .icon {
    fill: $primary-dark;
    width: pxToRem(20px);
    height: pxToRem(20px);
    position: absolute;
    right: 4px;
    top: 4px;
    border-radius: $border-radius-50;
    cursor: pointer;

    &--selected {
      background: $primary-dark;
      fill: $white;
    }
  }

  .name {
    font-weight: 700;
    font-size: $font-size-s;
    margin-bottom: $space-s;
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

.selected {
  background: $primary-lighter;
}
</style>
