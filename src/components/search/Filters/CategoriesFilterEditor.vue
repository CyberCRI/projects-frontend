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
                @pick-category="toggleCategory"
                type="checkbox"
            />
        </ul>
    </div>
</template>

<script>
import CategoryPicker from '@/components/category/CategoryPicker.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'

export default {
    name: 'CategoriesFilterEditor',

    emits: ['update:modelValue'],

    components: {
        CategoryPicker,
    },
    setup() {
        const projectCategoriesStore = useProjectCategories()
        return {
            projectCategoriesStore,
        }
    },

    props: {
        modelValue: {
            type: Array,
            required: true,
        },
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

    methods: {
        isSelected(categoryId) {
            return this.selection.some((cat) => cat.id === categoryId)
        },

        toggleCategory(category) {
            if (this.isSelected(category.id)) {
                this.selection = this.selection.filter((cat) => cat.id !== category.id)
            } else {
                this.selection.push(category)
            }
            this.$emit('update:modelValue', this.selection)
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
