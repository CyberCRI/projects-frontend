<template>
  <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
    <template #default>
      <InstructionAdminListItem
        v-for="instruction in diplayableInstructions"
        :key="instruction.id"
        :instruction="instruction"
        @edit-instruction="onEditInstruction"
        @delete-instruction="onDeleteInstruction"
      />
    </template>

    <template #footer>
      <LpiButton btn-icon="Plus" :label="$t('common.add')" @click="addInstruction" />
      <LinkButton
        btn-icon="ArrowRight"
        :label="$t('common.see-all')"
        :to="{ name: 'InstructionListPage' }"
      />
    </template>
  </AdminBlock>
  <EditInstructionDrawer
    :is-opened="!!editedInstruction"
    :instruction="editedInstruction"
    @close="editedInstruction = null"
    @instruction-edited="loadInstructions"
  />

  <ConfirmModal
    v-if="instructionToDelete"
    :content="$t('instructions.delete.message')"
    :title="$t('instructions.delete.title')"
    :asyncing="isDeletingInstruction"
    @cancel="instructionToDelete = null"
    @confirm="localDeleteInstruction"
  />
</template>

<script setup lang="ts">
import { defaultForm } from '@/components/instruction/InstructionForm/InstructionForm.vue'
import { getAllInstructions, deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster'

const toaster = useToasterStore()
const instructions = ref([])
const instructionsCount = ref(0)
const isLoading = ref(true)
const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)
const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()
const router = useRouter()

const blockTitle = computed(() => {
  const extra = isLoading.value ? '' : ` (${instructionsCount.value})`
  return t('admin.portal.instructions') + extra
})

const diplayableInstructions = computed(() => {
  return instructions.value.slice(0, 1)
})

const loadInstructions = async () => {
  isLoading.value = true
  const request = await getAllInstructions(organizationCode, {
    ordering: '-publication_date',
    limit: 1,
  })
  instructions.value = request.results
  instructionsCount.value = request.count
  isLoading.value = false
}

const addInstruction = () => {
  editedInstruction.value = defaultForm()
}

const onEditInstruction = (instruction) => {
  editedInstruction.value = instruction
}

const onDeleteInstruction = (instruction) => {
  instructionToDelete.value = instruction
}

const localDeleteInstruction = async () => {
  isDeletingInstruction.value = true
  try {
    await deleteInstruction(organizationCode, instructionToDelete.value.id)
    toaster.pushSuccess(t('instructions.delete.success'))
  } catch (err) {
    toaster.pushError(`${t('instructions.delete.error')} (${err})`)
    console.error(err)
  } finally {
    instructionToDelete.value = null
    isDeletingInstruction.value = false
    router.push({ name: 'InstructionListPage' })
  }
}

onMounted(async () => {
  await loadInstructions()
})
</script>
