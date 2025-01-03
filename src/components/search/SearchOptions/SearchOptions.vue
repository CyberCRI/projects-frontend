<template>
    <div class="search-block">
        <div class="search-container">
            <div class="search-group">
                <SearchInput
                    class="search-input"
                    v-model="selectedQuery"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="deleteQuery"
                    @keyup.enter="emitSearchOptionsUpdated"
                />
            </div>
        </div>

        <SearchFilters
            ref="searchFilters"
            v-model:selected-filters="selectedFilters"
            v-model:selected-section="selectedSection"
            :search="search"
            :show-section-filter="showSectionFilter"
            :filter-black-list="filterBlackList"
            @search-filters-inited="filtersInited = $event"
        />
    </div>
</template>

<script>
import SearchInput from '@/components/base/form/SearchInput.vue'
import SearchFilters from '@/components/search/Filters/SearchFilters.vue'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'SearchOptions',

    emits: ['search-options-updated', 'filter-section-update'],

    components: {
        SearchInput,
        SearchFilters,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },

    props: {
        search: {
            type: Object, // here filters are array of id (whereas in slectedFiletrs they are array of object)
            default: null,
        },

        showSectionFilter: {
            type: Boolean,
            default: false,
        },

        section: {
            type: String,
            default: ALL_SECTION_KEY,
        },

        filterBlackList: {
            // filters we dont want to show/edit but are still active (i.e. categories in category page)
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            areSectionAndQueryInited: false,
            filtersInited: false,
            // here filters are array of object (whereas in search they are array of id)
            selectedFilters: {},
            selectedQuery: '',
            selectedSection: ALL_SECTION_KEY,
        }
    },

    computed: {
        allInited() {
            return this.areSectionAndQueryInited && this.filtersInited
        },
    },

    async mounted() {
        await this.initFilters()
    },

    methods: {
        async initFilters() {
            // converts host component "search" (arrays of id)
            // to arrays of object (needed in this component for displayinf them)

            const rawFilters = this.search || {}

            // this must be done before the other filters
            // since it trigger a search parameters reset
            // (i.e. in category page search we should not reset the category filter)
            this.selectedSection = this.$route.query.section || this.section || ALL_SECTION_KEY

            this.selectedQuery = rawFilters.search || ''

            this.areSectionAndQueryInited = true
        },
        adaptToParent() {
            const filters = {
                search: this.selectedQuery,
                section: this.selectedSection,
                ...this.selectedFilters,
            }
            const adaptedFilters = {
                search: filters.search,
                section: filters.section,
                categories: filters.categories?.map((cat) => cat.id) || [],
                languages: filters.languages ? [...filters.languages] : [], // need to deconstruct to avoid reactivity issue when removing language
                sdgs: filters.sdgs ? [...filters.sdgs] : [], // need to deconstruct to avoid reactivity issue when removing sdg
                tags: filters.tags?.map((tag) => tag.id) || [],
                organizations: [this.organizationsStore.current.code],
                skills: filters.skills?.map((tag) => tag.id) || [],
            }
            return adaptedFilters
        },

        deleteQuery() {
            this.selectedQuery = ''
            this.emitSearchOptionsUpdated()
        },

        emitSearchOptionsUpdated() {
            this.$emit('search-options-updated', this.adaptToParent())
        },

        // this method is used by CategoriesPage and GroupsPage via a ref
        // eslint-disable-next-line vue/no-unused-properties
        clearSelectedFilters() {
            this.$refs.searchFilters?.clearSelectedFilters()
        },
    },

    watch: {
        selectedSection: function () {
            this.emitSearchOptionsUpdated()
        },

        selectedFilters: {
            handler() {
                if (!this.allInited) return
                // convert object to their id as it what's is expected by host components
                this.emitSearchOptionsUpdated()
            },
            deep: true,
        },

        selectedQuery: {
            handler() {
                this.emitSearchOptionsUpdated()
            },
        },
        'search.section': {
            handler: function (neo) {
                this.selectedSection = neo || ALL_SECTION_KEY
            },
            immediate: true,
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
