<template>
  <div class="instruction-excerpt-wrapper">
    <ContextActionMenu
      class="instruction-actions"
      :can-edit="canEditInstruction"
      :can-delete="canDeleteInstruction"
      @edit="$emit('edit-instruction', instruction)"
      @delete="$emit('delete-instruction', instruction)"
    />

    <p class="clamped">
      {{ instructionText }}
    </p>
  </div>
</template>
<script>
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'

export default {
  name: 'InstructionAdminListItem',

  components: {
    ContextActionMenu,
  },

  props: {
    instruction: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['delete-instruction', 'edit-instruction'],

  setup() {
    const { canEditInstruction, canDeleteInstruction } = usePermissions()
    return { canEditInstruction, canDeleteInstruction }
  },

  computed: {
    instructionText() {
      return this.instruction.content.replace(/<[^>]+>/g, ' ').substring(0, 255)
    },
  },
}
</script>
<style lang="scss" scoped>
.instruction-excerpt-wrapper {
  position: relative;
  padding-right: 1.4rem;
}

.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.instruction-actions {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
