<template>
  <div class="instruction-excerpt-wrapper">
    <ContextActionMenu
      class="instruction-actions"
      :can-edit="canEditInstruction"
      :can-delete="canDeleteInstruction"
      @edit="$emit('edit-instruction', instruction)"
      @delete="$emit('delete-instruction', instruction)"
    />

    <LineClamped tag="p" :line-number="3">
      {{ instructionText }}
    </LineClamped>
  </div>
</template>

<script setup lang="ts">
import ContextActionMenu from '~/components/base/button/ContextActionMenu.vue'
import { cropIfTooLong, html2Text } from '~/functs/string'
import { InstructionModel } from '~/models/instruction.model'

const props = defineProps<{
  instruction: InstructionModel
}>()

defineEmits<{
  'delete-instruction': [InstructionModel]
  'edit-instruction': [InstructionModel]
}>()

const { canEditInstruction, canDeleteInstruction } = usePermissions()

const instructionText = computed(() => {
  return cropIfTooLong(html2Text(props.instruction.content), 255)
})
</script>

<style lang="scss" scoped>
.instruction-excerpt-wrapper {
  position: relative;
  padding-right: 1.4rem;
}

.instruction-actions {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
