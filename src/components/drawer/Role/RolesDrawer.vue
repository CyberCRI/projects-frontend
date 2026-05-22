<script
  setup
  lang="ts"
  generic="Item extends { id: number | string; role?: string }, Role extends Roles"
>
import { roleHelpI18n, roleI18n } from '~/functs/rolesUtils'
import TableInfo from '~/components/base/TableInfo.vue'
import type { Roles } from '~/models/types'
import { remToPx } from '~/functs/style'
import { isEqual } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    items?: Item[]
    roles: Role[]
    defaultRole?: Role
    asyncing?: boolean
  }>(),
  { items: () => [], isOpened: false, asyncing: false, defaultRole: null }
)

type RoleUser = {
  // key is user.id, and T is the role
  [key: number]: Role
}

const emit = defineEmits<{
  close: []
  update: [RoleUser]
}>()

const { stateModals, closeModals, openModals } = useModals({ saveChange: false })

const rolesValue = ref<RoleUser>()

const generateMappingRoles = (defaultRole: Role) => {
  const roles = {}
  props.items.forEach((member) => {
    // if role not exists, default to selected roles
    let userRole = rolesValue?.[member.id] ?? member.role
    if (!userRole || !props.roles.includes(userRole)) {
      userRole = defaultRole
    }
    roles[member.id] = userRole
  })
  return roles
}
watch(
  () => [props.items, props.roles],
  () => (rolesValue.value = generateMappingRoles(props.defaultRole || props.roles[0])),
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

// check is equal ( pass null in role to default mapping roles to null (for first add elements))
const isFormEqual = computed(() => isEqual(rolesValue.value, generateMappingRoles(null)))

const close = () => {
  closeModals('saveChange')
  emit('close')
}

const confirm = () => {
  emit('update', rolesValue.value)
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}
</script>

<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t('role.select')"
    class="medium"
    :confirm-action-disabled="isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="confirm"
  >
    <div class="list-container">
      <!-- help roles -->
      <ContentExpandable :height-limit="remToPx(2)" opened>
        <h3>
          <IconImage name="HelpCircle" class="icon" />
          {{ $t('role.help') }}
        </h3>
        <TableInfo :options="options" />
      </ContentExpandable>

      <div v-for="item in items" :key="item.id" class="member-item">
        <slot :item="item" />
        <div class="role-select">
          <GroupButton v-model="rolesValue[item.id]" :options="options" />
        </div>
      </div>
    </div>
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>

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
