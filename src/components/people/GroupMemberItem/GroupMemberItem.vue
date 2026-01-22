<template>
  <UserCard
    :user="member"
    :role="roleLabel"
    mode="list"
    class="cursor-pointer shadow-drop border-primary"
    @click="click"
  >
    <template #actions>
      <template />
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import { isNotGroup, isGroup, isAnonymousUser } from '@/functs/users'

import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import UserCard from '@/components/people/UserCard.vue'
import { TranslatedGroupMember } from '@/models/group.model'

defineOptions({ name: 'GroupMemberItem' })

const props = defineProps<{
  member: any
}>()

const { t } = useNuxtI18n()

const emit = defineEmits(['click'])

const isAnonymous = computed(() => isAnonymousUser(props.member))

const roleLabel = computed(() => {
  if (props.member) {
    if (props.member.is_leader && props.member.is_manager)
      return t('group.role.leaders-managers.label')
    else if (props.member.is_manager) return t('group.role.managers.label')
    else if (props.member.is_leader) return t('group.role.leaders.label')
    else return t('group.role.members.label')
  }
  return null
})

const click = () => {
  if (isAnonymous.value) {
    return
  }
  emit('click', props.member)
}
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

.user.anonymous,
.user.anonymous:hover {
  opacity: 0.6;
  filter: unset !important;
  transform: unset !important;
  text-shadow: unset !important;
  cursor: not-allowed !important;
  pointer-events: none;

  svg {
    cursor: not-allowed !important;
  }
}
</style>
