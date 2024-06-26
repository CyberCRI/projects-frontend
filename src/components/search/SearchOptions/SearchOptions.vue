<template>
    <div class="search-block">
        <div class="search-container">
            <div class="search-group">
                <SearchOptionDropDown
                    v-if="showSectionDropDown"
                    v-model="selectedSection"
                    :menu-items="sectionFilters"
                />
                <SearchInput
                    class="search-input"
                    :class="{ 'has-sections': showSectionDropDown }"
                    v-model="selectedFilters.search"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="deleteQuery"
                    @keyup.enter="$emit('enter', selectedSection, adaptToParent(selectedFilters))"
                />
                <LpiButton
                    v-if="searchButton"
                    class="search-button"
                    :label="$t('browse.page-title')"
                    :secondary="false"
                    @click="$emit('search', selectedSection, adaptToParent(selectedFilters))"
                    data-test="search-input-button"
                />
            </div>
        </div>

        <div v-if="showFilters" class="add-filter">
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
    </div>
</template>

<script>
import { getProjectCategory } from '@/api/project-categories.service'
import { getWikiTag } from '@/api/wikipedia-tags.service'
import { getOrgTag } from '@/api/organization-tags.service'
import SearchInput from '@/components/base/form/SearchInput.vue'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'
import SearchOptionDropDown from '@/components/search/SearchOptionDropDown/SearchOptionDropDown.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import FilterButton from '@/components/search/Filters/FilterButton.vue'

import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import LanguageFilter from '@/components/search/Filters/LanguageFilter.vue'
import TagsFilterSummary from '@/components/search/Filters/TagsFilterSummary.vue'
import SkillsFilterSummary from '@/components/search/Filters/SkillsFilterSummary.vue'
import SkillsFilterEditor from '@/components/search/Filters/SkillsFilterEditor.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import CategoriesFilterSummary from '@/components/search/Filters/CategoriesFilterSummary.vue'
import CategoriesFilterEditor from '@/components/search/Filters/CategoriesFilterEditor.vue'

import {
    ALL_FILTERS_MODE,
    ALL_SECTION_KEY,
    PROJECT_SECTION_KEY,
    GROUP_SECTION_KEY,
    PEOPLE_SECTION_KEY,
} from '@/components/search/Filters/filter-constants.ts'

function defaultFilters() {
    return {
        search: '',
        categories: [],
        languages: [],
        sdgs: [],
        tags: [],
        skills: [],
        wikipedia_tags: [],
        section: '',
    }
}

