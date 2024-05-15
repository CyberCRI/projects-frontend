<template>
    <div class="filter-categories-selected">
        <FilterValue
            v-for="category in selection"
            @click="removeCategory(category)"
            :key="category.id"
            class="actionable"
            icon="Close"
            :label="category.name"
        />
    </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'

export default {
    name: 'CategoriesFilterSummary',

    emits: ['update:modelValue'],

    components: {
        FilterValue,
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
        }
    },

    methods: {
        removeCategory(category) {
            this.selection = this.selection.filter((cat) => cat.id !== category.id)
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
.filter-categories-selected,
.filter-categories-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2xs;
}
</style>
