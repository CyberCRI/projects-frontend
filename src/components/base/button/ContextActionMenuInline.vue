<template>
  <div class="context-action-menu-inline">
    <LpiButton
      v-if="canEdit"
      btn-icon="Pen"
      :aria-label="$t('common.edit')"
      class="skeletons-background"
      @click.prevent="$emit('edit')"
    />
    <LpiButton
      v-if="canDelete"
      btn-icon="Close"
      :aria-label="$t('common.delete')"
      class="skeletons-background"
      @click.prevent="$emit('delete')"
    />
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  {
    canEdit: false,
    canDelete: false,
  }
)
defineEmits<{
  delete: []
  edit: []
}>()
</script>
<style lang="scss" scoped>
.context-action-menu-inline {
  pointer-events: all;
  display: flex;
  justify-content: center;
  gap: 0.3rem;

  & > * {
    width: 25px !important;
    height: 25px !important;
  }
}
</style>
