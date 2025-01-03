import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'
import debounce from 'lodash.debounce'
import {
    updateFiltersFromURL,
    // updateSearchQuery as _updateSearchQuery,
    searchEquals,
    resetPaginationIfNeeded,
} from '@/functs/search.ts'

export default function useSearch() {
    const organizationsStore = useOrganizationsStore()
    const route = useRoute()
    const router = useRouter()

    const defaultSearch = {
        search: '',
        categories: [],
        tags: [],
        members: [],
        sdgs: [],
        languages: [],
        skills: [],
        section: ALL_SECTION_KEY,
        organizations: [organizationsStore.current.code],
        ordering: '-updated_at',
        limit: 30,
        page: 1,
    }

    const search = ref(defaultSearch)

    const searchOptionsInitiated = ref(false)

    const selectedSection = ref(ALL_SECTION_KEY)

    const filterQueryParams = computed(() => {
        // compute allowed filters according to current section
        // so that filter of one section (ie skills on people) dont persist on other section (ie skills on project)
        const map = {
            search: true,
            categories: selectedSection.value === 'projects',
            tags: selectedSection.value === 'projects',
            members: false,
            sdgs: selectedSection.value === 'projects' || selectedSection.value === 'people',
            languages: selectedSection.value === 'projects',
            skills: selectedSection.value === 'people',
            page: true,
            section: true,
        }

        return Object.keys(map).filter((key) => map[key])
    })
    const rawSearch = computed(() => {
        return JSON.parse(JSON.stringify(search.value))
    })

    async function initSearch() {
        Object.assign(
            search.value,
            await updateFiltersFromURL(route.query, filterQueryParams.value)
        )
        searchOptionsInitiated.value = true
    }

    function updateSearchQuery() {
        //return _updateSearchQuery(this, this.filterQueryParams)

        // cleanup
        const _search = JSON.parse(JSON.stringify(search.value))
        // keep only keys we are interested in
        for (const key in _search) {
            if (!filterQueryParams.value || !filterQueryParams.value.includes(key))
                delete _search[key]
            else if (!_search[key]) delete _search[key]
            else if (Array.isArray(search.value[key]) && !_search[key].length) delete _search[key]
        }
        // update url if search has changed
        const updateUrl = !searchEquals(_search, route.query)
        if (updateUrl)
            router.replace({
                path: route.path,
                query: _search,
            })
    }

    const updateSearch = debounce(function _updateSearch(newSearch) {
        if (!searchOptionsInitiated.value) return
        // reset pagination to page 1 if other criterion have changed
        // { ...this.search, ...newSearch } is needed as SearchOptions emitted value dont have some params like limit
        // and so seem always different than this.search
        const _search = resetPaginationIfNeeded(search.value, {
            ...search.value,
            ...newSearch,
        })
        search.value = _search
        updateSearchQuery()
    }, 500)

    return {
        search,
        searchOptionsInitiated,
        selectedSection,
        filterQueryParams,
        rawSearch,
        initSearch,
        updateSearchQuery,
        updateSearch,
    }
}
