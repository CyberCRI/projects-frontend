<template>
  <AdminBlock :block-title="blockTitle">
    <template #default>
      <FetchLoader :status="status" only-error skeleton>
        <InstructionAdminListItem
          v-for="instruction in instructions"
          :key="instruction.id"
          :instruction="instruction"
          @edit-instruction="onEditInstruction"
          @delete-instruction="onDeleteInstruction"
        />
        <EmptyLabel v-if="instructions.length === 0" />
      </FetchLoader>
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
    @instruction-edited="() => refresh()"
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
import { instructionSkeleton } from '~/skeletons/instructions.skeletons'
import { getAllInstructions } from '@/api/v2/instruction.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { deleteInstruction } from '@/api/instruction.service'
import useToasterStore from '@/stores/useToaster'
import { defaultForm } from '@/form/instruction'

const toaster = useToasterStore()
const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)
const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()
const router = useRouter()

const LIMIT = 3
const {
  status,
  data: instructions,
  isLoading,
  refresh,
} = getAllInstructions(organizationCode, {
  query: {
    ordering: '-updated_at',
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(instructionSkeleton, LIMIT),
})

const blockTitle = computed(() => {
  const extra = isLoading.value ? '' : ` (${instructions.value.length})`
  return t('admin.portal.instructions') + extra
})

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
</script>
