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
  return roleI18n(props.member.role)
})

const click = () => {
  if (isAnonymous.value) {
    return
  }
  emit('click', props.member)
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;

  .picture {
    width: variables.pxToRem(120px);
    height: variables.pxToRem(120px);
    object-fit: cover;
    object-position: top center;
    border-radius: 50%;
  }

  .badge {
    background: variables.$primary-dark;
    font-weight: 400;
    font-size: variables.$font-size-s;
    margin-top: variables.$space-s;
    padding: variables.$space-2xs;
    color: variables.$white;
  }

  .user-name {
    text-transform: capitalize;
  }

  .name-ctn {
    display: flex;
    align-items: center;
    margin-top: variables.$space-s;
    text-align: center;

    h4 {
      margin: 0;
      font-weight: 700;
      font-size: variables.$font-size-m;
      line-height: variables.$line-height-tight;
    }

    svg {
      height: 16px;
      width: 16px;
      fill: variables.$primary-dark;
      cursor: pointer;
      margin-left: variables.$space-s;
    }
  }

  .job {
    margin-top: variables.$space-s;
    text-align: center;
    font-size: variables.$font-size-s;
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
