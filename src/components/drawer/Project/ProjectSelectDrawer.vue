<script setup lang="ts">
import ProjectSelection from '~/components/drawer/Project/ProjectSelection.vue'
import type { TranslatedProject } from '~/models/project.model'
import type { QueryFilterSearch } from '~/models/search.model'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    label?: string
    asyncing?: boolean
    selectedProjects?: TranslatedProject[]
    query?: QueryFilterSearch
  }>(),
  {
    isOpened: false,
    label: null,
    asyncing: false,
    selectedProjects: () => [],
    query: () => ({}),
  }
)

const emit = defineEmits<{
  close: []
  submit: [TranslatedProject[]]
}>()

const { stateModals, openModals, closeModals } = useModals({ saveChange: false })

const projects = ref<TranslatedProject[]>([])
watch(
  () => [props.selectedProjects, props.isOpened],
  () => (projects.value = [...props.selectedProjects]),
  { immediate: true }
)

const isFormEqual = computed(() => projects.value.length === 0)

const close = () => {
  closeModals('saveChange')
  emit('close')
}
const onConfirm = () => emit('submit', projects.value)

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
    :title="label || $t('drawer.project.add', 2)"
    class="team-modal large"
    :confirm-action-disabled="isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="onConfirm"
  >
    <ProjectSelection v-model="projects" :query="query" />
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>
