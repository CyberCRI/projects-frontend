<template>
  <div class="project-team-editor">
    <div class="actions">
      <ContextActionButton
        v-if="canBeRemoved"
        action-icon="Close"
        class="remove-btn small"
        @click="$emit('remove-user')"
      />
      <ContextActionButton
        v-if="canBeEdited"
        action-icon="Pen"
        class="edit-btn small"
        @click="$emit('edit-user')"
      />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

withDefaults(
  defineProps<{
    canBeRemoved?: boolean
    canBeEdited?: boolean
  }>(),
  {
    canBeRemoved: false,
    canBeEdited: false,
  }
)

defineEmits<{
  'remove-user': []
  'edit-user': []
}>()
</script>

<style lang="scss" scoped>
.project-team-editor {
  display: inline-block;
  position: relative;
  width: min-content;

  .actions {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    justify-content: flex-end;
    gap: $space-m;
    z-index: 10;
    transform: translate(0, -50%);
  }
}
</style>
