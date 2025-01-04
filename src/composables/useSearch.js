import { /*ref,*/ computed /*, watchEffect*/ } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'
// import debounce from 'lodash.debounce'
// import { updateFiltersFromURL, searchEquals, resetPaginationIfNeeded } from '@/functs/search.ts'

export default function useSearch(forcedSection = null) {
    const organizationsStore = useOrganizationsStore()
    const route = useRoute()
    const router = useRouter()

    const selectedSection = computed(() => forcedSection || route.query.section || ALL_SECTION_KEY)

    const disallowSectionChange = computed(() => !!forcedSection)

    const getDefaultSearch = () => ({
        search: route.query.search || '',
        categories: [],
        tags: [],
        members: [],
        sdgs: [],
        languages: [],
        skills: [],
        section: route.query.section || ALL_SECTION_KEY,
        organizations: [organizationsStore.current.code],
        ordering: '-updated_at',
        limit: 30,
        page: route.query.page || 1,
    })

    // const search = ref(getDefaultSearch())

    // const searchOptionsInitiated = ref(false)

    // const selectedSection = ref(ALL_SECTION_KEY)

    // const filterQueryParams = computed(() => {
    //     // compute allowed filters according to current section
    //     // so that filter of one section (ie skills on people) dont persist on other section (ie skills on project)
    //     const isProject = selectedSection.value === 'projects'
    //     const isPeople = selectedSection.value === 'people'
    //     const map = {
    //         search: true,
    //         categories: isProject,
    //         tags: isProject,
    //         members: false,
    //         sdgs: isProject || isPeople,
    //         languages: isProject,
    //         skills: isPeople,
    //         page: true,
    //         section: true,
    //     }

    //     return Object.keys(map).filter((key) => map[key])
    // })

    // const searchFromQuery = computed(() => {
    //     const res = {}
    //     for (const key in filterQueryParams.value) {
    //         if (route.query[key]) res[key] = route.query[key]
    //     }
    //     return res
    // })

    // const rawSearch = computed(() => {
    //     return JSON.parse(JSON.stringify(search.value))
    // })

    // async function initSearch(initOptions) {
    //     const _initOptions = initOptions || {}
    //     const filtersFromUrl = await updateFiltersFromURL(route.query, filterQueryParams.value)
    //     search.value = { ...search.value, ...filtersFromUrl, ..._initOptions }
    //     searchOptionsInitiated.value = true
    // }

    // function updateSearchQuery() {
    //     // //return _updateSearchQuery(this, this.filterQueryParams)
    //     // // cleanup
    //     // const _search = JSON.parse(JSON.stringify(search.value))
    //     // // keep only keys we are interested in
    //     // for (const key in _search) {
    //     //     if (!filterQueryParams.value || !filterQueryParams.value.includes(key))
    //     //         delete _search[key]
    //     //     else if (!_search[key]) delete _search[key]
    //     //     else if (Array.isArray(search.value[key]) && !_search[key].length) delete _search[key]
    //     // }
    //     // // update url if search has changed
    //     // const updateUrl = !searchEquals(_search, route.query)
    //     // if (updateUrl)
    //     //     router.replace({
    //     //         path: route.path,
    //     //         query: _search,
    //     //     })
    // }

    // const updateSearch = debounce(function _updateSearch(newSearch) {
    //     if (!searchOptionsInitiated.value) return
    //     // reset pagination to page 1 if other criterion have changed
    //     // { ...this.search, ...newSearch } is needed as SearchOptions emitted value dont have some params like limit
    //     // and so seem always different than this.search
    //     const _search = resetPaginationIfNeeded(search.value, {
    //         ...search.value,
    //         ...newSearch,
    //     })
    //     search.value = _search
    //     updateSearchQuery()
    // }, 500)

    // TODO debounce

    const validQueryParams = computed(() => {
        // compute allowed filters according to current section
        // so that filter of one section (ie skills on people) dont persist on other section (ie skills on project)
        const isProject = selectedSection.value === 'projects'
        const isPeople = selectedSection.value === 'people'
        const map = {
            search: true,
            categories: isProject,
            tags: isProject,
            members: false,
            sdgs: isProject || isPeople,
            languages: isProject,
            skills: isPeople,
            page: true,
            section: !disallowSectionChange.value,
        }

        return map
    })

    function adaptFilers(filters) {
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
            organizations: [organizationsStore.current.code],
            skills: filters.skills?.map((tag) => tag.id) || [],
        }
        return adaptedFilters
    }

    const searchFromQuery = computed(() => {
        const res = {}

        for (const [key, isValid] of Object.entries(validQueryParams.value)) {
            const defaultValue = key === 'page' ? '1' : ''

            const val = route.query[key]
            if (isValid && val && val !== defaultValue) res[key] = val
        }

        for (const arrKey of ['categories', 'tags', 'skills', 'languages', 'sdgs']) {
            if (res[arrKey] && !Array.isArray(res[arrKey])) {
                res[arrKey] = [res[arrKey]]
            }
        }
        return res
    })

    function updateSelectedQuery(search) {
        const query = { ...route.query } // destructure to break reactivity
        const oldSearch = query.search || ''
        const _search = search || ''
        if (_search !== oldSearch) {
            if (!_search) {
                delete query.search
            } else {
                query.search = _search
            }
            router.replace({ path: route.path, query: query })
        }
    }

    function updatdeSelectedFilters(rawFilters) {
        const filters = adaptFilers(rawFilters)
        // console.log('filters', filters)
        const query = { ...route.query } // destructure to break reactivity
        // console.log('validMap', validMap)
        for (const [key, isValid] of Object.entries(validQueryParams.value)) {
            if (!isValid) {
                delete query[key]
            } else if (key != 'search' && key != 'section') {
                const defaultValue = key === 'page' ? '1' : ''
                if (!filters[key] || filters[key] === defaultValue || filters[key].length === 0) {
                    // console.log('delete', key)
                    delete query[key]
                } else {
                    // console.log('add', key, filters[key])
                    query[key] = filters[key]
                }
            }
        }
        // console.log('query', query)
        router.replace({ path: route.path, query: query })
    }

    function updatdeSelectedSection(section) {
        if (disallowSectionChange.value) return
        // TODO ?
        // this.selectedSection = section
        //
        const query = { ...route.query } // destructure to break reactivity
        const oldSection = query.section || ''
        const _section = section == 'all' ? '' : section || ''
        if (_section !== oldSection) {
            if (!_section) {
                delete query.section
            } else {
                query.section = _section
            }
            router.replace({ path: route.path, query: query })
            // cleanup now invalid query params
            for (const [key, isValid] of Object.entries(validQueryParams.value)) {
                if (!isValid) {
                    delete query[key]
                }
            }
            router.replace({ path: route.path, query: query })
        }
    }

    return {
        // search,
        getDefaultSearch,
        // searchOptionsInitiated,
        // selectedSection,
        // filterQueryParams,
        // rawSearch,
        // initSearch,
        // updateSearchQuery,
        // updateSearch,
        // //****
        // searchFromQuery,
        // //  */
        searchFromQuery,
        updateSelectedQuery,
        updatdeSelectedFilters,
        updatdeSelectedSection,
    }
}
