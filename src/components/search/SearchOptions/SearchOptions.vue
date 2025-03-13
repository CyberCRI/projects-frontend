<template>
    <div class="search-block">
        <div class="search-container">
            <div class="search-group">
                <SearchInput
                    class="search-input"
                    :model-value="searchFromQuery.search"
                    @update:model-value="updateSelectedQuery"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="deleteQuery"
                />
            </div>
        </div>

        <SearchFilters
            ref="searchFilters"
            @update:selected-filters="updatdeSelectedFilters"
            :selected-section="section || searchFromQuery.section"
            @update:selected-section="updatdeSelectedSection"
            :search="searchFromQuery"
            :show-section-filter="showSectionFilter"
            :filter-black-list="filterBlackList"
        />
    </div>
</template>

<script>
import SearchInput from '@/components/base/form/SearchInput.vue'
import SearchFilters from '@/components/search/Filters/SearchFilters.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useSearch from '@/composables/useSearch.js'

export default {
    name: 'SearchOptions',

    emits: ['search-options-updated', 'filter-section-update'],

    components: {
        SearchInput,
        SearchFilters,
    },
    setup(props) {
        const organizationsStore = useOrganizationsStore()

        const {
            searchFromQuery,
            updateSelectedQuery,
            updatdeSelectedFilters,
            updatdeSelectedSection,
        } = useSearch(props.section)
        return {
            organizationsStore,
            searchFromQuery,
            updateSelectedQuery,
            updatdeSelectedFilters,
            updatdeSelectedSection,
        }
    },

    props: {
        showSectionFilter: {
            type: Boolean,
            default: false,
        },

        section: {
            type: [String, null],
            default: null, // ALL_SECTION_KEY,
        },

        filterBlackList: {
            // filters we dont want to show/edit but are still active (i.e. categories in category page)
            type: Array,
            default: () => [],
        },
    },

    methods: {
        deleteQuery() {
            this.updateSelectedQuery('')
        },
        // this method is used by CategoriesPage and GroupsPage via a ref
        // eslint-disable-next-line vue/no-unused-properties
        clearSelectedFilters() {
            this.$refs.searchFilters?.clearSelectedFilters()
        },
    },
}
</script>

<style lang="scss" scoped>
.search-block {
    margin: 0;
    padding: $space-m 0;
    width: 100%;
}

.search-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-direction: unset;

    .search-group {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: $min-tablet) {
            flex-direction: row;
            width: 100%;
            justify-content: center;
        }
    }
}

.search-input {
    margin-bottom: $space-m;
    width: pxToRem(600px); // drop is 250px so 350 + 250 = 600

    @media (max-width: $min-tablet) {
        width: 100%;
    }

    @media (min-width: $min-tablet) {
        margin-bottom: 0;
    }
}
</style>
