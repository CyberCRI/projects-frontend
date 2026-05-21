<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import GroupSelection from '~/components/drawer/Group/GroupSelection.vue'
import type { QueryFilterSearch } from '~/models/search.model'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    label?: string
    asyncing?: boolean
    selectedGroups?: TranslatedPeopleGroupModel[]
    query?: QueryFilterSearch
    multiple?: boolean
  }>(),
  {
    isOpened: false,
    label: null,
    asyncing: false,
    multiple: true,
    selectedGroups: () => [],
    query: () => ({}),
  }
)

type EmitType = {
  close: []
  submit: [TranslatedPeopleGroupModel[] | TranslatedPeopleGroupModel]
}
const emit = defineEmits<EmitType>()

const { stateModals, openModals, closeModals } = useModals({ saveChange: false })

const groups = ref<TranslatedPeopleGroupModel[]>([])
watch(
  () => [props.selectedGroups, props.isOpened],
  () => (groups.value = [...props.selectedGroups]),
  { immediate: true }
)

const isFormEqual = computed(() => groups.value.length === 0)

const close = () => {
  closeModals('saveChange')
  emit('close')
}
// TODO type this change
const onConfirm = () => {
  if (props.multiple) {
    emit('submit', groups.value)
  } else {
    emit('submit', groups.value[0])
  }
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

watchEffect(() => {
  if (groups.value.length === 1 && props.multiple === false) {
    onConfirm()
  }
})
</script>

<template>
  <BaseDrawer
    :confirm-action-name="$t('common.add')"
    :is-opened="isOpened"
    :title="label || $t('drawer.group.add', 2)"
    class="team-modal large"
    :confirm-action-disabled="isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="onConfirm"
  >
    <GroupSelection v-model="groups" :query="query" :multiple="multiple" />
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>
