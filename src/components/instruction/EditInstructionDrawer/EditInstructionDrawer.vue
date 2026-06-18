<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="invalid"
    :is-opened="isOpened"
    :title="$t('instructions.drawer.title')"
    class="instruction-drawer medium"
    :asyncing="asyncing"
    @confirm="onSubmit"
    @close="cancel"
  >
    <InstructionForm
      v-model="form"
      :instruction="instruction"
      class="instruction-form"
      @invalid="invalid = $event"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import type { InstructionInput, InstructionModel } from '~/models/instruction.model'

import { createInstruction, putInstruction } from '~/api/instruction.service'

import InstructionForm from '~/components/instruction/InstructionForm/InstructionForm.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'

withDefaults(
  defineProps<{
    instruction?: InstructionModel
    isOpened: boolean
  }>(),
  {
    instruction: null,
  }
)

const emit = defineEmits<{
  close: []
  'instruction-edited': [InstructionModel]
}>()

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()
const asyncing = ref(false)
const invalid = ref(false)
const form = ref<InstructionInput>()
const cancel = () => emit('close')

const createOrUpdate = () => {
  if (form.value.id) {
    // put but no patch ??
    return putInstruction(organizationCode, form.value.id, form.value)
  } else {
    return createInstruction(organizationCode, form.value)
  }
}

const onSubmit = () => {
  asyncing.value = true

  createOrUpdate()
    .then((newInstruction) => {
      toaster.pushSuccess(t('instructions.save.success'))
      emit('instruction-edited', newInstruction)
      emit('close')
    })
    .catch(() => toaster.pushError(t('instructions.save.error')))
    .finally(() => {
      asyncing.value = false
    })
}
</script>
