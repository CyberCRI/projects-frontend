<template>
  <div class="filter-categories-selected">
    <FilterValue
      v-for="category in model"
      :key="category.id"
      class="actionable"
      icon="Close"
      :label="category.name"
      @click="removeCategory(category)"
    />
  </div>
</template>

<script setup lang="ts">
import FilterValue from '~/components/search/Filters/FilterValue.vue'

const model = defineModel<any[]>({ default: [] })

const removeCategory = (category) => {
  model.value = model.value.filter((cat) => cat.id !== category.id)
}
</script>

<style scoped lang="scss">
.filter-categories-selected,
.filter-categories-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2xs;
}
</style>
