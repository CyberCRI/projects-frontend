<template>
  <BaseListSummaryBlock
    :title="$t(`home.short-title.instructions`)"
    :items="instructions"
    :inlined="inlined"
  >
    <template #default>
      <InstructionItem
        v-for="instruction in instructions"
        :key="instruction.id"
        :instruction="instruction"
        @edit-instruction="editedInstruction = instruction"
        @delete-instruction="instructionToDelete = instruction"
      />

      <EditInstructionDrawer
        :is-opened="!!editedInstruction"
        :instruction="editedInstruction"
        @close="editedInstruction = null"
        @instruction-edited="$emit('reload-instructions')"
      />

      <ConfirmModal
        v-if="instructionToDelete"
        :content="$t('instructions.delete.message')"
        :title="$t('instructions.delete.title')"
        :asyncing="isDeletingInstruction"
        @cancel="instructionToDelete = null"
        @confirm="onDeleteInstruction"
      />
    </template>

    <template #action>
      <SummaryAction
        :to="{ name: 'InstructionListPage' }"
        action-icon="ArrowRight"
        :action-label="$t('feed.see-all')"
      />
    </template>
  </BaseListSummaryBlock>
</template>

<script setup lang="ts">
import { deleteInstruction } from '~/api/instruction.service'

import EditInstructionDrawer from '~/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'
import BaseListSummaryBlock from '~/components/home/SummaryCards/BaseListSummaryBlock.vue'
import InstructionItem from '~/components/home/SummaryCards/InstructionItem.vue'
import SummaryAction from '~/components/home/SummaryCards/SummaryAction.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'

import type { TranslatedInstruction } from '~/models/instruction.model'
import useToasterStore from '~/stores/useToaster'

withDefaults(
  defineProps<{
    instructions?: TranslatedInstruction[]
    inlined?: boolean
  }>(),
  {
    instructions: () => [],
    inlined: false,
  }
)

const emit = defineEmits<{
  'reload-instructions': []
}>()

const { t } = useNuxtI18n()

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const editedInstruction = ref(null)
const instructionToDelete = ref(null)
const isDeletingInstruction = ref(false)

const onDeleteInstruction = async () => {
  // TODO: delete intstuction
  console.log('delete instruction', instructionToDelete.value)
  isDeletingInstruction.value = true
  try {
    await deleteInstruction(organizationCode, instructionToDelete.value.id)
    toaster.pushSuccess(t('instructions.delete.success'))

    emit('reload-instructions')
  } catch (err) {
    toaster.pushError(`${t('instructions.delete.error')} (${err})`)
    console.error(err)
  } finally {
    instructionToDelete.value = null
    isDeletingInstruction.value = false
  }
}
</script>
