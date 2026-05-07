<template>
  <BaseDrawer
    no-footer
    :is-opened="isOpened"
    :title="$t('role.select')"
    @close="$emit('close')"
    @confirm="$emit('close')"
  >
    <div class="list-container">
      {{ JSON.stringify(options) }}
      <div v-for="member in members" :key="member.id" class="member-item">
        <UserCardInline :user="member" />
        <GroupButton
          :model-value="member.role"
          :options="options"
          @update:model-value="setRole(member, $event)"
        />
      </div>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts" generic="T extends Roles">
import UserCardInline from '~/components/people/TeamCard/UserCardInline.vue'
import type { TranslatedPojectMember } from '~/models/project-member.model'
import { roleHelpI18n, roleI18n } from '~/functs/rolesUtils'
import type { Roles } from '~/models/types'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    members?: TranslatedPojectMember[]
    roles: T[]
  }>(),
  { members: () => [], isOpened: false }
)

defineEmits<{
  close: []
}>()

const options = computed(() => {
  return props.roles.map((role) => {
    return {
      value: role,
      label: roleI18n(role),
      help: roleHelpI18n(role),
    }
  })
})

const setRole = (member: TranslatedPojectMember, role: T) => {
  console.log(member, role)
}
</script>

<style lang="scss" scoped>
.member-item {
  display: grid;
  grid-template-rows: 1fr;
}
</style>
