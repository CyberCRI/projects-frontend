import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'
import debounce from 'lodash/debounce'
export default function useSearch(forcedSection = null) {
  const MAX_RESULTS = 30

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
    limit: MAX_RESULTS,
    page: route.query.page || 1,
  })

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
    const adaptedFilters = {
      categories: filters.categories?.map((cat) => cat.id) || [],
      languages: filters.languages ? [...filters.languages] : [], // need to deconstruct to avoid reactivity issue when removing language
      sdgs: filters.sdgs ? [...filters.sdgs] : [], // need to deconstruct to avoid reactivity issue when removing sdg
      tags: filters.tags?.map((tag) => tag.id) || [],
      organizations: [organizationsStore.current.code],
      skills: filters.skills?.map((tag) => tag.id) || [],
    }
    return adaptedFilters
  }

  // TODO debounce
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

    res.limit = MAX_RESULTS
    return res
  })

  const updateUrl = debounce(function _updateUrl(query) {
    router.replace({ path: route.path, query: query })
  }, 300)

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
      updateUrl(query)
    }
  }

  function updatdeSelectedFilters(rawFilters) {
    const filters = adaptFilers(rawFilters)
    const query = { ...route.query } // destructure to break reactivity
    for (const [key, isValid] of Object.entries(validQueryParams.value)) {
      if (!isValid) {
        delete query[key]
      } else if (key != 'search' && key != 'section') {
        const defaultValue = key === 'page' ? '1' : ''
        if (!filters[key] || filters[key] === defaultValue || filters[key].length === 0) {
          delete query[key]
        } else {
          query[key] = filters[key]
        }
      }
    }
    query.limit = MAX_RESULTS
    updateUrl(query)
  }

  function updatdeSelectedSection(section) {
    if (disallowSectionChange.value) return
    const query = { ...route.query } // destructure to break reactivity
    const oldSection = query.section || ''
    const _section = section == 'all' ? '' : section || ''
    if (_section !== oldSection) {
      if (!_section) {
        delete query.section
      } else {
        query.section = _section
      }
      updateUrl(query)
      // cleanup now invalid query params
      for (const [key, isValid] of Object.entries(validQueryParams.value)) {
        if (!isValid) {
          delete query[key]
        }
      }
      updateUrl(query)
    }
  }

  return {
    getDefaultSearch,
    searchFromQuery,
    updateSelectedQuery,
    updatdeSelectedFilters,
    updatdeSelectedSection,
  }
}
