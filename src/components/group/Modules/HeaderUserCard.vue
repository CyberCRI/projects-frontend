<template>
  <div class="header-member-card">
    <CroppedApiImage
      :alt="`${member.given_name} ${member.family_name} image`"
      class="picture picture-user skeletons-background"
      :picture-data="member.profile_picture"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="text text-limit">
      <div class="name skeletons-text">{{ member.given_name }} {{ member.family_name }}</div>
      <div v-if="roleLabel" class="role skeletons-text">
        {{ roleLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
// import { roleI18n } from '~/functs/rolesUtils'

import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'
import type { UserModel } from 'shared-projects-frontend/models'

const props = withDefaults(
  defineProps<{
    member: UserModel
    roleLabel?: string
  }>(),
  {
    role: '',
    roleLabel: undefined,
  }
)

const roleLabel = computed(() => {
  if (props.roleLabel !== undefined) {
    return props.roleLabel
  }
  // TODO:
  // return roleI18n(props.member.role) || prop.member.$t.job
  return props.member.$t.job
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.header-member-card {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.picture {
  border-radius: 100%;
  width: 2.5rem;
  height: 2.5rem;
}

.text {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.6rem;
}

.name {
  font-weight: 600;
}

.role {
  font-size: 0.8rem;
}
</style>
