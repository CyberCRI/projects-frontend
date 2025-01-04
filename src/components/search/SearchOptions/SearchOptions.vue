<template>
    <div class="search-block">
        <div class="search-container">
            <div class="search-group">
                <SearchInput
                    class="search-input"
                    :modelValue="selectedQuery"
                    @update:modelValue="updateSelectedQuery"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="deleteQuery"
                    @keyup.enter="emitSearchOptionsUpdated"
                />
            </div>
        </div>

        <SearchFilters
            ref="searchFilters"
            :selectedFilters="searchFromQuery"
            :selectedSection="selectedSection"
            @update:selectedFilters="updatdeSelectedFilters"
            @update:selectedSection="updatdeSelectedSection"
            :search="searchFromQuery"
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
            type: [String, null],
            default: null, // ALL_SECTION_KEY,
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

        searchFromQuery() {
            const res = {}
            const validMap = this.getValidQueryParams(
                this.selectedSection || this.section,
                !this.section
            )
            for (const [key, isValid] of Object.entries(validMap)) {
                const defaultValue = key === 'page' ? '1' : ''

                const val = this.$route.query[key]
                if (isValid && val && val !== defaultValue) res[key] = val
            }

            for (const arrKey of ['categories', 'tags', 'skills', 'languages', 'sdgs']) {
                if (res[arrKey] && !Array.isArray(res[arrKey])) {
                    res[arrKey] = [res[arrKey]]
                }
            }
            return res
        },
    },

    async mounted() {
        await this.initFilters()
    },

    methods: {
        // TODO debounce
        updateSelectedQuery(search) {
            const query = { ...this.$route.query } // destructure to break reactivity
            const oldSearch = query.search || ''
            const _search = search || ''
            if (_search !== query.search) {
                if (!_search) {
                    delete query.search
                } else {
                    query.search = _search
                }
                this.$router.replace({ path: this.$route.path, query: query })
            }
        },

        getValidQueryParams(section, allowSection = true) {
            // compute allowed filters according to current section
            // so that filter of one section (ie skills on people) dont persist on other section (ie skills on project)
            const isProject = section === 'projects'
            const isPeople = section === 'people'
            const map = {
                search: true,
                categories: isProject,
                tags: isProject,
                members: false,
                sdgs: isProject || isPeople,
                languages: isProject,
                skills: isPeople,
                page: true,
                section: allowSection,
            }

            return map
        },

        adaptFilers(filters) {
            // const filters = {
            //     search: this.selectedQuery,
            //     section: this.selectedSection,
            //     ...this.selectedFilters,
            // }
            const adaptedFilters = {
                // search: filters.search,
                // section: filters.section,
                categories: filters.categories?.map((cat) => cat.id) || [],
                languages: filters.languages ? [...filters.languages] : [], // need to deconstruct to avoid reactivity issue when removing language
                sdgs: filters.sdgs ? [...filters.sdgs] : [], // need to deconstruct to avoid reactivity issue when removing sdg
                tags: filters.tags?.map((tag) => tag.id) || [],
                organizations: [this.organizationsStore.current.code],
                skills: filters.skills?.map((tag) => tag.id) || [],
            }
            return adaptedFilters
        },

        updatdeSelectedFilters(rawFilters) {
            const filters = this.adaptFilers(rawFilters)
            // console.log('filters', filters)
            const query = { ...this.$route.query } // destructure to break reactivity
            const validMap = this.getValidQueryParams(
                this.selectedSection || this.section,
                !this.section
            )
            // console.log('validMap', validMap)
            for (const [key, isValid] of Object.entries(validMap)) {
                if (!isValid) {
                    delete query[key]
                } else if (key != 'search' && key != 'section') {
                    const defaultValue = key === 'page' ? '1' : ''
                    if (
                        !filters[key] ||
                        filters[key] === defaultValue ||
                        filters[key].length === 0
                    ) {
                        // console.log('delete', key)
                        delete query[key]
                    } else {
                        // console.log('add', key, filters[key])
                        query[key] = filters[key]
                    }
                }
            }
            // console.log('query', query)
            this.$router.replace({ path: this.$route.path, query: query })
        },

        updatdeSelectedSection(section) {
            if (this.section) return
            // TODO ?
            this.selectedSection = section
            //
            const query = { ...this.$route.query } // destructure to break reactivity
            const oldSection = query.search || ''
            const _section = section == 'all' ? '' : section || ''
            if (_section !== query.section) {
                if (!_section) {
                    delete query.section
                } else {
                    query.section = _section
                }
                this.$router.replace({ path: this.$route.path, query: query })
            }
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    // watch: {
    //     selectedSection: function () {
    //         this.emitSearchOptionsUpdated()
    //     },

    //     selectedFilters: {
    //         handler() {
    //             if (!this.allInited) return
    //             // convert object to their id as it what's is expected by host components
    //             this.emitSearchOptionsUpdated()
    //         },
    //         deep: true,
    //     },

    //     selectedQuery: {
    //         handler() {
    //             this.emitSearchOptionsUpdated()
    //         },
    //     },
    //     'search.section': {
    //         handler: function (neo) {
    //             this.selectedSection = neo || ALL_SECTION_KEY
    //         },
    //         immediate: true,
    //     },
    // },
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
