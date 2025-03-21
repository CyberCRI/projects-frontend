<template>
  <div class="filter-categories-selected">
    <FilterValue
      v-for="category in selection"
      :key="category.id"
      class="actionable"
      icon="Close"
      :label="category.name"
      @click="removeCategory(category)"
    />
  </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'

export default {
  name: 'CategoriesFilterSummary',

  components: {
    FilterValue,
  },

  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  data: () => {
    return {
      selection: [],
    }
  },

  watch: {
    modelValue: {
      handler: function (neo, old) {
        if (neo && neo != old) {
          this.selection = [...neo]
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    removeCategory(category) {
      this.selection = this.selection.filter((cat) => cat.id !== category.id)
      this.$emit('update:modelValue', this.selection)
    },
  },
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
