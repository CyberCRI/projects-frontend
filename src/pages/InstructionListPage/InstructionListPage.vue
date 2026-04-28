<script setup lang="ts">
import type { QueryFilterInstruction } from '~/models/instruction.model'

import { getAllInstructions } from '~/api/v2/instruction.service'
import { deleteInstruction } from '~/api/instruction.service'

import FetchLoader from '~/components/base/FetchLoader.vue'

import useToasterStore from '~/stores/useToaster'

import { instructionSkeleton } from '~/skeletons/instructions.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { nowDate } from '~/functs/date'

const toaster = useToasterStore()
const { canCreateInstruction, canEditInstruction, canDeleteInstruction } = usePermissions()
const { t } = useNuxtI18n()

const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)

const organizationCode = useOrganizationCode()

const { query, setQuery, removeQuery } = useQuery<QueryFilterInstruction>({
  ordering: '-publication_date',
})

// if user as not right permissions, add filter from_date
watchEffect(() => {
  if (!canEditInstruction.value && !canDeleteInstruction.value) {
    setQuery('from_date', nowDate().toISOString())
  } else {
    removeQuery('from_date')
  }
})

const {
  status,
  data: instructions,
  pagination,
  refresh,
  isLoading,
} = getAllInstructions(organizationCode, {
  query,
  default: () => factoryPagination(instructionSkeleton),
})

const doDeleteInstruction = async () => {
  isDeletingInstruction.value = true
  try {
    await deleteInstruction(organizationCode, instructionToDelete.value.id)
    toaster.pushSuccess(t('instructions.delete.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('instructions.delete.error')} (${err})`)
    console.error(err)
  } finally {
    instructionToDelete.value = null
    isDeletingInstruction.value = false
  }
}

useLpiHead2({
  title: computed(() => t('instructions.list.title')),
})
</script>

<template>
  <div class="instruction-list-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('instructions.list.title') }}
    </h1>

    <LpiButton
      v-if="canCreateInstruction"
      :disabled="isLoading"
      primary
      :label="$t('instructions.list.create')"
      data-test="create-instruction-button"
      btn-icon="Plus"
      class="create-instruction-button"
      :to="{
        name: 'CreateInstructionPage',
      }"
    />
    <div class="instruction-list">
      <FetchLoader :status="status" only-error skeleton>
        <InstructionListItem
          v-for="instruction in instructions"
          :key="instruction.id"
          :instruction="instruction"
          @edit-instruction="editedInstruction = instruction"
          @delete-instruction="instructionToDelete = instruction"
        />
        <EmptyLabel v-if="instructions.length === 0" :label="$t('instructions.empty')" />
        <PaginationButtonsV2 :pagination="pagination" />
      </FetchLoader>
    </div>
  </div>
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
    @confirm="doDeleteInstruction"
  />
</template>
<style lang="scss" scoped>
.page-title {
  margin-bottom: $space-2xl;
}

.create-instruction-button {
  align-self: flex-end;
}

.instruction-list-page,
.instruction-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}
</style>
