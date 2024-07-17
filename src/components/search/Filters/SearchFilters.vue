<script setup>
import { getProjectCategory } from '@/api/project-categories.service'
import { getWikiTag } from '@/api/wikipedia-tags.service'
import { getOrgTag } from '@/api/organization-tags.service'

import FilterButton from '@/components/search/Filters/FilterButton.vue'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'

import useContextualFilters, {
    ALL_FILTERS_MODE,
    ALL_SECTION_KEY,
} from '@/components/search/Filters/useContextualFilters.ts'

import { ref, onMounted, toRef } from 'vue'

function defaultFilters() {
    return {
        categories: [],
        languages: [],
        sdgs: [],
        tags: [],
        skills: [],
        wikipedia_tags: [],
    }
}

const emit = defineEmits(['search-filters-inited'])

const props = defineProps({
    search: {
        type: Object, // here filters are array of id (whereas in slectedFiletrs they are array of object)
        default: null,
    },

    showSectionFilter: {
        type: Boolean,
        default: false,
    },

    filterBlackList: {
        // filters we dont want to show/edit but are still active (i.e. categories in category page)
        type: Array,
        default: () => [],
    },
})

const selectedSection = defineModel('selectedSection', {
    type: String,
    default: () => ALL_SECTION_KEY,
})

const selectedFilters = defineModel('selectedFilters', {
    type: Object,
    default: () => ALL_SECTION_KEY,
})

const { contextualFilters, filterButtons } = useContextualFilters({
    selectedSection,
    selectedFilters,
    filterBlackList: toRef(props, 'filterBlackList'),
    openDrawer,
    clearSelectedFilters,
    showSectionFilter: toRef(props, 'showSectionFilter'),
})

const isRightDrawerOpened = ref(false)
const currentDrawer = ref('')
// const selectedFilters = ref(defaultFilters())
const filtersInited = ref(false)

onMounted(async () => {
    await initFilters()
})

async function initFilters() {
    emit('search-filters-inited', false)
    // converts host component "search" (arrays of id)
    // to arrays of object (needed in this component for displayinf them)

    const rawFilters = props.search || {}
    const filters = {}

    filters.categories = await Promise.all(
        (rawFilters.categories || []).map(async (catId) => await getProjectCategory(catId))
    )

    const wikipediaTags = await Promise.all(
        (rawFilters.wikipedia_tags || []).map(async (wikiTagId) => await getWikiTag(wikiTagId))
    )

    const organizationTags = await Promise.all(
        (rawFilters.organization_tags || []).map(async (orgTagId) => await getOrgTag(orgTagId))
    )

    filters.tags = [...wikipediaTags, ...organizationTags]

    filters.sdgs = rawFilters.sdgs || []

    filters.languages = rawFilters.languages || []

    filters.skills = await Promise.all(
        (rawFilters.skills || []).map(async (skillId) => await getWikiTag(skillId))
    )

    selectedFilters.value = filters
    filtersInited.value = true

    emit('search-filters-inited', true)
}

function openDrawer(drawer) {
    currentDrawer.value = drawer
    isRightDrawerOpened.value = true
}

function updateFiltersFromDrawer(/*filter,*/ event) {
    selectedFilters.value = { ...event }
}

function confirm($event) {
    currentDrawer.value = null
    updateFiltersFromDrawer($event)
}

function clearSelectedFilters(key) {
    const newValue = defaultFilters()
    if (!key || key === ALL_FILTERS_MODE) {
        selectedFilters.value = newValue
    } else selectedFilters.value[key] = newValue[key]
}

defineExpose({ clearSelectedFilters })
</script>

<template>
    <div class="add-filter">
        <FilterButton
            v-for="(filterButton, key) in filterButtons"
            :key="key"
            :label="filterButton.label"
            :is-unused="filterButton.isUnused"
            :is-selected="filterButton.isSelected"
            :is-hidden="!filterButton.condition"
            @main-action="filterButton.action(key)"
            @clear-action="filterButton.clear(key)"
            :names="filterButton.names"
            :data-test="filterButton.dataTest"
        />
        <FiltersDrawer
            class="filters-drawer"
            :is-opened="!!currentDrawer"
            :filters="contextualFilters"
            :mode="currentDrawer"
            :preselection="selectedFilters"
            @close="currentDrawer = null"
            @confirm="confirm"
        />
    </div>
</template>

<style lang="scss" scoped>
.add-filter {
    margin-top: $space-l;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $space-m;
}

.filters-drawer {
    position: absolute; // this prevent layout shift when opening drawer
}
</style>
