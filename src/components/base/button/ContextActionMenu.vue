<template>
  <MenuTip>
    <template #custom-content>
      <div class="context-action-menu">
        <slot>
          <ContextActionButton
            v-if="canEdit"
            action-icon="Pen"
            class="edit-btn"
            secondary
            no-border
            :action-label="$t('common.edit')"
            @click.stop.prevent="$emit('edit')"
          />
          <ContextActionButton
            v-if="canDelete"
            action-icon="Close"
            class="remove-btn"
            secondary
            no-border
            :action-label="$t('common.delete')"
            @click.stop.prevent="$emit('delete')"
          />
        </slot>
      </div>
    </template>
    <ContextActionButton secondary no-border action-icon="DotsHorizontal" class="remove-btn" />
  </MenuTip>
</template>
<script setup lang="ts">
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import MenuTip from '@/components/base/MenuTip.vue'

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
.context-action-menu {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-s;
}
</style>
