<script setup lang="ts">
import LpiSelect from '~/components/base/form/LpiSelect.vue'

withDefaults(
  defineProps<{
    editable?: boolean
    addLabel?: string
    pagination?: Pagination
  }>(),
  {
    editable: true,
    addLabel: null,
    pagination: null,
  }
)

defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="header-container">
    <div />
    <LpiButton
      v-if="editable"
      class="skeletons-background"
      btn-icon="Plus"
      :label="addLabel ?? $t('common.add')"
      @click="$emit('add')"
    />
    <LpiSelect
      v-if="pagination"
      class="pagination-limit small skeletons-background"
      :model-value="pagination.limit.value"
      :title="$t('pagination.visibylity-per-par')"
      :options="[
        { value: 10, label: '10' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
      ]"
      @update:model-value="pagination.setLimit"
    />
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto;
  margin-bottom: 1rem;
  gap: 1rem;
}
</style>
