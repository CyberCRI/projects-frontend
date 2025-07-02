<template>
  <div class="filter-categories">
    <!--CategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
            :selected="isSelected(category.id)"
            size="extra-small"
            @go-to="toggleCategory(category)"
        /-->
    <ul>
      <CategoryPicker
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :selected-categories="modelValue"
        type="checkbox"
        @pick-category="toggleCategory"
      />
    </ul>
  </div>
</template>

<script>
import CategoryPicker from '@/components/category/CategoryPicker.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'

export default {
  name: 'CategoriesFilterEditor',

  components: {
    CategoryPicker,
  },

  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },

  emits: ['update:modelValue'],
  setup() {
    const projectCategoriesStore = useProjectCategories()
    return {
      projectCategoriesStore,
    }
  },

  data: () => {
    return {
      selection: [],
      categorySearch: '',
    }
  },

  computed: {
    categories() {
      return this.projectCategoriesStore.hierarchy
    },
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
    isSelected(categoryId) {
      return this.selection.some((cat) => cat.id === categoryId)
    },

    toggleCategory(category) {
      if (this.isSelected(category.id)) {
        this.selection = this.selection.filter((cat) => cat.id !== category.id)
      } else {
        this.recursivelySelect(category)
      }
      this.$emit('update:modelValue', this.selection)
    },

    recursivelySelect(category) {
      this.selection.push(category)
      category.children?.forEach((child) => {
        this.recursivelySelect(child)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.filter-categories {
  display: flex;
  justify-content: stretch;

  > ul {
    flex-grow: 1;
  }
}
</style>
