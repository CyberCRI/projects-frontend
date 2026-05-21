<script setup lang="ts">
import UserSelection from '~/components/drawer/User/UserSelection.vue'
import type { QueryFilterSearch } from '~/models/search.model'
import type { TranslatedUserModel } from '~/models/user.model'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    label?: string
    asyncing?: boolean
    selectedUsers?: TranslatedUserModel[]
    query?: QueryFilterSearch
  }>(),
  {
    isOpened: false,
    label: null,
    asyncing: false,
    selectedUsers: () => [],
    query: () => ({}),
  }
)

const emit = defineEmits<{
  close: []
  submit: [TranslatedUserModel[]]
}>()

const { stateModals, openModals, closeModals } = useModals({ saveChange: false })

const users = ref<TranslatedUserModel[]>([])
watch(
  () => [props.selectedUsers, props.isOpened],
  () => (users.value = [...props.selectedUsers]),
  { immediate: true }
)

const isFormEqual = computed(() => users.value.length === 0)

const close = () => {
  closeModals('saveChange')
  emit('close')
}
const onConfirm = () => emit('submit', users.value)

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
    :confirm-action-name="$t('common.add')"
    :is-opened="isOpened"
    :title="label || $t('drawer.member.add', 2)"
    class="team-modal large"
    :confirm-action-disabled="isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="onConfirm"
  >
    <UserSelection v-model="users" :query="query" />
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>
