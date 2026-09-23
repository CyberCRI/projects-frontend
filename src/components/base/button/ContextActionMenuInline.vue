<template>
  <div class="context-action-menu-inline">
    <slot />
    <LpiButton
      v-if="canEdit || showEmpty"
      btn-icon="Pen"
      :aria-label="$t('common.edit')"
      class="skeletons-background"
      data-test="action-edit"
      :class="{
        'empty-button': !canEdit && showEmpty,
      }"
      @click.prevent="$emit('edit')"
    />
    <LpiButton
      v-if="canDelete || showEmpty"
      btn-icon="TrashCanOutline"
      :aria-label="$t('common.delete')"
      class="skeletons-background"
      data-test="action-delete"
      :class="{
        'empty-button': !canDelete && showEmpty,
      }"
      @click.prevent="$emit('delete')"
    />
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    canEdit?: boolean
    canDelete?: boolean
    showEmpty?: boolean
  }>(),
  {
    canEdit: false,
    canDelete: false,
    showEmpty: false,
  }
)
defineEmits<{
  delete: []
  edit: []
}>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

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

.empty-button {
  opacity: 0;
  pointer-events: none;
  user-select: none;
}
</style>
