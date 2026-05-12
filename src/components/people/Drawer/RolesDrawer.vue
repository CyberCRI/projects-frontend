<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('role.select')"
    class="medium"
    @close="$emit('close')"
    @confirm="confirm"
  >
    <div class="list-container">
      <!-- help roles -->
      <ContentExpandable :height-limit="remToPx(2)">
        <h3>
          <IconImage name="HelpCircle" class="icon" />
          {{ $t('role.help') }}
        </h3>
        <TableInfo :options="options" />
      </ContentExpandable>

      <div v-for="member in members" :key="member.id" class="member-item">
        <UserCardInline :user="member" />
        <div class="role-select">
          <GroupButton v-model="rolesValue[member.id]" :options="options" />
        </div>
      </div>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts" generic="T extends Roles">
import UserCardInline from '~/components/people/TeamCard/UserCardInline.vue'
import type { TranslatedPojectMember } from '~/models/project-member.model'
import { roleHelpI18n, roleI18n } from '~/functs/rolesUtils'
import TableInfo from '~/components/base/TableInfo.vue'
import type { Roles } from '~/models/types'
import { remToPx } from '~/functs/style'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    members?: TranslatedPojectMember[]
    roles: T[]
  }>(),
  { members: () => [], isOpened: false }
)

type RoleUser = {
  // key is user.id, and T is the role
  [key: number]: T
}

const emit = defineEmits<{
  close: []
  update: [RoleUser]
}>()

const rolesValue = ref<RoleUser>()
watch(
  () => props.members,
  () => {
    const roles = {}
    props.members.forEach((member) => {
      roles[member.id] = rolesValue?.[member.id] ?? member.role
    })
    rolesValue.value = roles
  },
  { immediate: true, deep: true }
)

const options = computed(() => {
  return props.roles.map((role) => {
    return {
      value: role,
      label: roleI18n(role),
      description: roleHelpI18n(role),
    }
  })
})

const confirm = () => {
  emit('update', rolesValue.value)
  emit('close')
}
</script>

<style lang="scss" scoped>
.member-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.role-select {
  height: fit-content;
}
</style>
