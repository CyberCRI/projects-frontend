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
                    :class="{ 'search-input--no-section': !showSectionDropDown }"
                    v-model="selectedFilters.search"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="deleteQuery"
                    @keyup.enter="$emit('enter', adaptToParent(selectedFilters))"
                />
            </div>
            <div v-if="searchButton" class="search-button">
                <LpiButton
                    :label="$t('browse.page-title')"
                    :secondary="false"
                    @click="$emit('search', selectedSection, adaptToParent(selectedFilters))"
                    data-test="search-input-button"
                >
                </LpiButton>
            </div>
        </div>

        <div v-if="showFilters">
            <div class="add-filter">
                <div class="add-filter__button-list">
                    <template v-if="!showSectionDropDown && showSectionFilter">
                        <FilterButton
                            v-for="(sectionFilter, key) in sectionFilters"
                            :key="key"
                            :label="$t(sectionFilter.label)"
                            :is-selected="sectionFilter.isSelected"
                            :is-hidden="!sectionFilter.condition"
                            @click="sectionFilter.action(key)"
                            :data-test="sectionFilter.dataTest"
                        />
                    </template>

                    <FilterButton
                        v-for="(filterButton, key) in filterButtons"
                        :key="key"
                        :label="filterButton.label"
                        :is-unused="filterButton.isUnused"
                        :is-selected="filterButton.isSelected"
                        :is-hidden="!filterButton.condition"
                        @click="filterButton.action(key)"
                    />
                </div>
            </div>

            <template v-if="selectedFiltersTotal !== 0">
                <div class="selected-filters">
                    <template v-for="(value, key) in selectedFiltersNames">
                        <FilterValue
                            v-for="(name, index) in selectedFiltersNames[key]"
                            :key="index"
                            :label="name"
                            class="actionable"
                            icon="Close"
                            @click="removeFilter(key, index)"
                        />
                    </template>
                    <LinkButton
                        :label="$t('common.delete-selection')"
                        class="clear-selection-button"
                        btn-icon="Close"
                        @click="clearSelectedFilters"
                    />
                </div>
            </template>
        </div>

        <FiltersDrawer
            :is-opened="!!currentDrawer"
            :mode="currentDrawer"
            :preselection="selectedFilters"
            @close="currentDrawer = null"
            @confirm="confirm"
            :selected-section="selectedSection"
            :filter-black-list="filterBlackList"
        />
    </div>
</template>

<script>
import { getProjectCategory } from '@/api/project-categories.service'
import { getWikiTag } from '@/api/wikipedia-tags.service'
import { getOrgTag } from '@/api/organization-tags.service'
import SearchInput from '@/components/base/form/SearchInput.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import SearchOptionDropDown from '@/components/search/SearchOptionDropDown/SearchOptionDropDown.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import FilterButton from '@/components/search/Filters/FilterButton.vue'
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

export const ALL_SECTION_KEY = 'all'

