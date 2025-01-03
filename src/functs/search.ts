function routeQueryToArray(queryStringOrQueryArray) {
    // this.$route.query returns a string or an array of strings
    // this makes sure we always get array of strings or an empty array if undefined
    if (!queryStringOrQueryArray) return []
    return Array.isArray(queryStringOrQueryArray)
        ? queryStringOrQueryArray
        : [queryStringOrQueryArray]
}

const filtersFromUrl = {
    search: function updateSearchFilterFromURL(query, filters) {
        filters.search = query.search || ''
    },

    languages: function updateLanguageFilterFromURL(query, filters) {
        filters.languages = routeQueryToArray(query.languages)
    },

    members: function updateMemberFilterFromURL(query, filters) {
        filters.members = routeQueryToArray(query.members)
    },

    sdgs: function updateSdgFilterFromURL(query, filters) {
        filters.sdgs = routeQueryToArray(query.sdgs)
    },

    categories: function updateCategoryFilterFromURL(query, filters) {
        filters.categories = routeQueryToArray(query.categories)
    },

    tags: function updateTagFilterFromURL(query, filters) {
        filters.tags = routeQueryToArray(query.tags)
    },

    skills: function updateTagFilterFromURL(query, filters) {
        filters.skills = routeQueryToArray(query.skills)
    },

    page: function updatePageFromURL(query, filters) {
        filters.page = parseInt(query.page) || 1
    },

    section: function updateSectionFromURL(query, filters) {
        filters.section = ['all', 'people', 'groups', 'projects'].includes(query.section)
            ? query.section
            : 'all'
    },
}

export function updateFiltersFromURL(query, filterKeys) {
    const filters: any = {}

    for (const key of filterKeys || []) {
        if (filtersFromUrl[key]) {
            filtersFromUrl[key](query, filters)
        } else {
            console.error(`No parser for filter ${key}`)
        }
    }

    return filters
}

export function searchEquals(search_a, search_b, ignoredKeys = null) {
    const keySet = new Set(Object.keys(search_a || {}))
    Object.keys(search_b || {}).forEach((k) => keySet.add(k))
    ;(ignoredKeys || []).forEach((k) => keySet.delete(k))
    for (const key of keySet) {
        // convert to string for array comparison (and use '' as default to avoid converting null to 'null')
        if (String(search_a[key] || '') != String(search_b[key] || '')) return false
    }
    return true
}

// MOVED in useSearch
export function updateSearchQuery(that, filterKeys) {
    // cleanup
    const search = JSON.parse(JSON.stringify(that.search))
    // keep only keys we are interested in
    for (const key in search) {
        if (!filterKeys || !filterKeys.includes(key)) delete search[key]
        else if (!search[key]) delete search[key]
        else if (Array.isArray(search[key]) && !search[key].length) delete search[key]
    }
    // update url if search has changed
    const updateUrl = !searchEquals(search, that.$route.query)
    if (updateUrl)
        that.$router.replace({
            path: that.$route.path,
            query: search,
        })
}

export function resetPaginationIfNeeded(oldSearch, newSearch) {
    const resetPage = !searchEquals(newSearch, oldSearch, ['page'])
    const search = { ...oldSearch, ...newSearch }
    if (resetPage) search.page = 1
    return search
}
