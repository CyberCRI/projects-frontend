<template>
  <UserCard
    :user="member"
    :role="roleLabel"
    :mode="mode"
    class="cursor-pointer border-primary"
    @click="click"
  >
    <template #actions>
      <slot name="actions">
        <span class="d-none" />
      </slot>
    </template>
  </UserCard>
</template>

<script setup lang="ts">
import UserCard from '~/components/people/UserCard.vue'
import { roleI18n } from '~/functs/rolesUtils'

import { isAnonymousUser } from '~/functs/users'

const props = withDefaults(
  defineProps<{
    member: any
    roleLabel?: string
    mode?: 'list' | 'card'
  }>(),
  { mode: 'list', roleLabel: undefined }
)

const emit = defineEmits(['click'])

const isAnonymous = computed(() => isAnonymousUser(props.member))

const roleLabel = computed(() => {
  if (props.roleLabel !== undefined) {
    return props.roleLabel
  }
  if (props.member) {
    if (props.member.is_leader && props.member.is_manager) return roleI18n('owner_groups')
    else if (props.member.is_manager) return roleI18n('managers')
    else if (props.member.is_leader) return roleI18n('leaders')
    else return roleI18n('member_groups')
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
