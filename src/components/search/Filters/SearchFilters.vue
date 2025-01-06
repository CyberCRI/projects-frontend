<script setup>
import { getProjectCategory } from '@/api/project-categories.service'
import { getAllTagsById } from '@/api/tag-classification.service'

import FilterButton from '@/components/search/Filters/FilterButton.vue'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'

import useContextualFilters, {
    ALL_FILTERS_MODE,
    ALL_SECTION_KEY,
} from '@/components/search/Filters/useContextualFilters.ts'

import { ref, onMounted, toRef, watch, reactive } from 'vue'

function defaultFilters() {
    return {
        categories: [],
        languages: [],
        sdgs: [],
        tags: [],
        skills: [],
    }
}

const emit = defineEmits(['update:selectedFilters'])

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

const selectedFilters = ref(defaultFilters())

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

function openDrawer(drawer) {
    currentDrawer.value = drawer
    isRightDrawerOpened.value = true
}

function updateFiltersFromDrawer(/*filter,*/ event) {
    selectedFilters.value = { ...event }
    emit('update:selectedFilters', selectedFilters.value)
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
    emit('update:selectedFilters', selectedFilters.value)
}

defineExpose({ clearSelectedFilters })

const cache = reactive({
    categories: {},
    tags: {},
    skills: {},
})

async function hydrateFilters() {
    const rawFilters = props.search || {}
    const filters = {}

    filters.categories = await Promise.all(
        (rawFilters.categories || []).map(async (catId) => {
            if (!cache.categories[catId]) return await getProjectCategory(catId)
            else return cache.categories[catId]
        })
    )

    const newTagsId = (rawFilters.tags || []).filter((tagId) => !cache.tags[tagId])
    const cachedTags = (rawFilters.tags || [])
        .filter((tagId) => cache.tags[tagId])
        .map((tagId) => cache.tags[tagId])
    const newTags = newTagsId.length ? (await getAllTagsById(newTagsId)).results : []
    filters.tags = [...cachedTags, ...newTags]

    filters.sdgs = rawFilters.sdgs || []

    filters.languages = rawFilters.languages || []

    const newSkillsId = (rawFilters.skills || []).filter((skillId) => !cache.skills[skillId])
    const cachedSkills = (rawFilters.skills || [])
        .filter((skillId) => cache.skills[skillId])
        .map((skillId) => cache.skills[skillId])

    const newSkills = newSkillsId.length ? (await getAllTagsById(newSkillsId)).results : []
    filters.skills = [...cachedSkills, ...newSkills]

    // memoize
    filters.categories?.forEach((cat) => {
        cache.categories[cat.id] = cat
    })
    filters.tags?.forEach((tag) => {
        cache.tags[tag.id] = tag
    })
    filters.skills?.forEach((skill) => {
        cache.skills[skill.id] = skill
    })

    selectedFilters.value = filters
}

onMounted(hydrateFilters)
watch(() => props.search, hydrateFilters)
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
