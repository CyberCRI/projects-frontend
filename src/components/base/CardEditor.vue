<template>
  <div class="project-team-editor">
    <ContextActionMenuInline
      class="actions"
      :can-delete="canDelete"
      :can-edit="canEdit"
      @edit="$emit('edit')"
      @delete="$emit('delete')"
    />
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'

withDefaults(
  defineProps<{
    canDelete?: boolean
    canEdit?: boolean
  }>(),
  {
    canDelete: false,
    canEdit: false,
  }
)

defineEmits<{
  delete: []
  edit: []
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
