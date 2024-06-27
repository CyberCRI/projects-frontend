<script setup>
import { getProjectCategory } from '@/api/project-categories.service'
import { getWikiTag } from '@/api/wikipedia-tags.service'
import { getOrgTag } from '@/api/organization-tags.service'

import FilterButton from '@/components/search/Filters/FilterButton.vue'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'

import useSectionFilters, {
    ALL_SECTION_KEY,
    PROJECT_SECTION_KEY,
    GROUP_SECTION_KEY,
    PEOPLE_SECTION_KEY,
} from '@/components/search/Filters/useSectionFilters.ts'

import useContextualFilters, {
    ALL_FILTERS_MODE,
} from '@/components/search/Filters/useContextualFilters.ts'

import {
    defineModel,
    defineProps,
    defineEmits,
    ref,
    onMounted,
    computed,
    watch,
    toRefs,
    toRaw,
} from 'vue'

function defaultFilters() {
    return {
        categories: [],
        languages: [],
        sdgs: [],
        tags: [],
        skills: [],
        wikipedia_tags: [],
        section: '',
    }
}

const props = defineProps({
    search: {
        type: Object, // here filters are array of id (whereas in slectedFiletrs they are array of object)
        default: null,
    },

    showSectionFilter: {
        type: Boolean,
        default: false,
    },

    // section: {
    //     type: String,
    //     default: ALL_SECTION_KEY,
    // },

    filterBlackList: {
        // filters we dont want to show/edit but are still active (i.e. categories in category page)
        type: Array,
        default: () => [],
    },

    // selectedSection: {
    //     type: String,
    //     default: ALL_SECTION_KEY,
    // },

    // contextualFilters: {
    //     type: Object,
    //     default: defaultFilters,
    // },

    // sectionFilters: {
    //     type: Object,
    //     required: true,
    // },
})

const selectedSection = defineModel('selectedSection', {
    type: String,
    default: () => ALL_SECTION_KEY,
})

const selectedFilters = defineModel('selectedFilters', {
    type: Object,
    default: () => ALL_SECTION_KEY,
})

const emit = defineEmits(['filter-total-changed'])

const { contextualFilters, filterButtons, selectedFiltersTotal } = useContextualFilters({
    selectedSection,
    selectedFilters,
    filterBlackList: toRefs(props).filterBlackList,
    openDrawer,
    clearSelectedFilters,
})

const isRightDrawerOpened = ref(false)
const currentDrawer = ref('')
// const selectedFilters = ref(defaultFilters())
const filtersInited = ref(false)

onMounted(async () => {
    await initFilters()
})

// watch: {
watch(selectedFiltersTotal, () => {
    emit('filter-total-changed', selectedFiltersTotal)
})

// watch(
//     selectedFilters,
//     () => {
//         if (!filtersInited.value) return
//         // convert object to their id as it what's is expected by host components
//         emit('update:contextual-filters', this.adaptToParent())
//     },
//     { deep: true }
// )
// },

async function initFilters() {
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
    if (!key || key === ALL_FILTERS_MODE) Object.assign(selectedFilters.value, defaultFilters())
    else selectedFilters.value[key] = defaultFilters()[key]
}
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
    </div>
    <FiltersDrawer
        :is-opened="!!currentDrawer"
        :filters="contextualFilters"
        :mode="currentDrawer"
        :preselection="selectedFilters"
        @close="currentDrawer = null"
        @confirm="confirm"
    />
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
</style>