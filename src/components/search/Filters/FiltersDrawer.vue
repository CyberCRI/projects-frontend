<template>
    <Drawer
        v-if="mode"
        :confirm-action-name="$t('common.confirm')"
        :is-opened="isOpened"
        :title="drawerTitle"
        class="small"
        @close="close"
        @confirm="confirm"
    >
        <template v-if="focusedFilter || mode !== allFiltersMode" #header_prefix>
            <span class="icon-back" @click="closeFocusedOrModeFilter"
                ><IconImage name="ArrowLeft"
            /></span>
        </template>

        <template v-if="mode === allFiltersMode">
            <Component
                :is="filters[focusedFilter].componentEditor"
                v-if="focusedFilter"
                v-model="selection[focusedFilter]"
            />

            <div v-else v-for="(filter, key) in filters" :key="key" class="filter-wrapper">
                <FilterWrapper
                    v-if="filter.condition"
                    :filter-key="key"
                    :has-filters="hasFilters(key)"
                    :is-toggleable="filter.toggleable"
                    @toggle-filter="toggleFilter"
                >
                    <template #header>
                        {{ $filters.capitalize($t(`search.${filter.title}`)) }}
                    </template>
                    <component :is="filter.componentSummary" v-model="selection[key]" />
                </FilterWrapper>
            </div>
        </template>
        <template v-else>
            <Component :is="filters[mode].componentEditor" v-model="selection[mode]" />
        </template>
    </Drawer>
</template>

<script>
import Drawer from '@/components/base/BaseDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import FilterWrapper from '@/components/search/Filters/FilterWrapper.vue'
import { ALL_FILTERS_MODE } from '@/components/search/Filters/useContextualFilters.ts'
export default {
    name: 'FiltersDrawer',

    emits: ['confirm', 'close'],

    components: { FilterWrapper, Drawer, IconImage },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },

        mode: {
            type: [String, null],
            required: true,
        },

        filters: {
            type: Object,
            required: true,
        },

        preselection: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            selection: JSON.parse(JSON.stringify(this.preselection)),
            focusedFilter: null,
            allFiltersMode: ALL_FILTERS_MODE,
        }
    },

    computed: {
        drawerTitle() {
            if (this.mode === this.allFiltersMode) {
                if (this.focusedFilter) {
                    const title = this.filters[this.focusedFilter].title
                    return this.$t(`search.${title}`)
                }

                return this.$t('search.all-filters')
            }

            const title = this.filters[this.mode].title
            return this.$t(`search.${title}`)
        },
    },

    methods: {
        hasFilters(key) {
            return ['sdfs', 'languages'].includes(key) || this.selection[key]?.length > 0
        },
        confirm() {
            this.$emit('confirm', this.selection)
        },

        toggleFilter(filterKey) {
            this.focusedFilter = filterKey
        },

        closeFocusedOrModeFilter() {
            if (this.focusedFilter) this.focusedFilter = null
            else this.$emit('close')
        },

        close() {
            this.$emit('close')
        },
    },

    watch: {
        isOpened: function () {
            this.selection = JSON.parse(JSON.stringify(this.preselection))
            this.focusedFilter = null
        },
    },
}
</script>

<style lang="scss" scoped>
.icon-back {
    cursor: pointer;
    margin-right: $space-m;

    svg {
        fill: $primary-dark;
        width: 24px;
    }
}

.filter-wrapper {
    border-bottom: $border-width-s solid $primary;

    &:last-child {
        border-bottom: none;
    }

    &:first-child .header {
        margin-top: 0;
    }
}
</style>
@/components/search/Filters/filter-constants
