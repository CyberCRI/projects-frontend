<template>
  <div class="user" @click="emits('user-click', user)">
    <CroppedApiImage
      :alt="user.id ? `${user.given_name} ${user.family_name} image` : `${user.name} image`"
      class="picture"
      :picture-data="user.profile_picture"
      picture-size="medium"
      default-picture="/placeholders/user_placeholder.svg"
    />
    <span v-if="roleLabel" class="badge" data-test="leader-badge">
      {{ $t(roleLabel) }}
    </span>

    <div v-if="isNotGroup(user)" class="name-ctn">
      <h4 class="user-name">
        {{ userName }}
      </h4>
    </div>

    <!--        TODO: ask Api to send information-->
    <div v-if="isNotGroup(user)" class="job">
      {{ user?.$t?.job }}
    </div>

    <div v-if="isGroup(user)" class="name-ctn">
      <h4 class="user-name">
        {{ user.name }}
      </h4>
    </div>
  </div>
</template>

<script setup>
import { isNotGroup, isGroup } from '@/functs/users'

import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

defineOptions({ name: 'GroupMemberItem' })

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['user-click'])

const userName = computed(() => {
  return `${props.user.given_name?.toLowerCase()} ${props.user.family_name?.toLowerCase()}`
})
const roleLabel = computed(() => {
  if (props.user) {
    if (props.user.is_leader && props.user.is_manager) return 'group.role.leaders-managers.label'
    else if (props.user.is_manager) return 'group.role.managers.label'
    else if (props.user.is_leader) return 'group.role.leaders.label'
    else return 'group.role.members.label'
  }
  return null
})
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;

  .picture {
    width: pxToRem(120px);
    height: pxToRem(120px);
    object-fit: cover;
    object-position: top center;
    border-radius: 50%;
  }

  .badge {
    background: $primary-dark;
    font-weight: 400;
    font-size: $font-size-s;
    margin-top: $space-s;
    padding: $space-2xs;
    color: $white;
  }

  .user-name {
    text-transform: capitalize;
  }

  .name-ctn {
    display: flex;
    align-items: center;
    margin-top: $space-s;
    text-align: center;

    h4 {
      margin: 0;
      font-weight: 700;
      font-size: $font-size-m;
      line-height: $line-height-tight;
    }

    svg {
      height: 16px;
      width: 16px;
      fill: $primary-dark;
      cursor: pointer;
      margin-left: $space-s;
    }
  }

  .job {
    margin-top: $space-s;
    text-align: center;
    font-size: $font-size-s;
  }
}
</style>