export default {
    name: 'SearchOptions',

    emits: ['filters-updated', 'filter-total-changed', 'filter-section-update', 'enter', 'search'],

    components: {
        SearchOptionDropDown,
        SearchInput,
        LinkButton,
        FiltersDrawer,
        FilterValue,
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

        this.selectedFilters = filters
        this.filtersInited = true
    },

    computed: {
        sectionFilters() {
            return {
                [ALL_SECTION_KEY]: {
                    action: this.toggleSectionFilter,
                    leftIcon: 'BarsStaggered',
                    label: 'search.all-section',
                    dataTest: 'all-sections-button',
                    condition: false,
                    isSelected: !this.selectedSection || this.selectedSection === ALL_SECTION_KEY,
                    isUnused: false,
                },
                projects: {
                    action: this.toggleSectionFilter,
                    leftIcon: 'Briefcase',
                    label: 'search.projects-section',
                    dataTest: 'project-section-button',
                    condition:
                        this.selectedSection == ALL_SECTION_KEY ||
                        this.selectedSection == 'projects',
                    isSelected: this.selectedSection === 'projects',
                    isUnused: false,
                },
                groups: {
                    action: this.toggleSectionFilter,
                    leftIcon: 'PeopleGroup',
                    label: 'search.groups',
                    dataTest: 'group-section-button',
                    condition:
                        this.selectedSection == ALL_SECTION_KEY || this.selectedSection == 'groups',
                    isSelected: this.selectedSection === 'groups',
                    isUnused: false,
                },
                people: {
                    action: this.toggleSectionFilter,
                    leftIcon: 'Account',
                    label: 'search.peoples',
                    dataTest: 'person-section-button',
                    condition:
                        this.selectedSection == ALL_SECTION_KEY || this.selectedSection == 'people',
                    isSelected: this.selectedSection === 'people',
                    isUnused: false,
                },
            }
        },

        filterButtons() {
            return {
                tags: this.makeFilterButton({
                    label: this.$t('search.tag'),
                    count: this.selectedFiltersNames.tags.length,
                    condition:
                        this.selectedSection === 'projects' &&
                        !this.filterBlackList.includes('tags'),
                }),
                sdgs: this.makeFilterButton({
                    label: this.$t('search.sdg'),
                    count: this.selectedFiltersNames.sdgs.length,
                    condition:
                        (this.selectedSection === 'projects' ||
                            this.selectedSection === 'people') &&
                        !this.filterBlackList.includes('sdgs'),
                }),
                languages: this.makeFilterButton({
                    label: this.$t('search.language'),
                    count: this.selectedFiltersNames.languages.length,
                    condition:
                        this.selectedSection === 'projects' &&
                        !this.filterBlackList.includes('languages'),
                }),

                skills: this.makeFilterButton({
                    label: this.$t('search.skills'),
                    count: this.selectedFiltersNames.skills.length,
                    condition:
                        this.selectedSection === 'people' &&
                        !this.filterBlackList.includes('skills'),
                }),
                ...(this.$store.getters['projectCategories/all'].length
                    ? {
                          categories: this.makeFilterButton({
                              label: this.$t('search.category'),
                              count: this.selectedFiltersNames.categories.length,
                              condition:
                                  this.selectedSection === 'projects' &&
                                  !this.filterBlackList.includes('categories'),
                          }),
                      }
                    : {}),
                'all-filters': this.makeFilterButton({
                    label: this.$t('search.all-filters'),
                    count: this.selectedFiltersTotal,
                    condition:
                        this.selectedSection === 'projects' || this.selectedSection === 'people',
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

        wikipediaTags() {
            return this.selectedFilters.tags.filter((tag) => 'wikipedia_qid' in tag)
        },

        organizationTags() {
            return this.selectedFilters.tags.filter((tag) => 'organization' in tag)
        },

        selectedFiltersNames() {
            return {
                languages: this.languageNames,
                sdgs: this.sdgNames,
                categories: this.categoryNames,
                tags: this.tagNames,
                skills: this.skillsName,
            }
        },

        languageNames() {
            return this.filterBlackList.includes('languages')
                ? []
                : this.selectedFilters.languages.map((language) =>
                      this.$t(`language.label-${language}`)
                  )
        },

        sdgNames() {
            return this.filterBlackList.includes('sdgs')
                ? []
                : this.selectedFilters.sdgs.map((sdg) => {
                      if (typeof sdg === 'string') return this.$t(`sdg.${sdg}.title`)
                      return this.$t(`sdg.${sdg.id}.title`)
                  })
        },

        categoryNames() {
            return this.filterBlackList.includes('categories')
                ? []
                : this.selectedFilters.categories.map((cat) => cat.name)
        },

        tagNames() {
            if (this.filterBlackList.includes('tags')) return []

            const wikipediaTagsNames = this.wikipediaTags.map(
                (wikiTag) =>
                    wikiTag[`name_${this.$store.state.languages.current}`] || wikiTag['name']
            )
            const organizationTagsNames = this.organizationTags.map((orgTag) => orgTag.name)

            return [...wikipediaTagsNames, ...organizationTagsNames]
        },

        skillsName() {
            return this.filterBlackList.includes('skills')
                ? []
                : this.selectedFilters.skills.map((skill) => skill.name)
        },
    },

    methods: {
        makeFilterButton(config) {
            return {
                ...config,
                label: config.label + (config.count ? ` (${config.count})` : ''),
                isUnused: !config.count,
                isSelected: config.count > 0,
                action: this.openDrawer,
            }
        },
        adaptToParent(filters) {
            const adaptedFilters = {
                search: filters.search,
                categories: filters.categories.map((cat) => cat.id),
                languages: [...filters.languages], // need to deconstruct to avoid reactivity issue when removing language
                sdgs: [...filters.sdgs], // need to deconstruct to avoid reactivity issue when removing sdg
                wikipedia_tags: this.wikipediaTags.map((tag) => tag.wikipedia_qid),
                organization_tags: this.organizationTags.map((tag) => tag.id),
                organizations: [this.$store.state.organizations.current.code],
                skills: filters.skills.map((tag) => tag.wikipedia_qid),
            }
            delete adaptedFilters['tags']
            return adaptedFilters
        },

        toggleSectionFilter(key) {
            this.selectedSection = this.selectedSection == key ? ALL_SECTION_KEY : key
        },

        clearSelectedFilters() {
            Object.assign(this.selectedFilters, defaultFilters())
        },

        openDrawer(drawer) {
            this.currentDrawer = drawer
            this.isRightDrawerOpened = true
        },

        removeFilter(type, index) {
            this.selectedFilters[type].splice(index, 1)
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

.search-block.inline {
    max-width: none;
    flex-grow: 1;
    padding: 0;
    padding-right: $space-xl;
}

.add-filter,
.search-types {
    margin-top: $space-l;

    &__title {
        font-size: $font-size-xs;
        font-weight: 700;
        text-align: center;
        margin-bottom: $space-m;
        margin-top: $font-size-3xl;
        color: $almost-black;
    }
}

.add-filter__button-list,
.search-types {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $space-m;
}

.selected-filters {
    display: flex;
    flex-wrap: wrap;
    gap: $space-s;
    margin: $space-2xl;
    align-items: center;
}

.clear-selection-button {
    margin: 0;
    text-transform: uppercase;
    padding: 0 !important;
}

.link {
    color: $primary-dark;
    font-weight: bold;
    text-decoration: underline;
}

.search-info {
    color: $almost-black;
    margin: $space-xl 0 $space-xl 0;
}

.mobile--hidden {
    display: none;
}

@media only screen and (width >= 1000px) {
    .add-filter {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .add-filter__button-list {
        justify-content: start;
    }

    .mobile--hidden {
        display: block;
    }

    .search-info {
        text-align: left;
    }
}

.search-container {
    @media (min-width: $min-tablet) {
        display: flex;
        gap: 1rem;
        align-items: center;
        width: 100%;
    }

    .search-group {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;

        @media (min-width: $min-tablet) {
            flex-direction: row;
            width: 100%;
            justify-content: center;
        }
    }

    .search-button {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-width: 0;
        background: $white;
        border-color: $primary;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .search-input {
        .stretch & {
            flex-grow: 1;
        }

        :deep(input) {
            @media (min-width: $min-tablet) {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        &--no-section {
            :deep(input) {
                @media (min-width: $min-tablet) {
                    border-top-left-radius: $border-radius-l;
                    border-bottom-left-radius: $border-radius-l;
                }
            }
        }
    }

    @media (min-width: $min-tablet) {
        align-items: center;
        justify-content: center;
        flex-direction: unset;
    }
}

:deep(.search-input-ctn--full) {
    width: pxToRem(350px);
    margin-bottom: $space-m;

    @media (min-width: $min-tablet) {
        margin-bottom: 0;
    }

    @media (max-width: $min-tablet) {
        width: 100%;
    }
}
</style>