export default {
    name: 'SearchOptions',

    emits: ['filters-updated', 'filter-total-changed', 'filter-section-update', 'enter', 'search'],

    components: {
        SearchOptionDropDown,
        SearchInput,
        FiltersDrawer,
        LpiButton,
        FilterButton,
    },

    props: {
        showFilters: {
            type: Boolean,
            default: false,
        },
        showSectionDropDown: {
            type: Boolean,
            default: false,
        },

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

        searchButton: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            isRightDrawerOpened: false,

            // here filters are array of object (whereas in search they are array of id)
            selectedFilters: defaultFilters(),

            currentDrawer: '',

            filtersInited: false,

            selectedSection: ALL_SECTION_KEY,
        }
    },

    async mounted() {
        await this.initFilters()
    },

    computed: {
        sectionFilters() {
            return {
                [ALL_SECTION_KEY]: {
                    action: this.toggleSectionFilter,
                    clear: this.toggleSectionFilter,
                    names: [],
                    leftIcon: 'BarsStaggered',
                    label: this.$t('search.all-section'),
                    dataTest: 'all-sections-button',
                    condition: false,
                    isSelected: !this.selectedSection || this.selectedSection === ALL_SECTION_KEY,
                    isUnused: false,
                },
                [PROJECT_SECTION_KEY]: {
                    action: this.toggleSectionFilter,
                    clear: this.toggleSectionFilter,
                    names: [],
                    leftIcon: 'Briefcase',
                    label: this.$t('search.projects-section'),
                    dataTest: 'project-section-button',
                    condition:
                        !this.showSectionDropDown &&
                        this.showSectionFilter &&
                        (this.selectedSection == ALL_SECTION_KEY ||
                            this.selectedSection == PROJECT_SECTION_KEY),
                    isSelected: this.selectedSection === PROJECT_SECTION_KEY,
                    isUnused: false,
                },
                [GROUP_SECTION_KEY]: {
                    action: this.toggleSectionFilter,
                    clear: this.toggleSectionFilter,
                    names: [],
                    leftIcon: 'PeopleGroup',
                    label: this.$t('search.groups'),
                    dataTest: 'group-section-button',
                    condition:
                        !this.showSectionDropDown &&
                        this.showSectionFilter &&
                        (this.selectedSection == ALL_SECTION_KEY ||
                            this.selectedSection == GROUP_SECTION_KEY),
                    isSelected: this.selectedSection === GROUP_SECTION_KEY,
                    isUnused: false,
                },
                [PEOPLE_SECTION_KEY]: {
                    action: this.toggleSectionFilter,
                    clear: this.toggleSectionFilter,
                    leftIcon: 'Account',
                    label: this.$t('search.peoples'),
                    dataTest: 'person-section-button',
                    condition:
                        !this.showSectionDropDown &&
                        this.showSectionFilter &&
                        (this.selectedSection == ALL_SECTION_KEY ||
                            this.selectedSection == PEOPLE_SECTION_KEY),
                    isSelected: this.selectedSection === PEOPLE_SECTION_KEY,
                    isUnused: false,
                },
            }
        },

        contextualFilters() {
            return {
                // TAGS
                tags: this.makeFilterButton({
                    label: this.$t('search.tag'),
                    names: this.filterBlackList.includes('tags')
                        ? []
                        : this.selectedFilters.tags.map((tag) => {
                              if (tag.wikipedia_qid) {
                                  // wikipedia tags
                                  return (
                                      tag[`name_${this.$store.state.languages.current}`] ||
                                      tag['name']
                                  )
                              } else {
                                  // org tags
                                  return tag.name
                              }
                          }),
                    dataTest: 'contextual-filter-tags',
                    condition:
                        this.selectedSection === PROJECT_SECTION_KEY &&
                        !this.filterBlackList.includes('tags'),
                    // drawer config part
                    title: 'tag',
                    toggleable: true,
                    componentSummary: TagsFilterSummary,
                    componentEditor: TagsFilterEditor,
                }),
                // SDGS
                sdgs: this.makeFilterButton({
                    label: this.$t('search.sdg'),
                    names: this.filterBlackList.includes('sdgs')
                        ? []
                        : this.selectedFilters.sdgs.map((sdg) => {
                              if (typeof sdg === 'string') return this.$t(`sdg.${sdg}.title`)
                              return this.$t(`sdg.${sdg.id}.title`)
                          }),
                    dataTest: 'contextual-filter-sdgs',
                    condition:
                        (this.selectedSection === PROJECT_SECTION_KEY ||
                            this.selectedSection === PEOPLE_SECTION_KEY) &&
                        !this.filterBlackList.includes('sdgs'),
                    // drawer config part
                    title: 'sdg',
                    componentSummary: SdgsFilter,
                    componentEditor: SdgsFilter,
                    toggleable: false,
                }),
                // LANGUAGES
                languages: this.makeFilterButton({
                    label: this.$t('search.language'),
                    names: this.filterBlackList.includes('languages')
                        ? []
                        : this.selectedFilters.languages.map((language) =>
                              this.$t(`language.label-${language}`)
                          ),
                    condition:
                        this.selectedSection === PROJECT_SECTION_KEY &&
                        !this.filterBlackList.includes('languages'),
                    dataTest: 'contextual-filter-languages',
                    // drawer config part
                    title: 'language',
                    componentSummary: LanguageFilter,
                    componentEditor: LanguageFilter,
                    toggleable: false,
                }),
                // SKILLS
                skills: this.makeFilterButton({
                    label: this.$t('search.skills'),
                    names: this.filterBlackList.includes('skills')
                        ? []
                        : this.selectedFilters.skills.map((skill) => skill.name),
                    condition:
                        this.selectedSection === PEOPLE_SECTION_KEY &&
                        !this.filterBlackList.includes('skills'),
                    dataTest: 'contextual-filter-skills',
                    // drawer config part
                    title: 'skills',
                    toggleable: true,
                    componentSummary: SkillsFilterSummary,
                    componentEditor: SkillsFilterEditor,
                }),
                // CATEGORIES
                ...(this.$store.getters['projectCategories/all'].length
                    ? {
                          categories: this.makeFilterButton({
                              label: this.$t('search.category'),
                              names: this.filterBlackList.includes('categories')
                                  ? []
                                  : this.selectedFilters.categories.map((cat) => cat.name),
                              condition:
                                  this.selectedSection === PROJECT_SECTION_KEY &&
                                  !this.filterBlackList.includes('categories'),
                              dataTest: 'contextual-filter-category',
                              // drawer config part
                              title: 'category',
                              toggleable: true,
                              componentSummary: CategoriesFilterSummary,
                              componentEditor: CategoriesFilterEditor,
                          }),
                      }
                    : {}),
            }
        },

        filterButtons() {
            return {
                ...this.sectionFilters,
                ...this.contextualFilters,
                // ALL FILTERS
                [ALL_FILTERS_MODE]: this.makeFilterButton({
                    label: this.$t('search.all-filters'),
                    forceCount: this.selectedFiltersTotal,
                    condition:
                        this.selectedSection === PROJECT_SECTION_KEY ||
                        this.selectedSection === PEOPLE_SECTION_KEY,
                }),
            }
        },

        selectedFiltersTotal() {
            function safeArrayLength(arr) {
                return arr ? arr.length : 0
            }
            const count = ['languages', 'sdgs', 'categories', 'tags', 'skills'].reduce(
                (acc, filter) =>
                    acc +
                    (this.filterBlackList.includes(filter)
                        ? 0
                        : safeArrayLength(this.selectedFilters[filter])),
                0
            )
            return count
        },
    },

    methods: {
        makeFilterButton(config) {
            const count = config.forceCount || config.names?.length || 0
            const labelWithCount = config.label + (count ? ` (${count})` : '')
            const label = config.names?.length == 1 ? config.names[0] : labelWithCount
            return {
                ...config,
                label,
                isUnused: !count,
                isSelected: count > 0,
                action: this.openDrawer,
                clear: this.clearSelectedFilters,
            }
        },

        async initFilters() {
            // converts host component "search" (arrays of id)
            // to arrays of object (needed in this component for displayinf them)

            const rawFilters = this.search || {}
            const filters = {}

            // this must be done before the other filters
            // since it trigger a search parameters reset
            // (i.e. in category page search we should not reset the category filter)
            filters.section = this.$route.query.section || this.section || ALL_SECTION_KEY

            this.selectedSection = filters.section // TODO can be simplified to filters.section ?

            filters.search = rawFilters.search || ''

            filters.categories = await Promise.all(
                (rawFilters.categories || []).map(async (catId) => await getProjectCategory(catId))
            )

            const wikipediaTags = await Promise.all(
                (rawFilters.wikipedia_tags || []).map(
                    async (wikiTagId) => await getWikiTag(wikiTagId)
                )
            )

            const organizationTags = await Promise.all(
                (rawFilters.organization_tags || []).map(
                    async (orgTagId) => await getOrgTag(orgTagId)
                )
            )

            filters.tags = [...wikipediaTags, ...organizationTags]

            filters.sdgs = rawFilters.sdgs || []

            filters.languages = rawFilters.languages || []

            filters.skills = await Promise.all(
                (rawFilters.skills || []).map(async (skillId) => await getWikiTag(skillId))
            )

            this.selectedFilters = filters
            this.filtersInited = true
        },
        adaptToParent(filters) {
            const adaptedFilters = {
                search: filters.search,
                categories: filters.categories.map((cat) => cat.id),
                languages: [...filters.languages], // need to deconstruct to avoid reactivity issue when removing language
                sdgs: [...filters.sdgs], // need to deconstruct to avoid reactivity issue when removing sdg
                wikipedia_tags: this.selectedFilters.tags
                    .filter((tag) => 'wikipedia_qid' in tag)
                    .map((tag) => tag.wikipedia_qid),
                organization_tags: this.selectedFilters.tags
                    .filter((tag) => 'organization' in tag)
                    .map((tag) => tag.id),
                organizations: [this.$store.state.organizations.current.code],
                skills: filters.skills.map((tag) => tag.wikipedia_qid),
            }
            delete adaptedFilters['tags']
            return adaptedFilters
        },

        toggleSectionFilter(key) {
            this.clearSelectedFilters()
            this.selectedSection = this.selectedSection == key ? ALL_SECTION_KEY : key
        },

        clearSelectedFilters(key) {
            if (!key || key === ALL_FILTERS_MODE)
                Object.assign(this.selectedFilters, defaultFilters())
            else this.selectedFilters[key] = defaultFilters()[key]
        },

        openDrawer(drawer) {
            this.currentDrawer = drawer
            this.isRightDrawerOpened = true
        },

        updateFiltersFromDrawer(/*filter,*/ event) {
            this.selectedFilters = { ...event }
        },

        confirm($event) {
            this.currentDrawer = null
            this.updateFiltersFromDrawer($event)
        },
        deleteQuery() {
            this.selectedFilters.search = ''
            this.$emit('enter', this.adaptToParent(this.selectedFilters))
        },
    },

    watch: {
        selectedFiltersTotal: function () {
            this.$emit('filter-total-changed', this.selectedFiltersTotal)
        },

        selectedSection: function () {
            this.$emit('filter-section-update', this.selectedSection)
            // const copySearch = { search: this.selectedFilters.search }
            // this.clearSelectedFilters()
            // this.selectedFilters.search = copySearch.search
        },

        selectedFilters: {
            handler() {
                if (!this.filtersInited) return
                // convert object to their id as it what's is expected by host components
                this.$emit('filters-updated', this.adaptToParent(this.selectedFilters))
            },
            deep: true,
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

        &.has-sections :deep(.search-input) {
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0;
        }
    }

    &.has-sections {
        width: pxToRem(350px);
    }
}

.add-filter {
    margin-top: $space-l;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $space-m;
}
</style>
