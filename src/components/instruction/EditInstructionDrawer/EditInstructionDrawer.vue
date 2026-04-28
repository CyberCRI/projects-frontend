<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="invalid"
    :is-opened="isOpened"
    :title="$t('instructions.drawer.title')"
    class="instruction-drawer medium"
    :asyncing="asyncing"
    @confirm="saveInstruction"
    @close="cancel"
  >
    <InstructionForm
      ref="instructionForm"
      v-model="form"
      class="instruction-form"
      @invalid="invalid = $event"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import InstructionForm from '~/components/instruction/InstructionForm/InstructionForm.vue'
import { createInstruction, putInstruction } from '~/api/instruction.service'
import useToasterStore from '~/stores/useToaster'
import { InstructionModel } from '~/models/instruction.model'

const props = withDefaults(
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

const form = ref(null)
const asyncing = ref(false)
const invalid = ref(false)

watch(
  () => props.instruction,
  (instruction) => {
    if (instruction)
      form.value = {
        ...instruction,
        publication_date: new Date(instruction.publication_date),
        // only reduce to array if not already an object
        people_groups: instruction.people_groups.reduce
          ? instruction.people_groups.reduce((acc, group) => {
              acc[group.id] = true
              return acc
            }, {})
          : instruction.people_groups,
      }
  },
  { immediate: true }
)

const cancel = () => emit('close')

const instructionFormRef = useTemplateRef('instructionForm')

const saveInstruction = async () => {
  const isValid = await instructionFormRef.value.v$.$validate()
  if (!isValid) {
    return
  }
  asyncing.value = true

  try {
    const formData = {
      ...form.value,
      publication_date: form.value.publication_date.toISOString(),
      people_groups_ids: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    let savedInstruction: InstructionModel
    if (props.instruction?.id) {
      savedInstruction = await putInstruction(organizationCode, props.instruction.id, formData)
    } else {
      savedInstruction = await createInstruction(organizationCode, formData)
    }
    toaster.pushSuccess(t('instructions.save.success'))

    emit('instruction-edited', savedInstruction)
  } catch (err) {
    toaster.pushError(`${t('instructions.save.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    emit('close')
  }
}
</script>
