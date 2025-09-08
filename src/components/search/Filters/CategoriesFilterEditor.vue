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
        this.recursivelyUnselect(category)
      } else {
        this.recursivelySelect(category)
      }
      this.$emit('update:modelValue', this.selection)
    },

    recursivelySelect(category) {
      const selectionMap = this.getSelectionMap()
      const descendantMap = this.getDescendantMap(category)
      descendantMap.forEach((v, k) => {
        selectionMap.set(k, v)
      })
      this.selection = [...selectionMap.values()]
    },

    recursivelyUnselect(category) {
      const selectionMap = this.getSelectionMap()
      const descendantMap = this.getDescendantMap(category)
      descendantMap.forEach((v, k) => {
        selectionMap.delete(k)
      })
      this.selection = [...selectionMap.values()]
    },

    getSelectionMap() {
      return this.selection.reduce((map, item) => {
        map.set(item.id, item)
        return map
      }, new Map())
    },

    getDescendantMap(category) {
      const res = new Map()
      const iterate = (c) => {
        res.set(c.id, c)
        c.children?.forEach(iterate)
      }
      iterate(category)
      return res
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
