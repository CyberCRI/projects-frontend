<template>
    <div class="search-block">
        <div class="search-container">
            <SearchOptionDropDown
                v-if="showSectionFilter"
                v-model="selectedSection"
                :menu-items="sectionFilters"
                :label="searchOptionDropDownLabel"
                :icon="searchOptionDropDownIcon"
            />
            <SearchInput
                class="search-input"
                :class="{ 'search-input--no-section': !showSectionFilter }"
                v-model="selectedFilters.search"
                :full="true"
                :placeholder="$t('browse.placeholder')"
                @delete-query="deleteQuery"
                @keyup.enter="$emit('enter', adaptToParent(selectedFilters))"
            />
        </div>

        <div v-if="showFilters">
            <div class="add-filter">
                <div class="add-filter__button-list">
                    <div
                        v-for="(filterButton, key) in filterButtons"
                        :key="key"
                        :class="{
                            'add-filter__button-list__button--selected': filterButton.count > 0,
                            'add-filter__button-list__button--hide': !filterButton.condition,
                        }"
                        class="add-filter__button-list__button"
                        @click="filterButton.action(key)"
                    >
                        {{ filterButton.label }}
                        <span v-if="filterButton.count > 0">({{ filterButton.count }})</span>
                    </div>
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
                    <LpiButton
                        :border="false"
                        :label="$t('common.delete-selection')"
                        :secondary="true"
                        class="clear-selection-button"
                        left-icon="Close"
                        size="small"
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
            :selected-section="selectedSection.type"
        />
    </div>
</template>

<script>
import { getProjectCategory } from '@/api/project-categories.service'
import { getWikiTag } from '@/api/wikipedia-tags.service'
import { getOrgTag } from '@/api/organization-tags.service'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import FiltersDrawer from '@/components/peopleKit/Filters/FiltersDrawer.vue'
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'
import SearchOptionDropDown from '@/components/lpikit/Dropdown/SearchOptionDropDown.vue'

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

    emits: ['filters-updated', 'filter-total-changed', 'filter-section-update', 'enter'],

    props: {
        showFilters: {
            type: Boolean,
            default: true,
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
            default: 'all',
        },
    },

    components: {
        SearchOptionDropDown,
        SearchInput,
        LpiButton,
        FiltersDrawer,
        FilterValue,
    },

    data() {
        return {
            isRightDrawerOpened: false,

            // here filters are array of object (whereas in search they are array of id)
            selectedFilters: defaultFilters(),

            currentDrawer: '',

            filtersInited: false,

            selectedSection: {
                key: 'all-sections',
                type: 'all',
                leftIcon: 'BarsStaggered',
                label: this.$t('search.all-section'),
            },
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
        filters.section = this.$route.query.section || this.section || 'all'

        this.selectedSection = this.getSection(filters.section)

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
        searchOptionDropDownLabel() {
            return this.$t(`search.${this.selectedSection.type}-section`)
        },

        searchOptionDropDownIcon() {
            return this.selectedSection && this.selectedSection.leftIcon
                ? this.selectedSection.leftIcon
                : 'BarsStaggered'
        },

        sectionFilters() {
            return [
                {
                    key: 'all-sections',
                    type: 'all',
                    leftIcon: 'BarsStaggered',
                    label: this.$t('search.all-section'),
                    dataTest: 'all-sections-button',
                },
                {
                    key: 'project-section',
                    type: 'projects',
                    leftIcon: 'Briefcase',
                    label: this.$t('search.projects-section'),
                    dataTest: 'project-section-button',
                },
                {
                    key: 'group-section',
                    type: 'groups',
                    leftIcon: 'PeopleGroup',
                    label: this.$t('search.groups'),
                    dataTest: 'group-section-button',
                },
                {
                    key: 'person-section',
                    type: 'people',
                    leftIcon: 'Account',
                    label: this.$t('search.peoples'),
                    dataTest: 'person-section-button',
                },
            ]
        },

        filterButtons() {
            return {
                tags: {
                    label: this.$t('search.tag'),
                    count: this.selectedFiltersNames.tags.length,
                    action: (key) => this.openDrawer(key),
                    condition: this.selectedSection && this.selectedSection.type === 'projects',
                },
                sdgs: {
                    label: this.$t('search.sdg'),
                    count: this.selectedFiltersNames.sdgs.length,
                    action: (key) => this.openDrawer(key),
                    condition:
                        (this.selectedSection && this.selectedSection.type === 'projects') ||
                        (this.selectedSection && this.selectedSection.type === 'people'),
                },
                languages: {
                    label: this.$t('search.language'),
                    count: this.selectedFiltersNames.languages.length,
                    action: (key) => this.openDrawer(key),
                    condition: this.selectedSection && this.selectedSection.type === 'projects',
                },

                skills: {
                    label: this.$t('search.skills'),
                    count: this.selectedFiltersNames.skills.length,
                    action: (key) => this.openDrawer(key),
                    condition: this.selectedSection && this.selectedSection.type === 'people',
                },
                ...(this.$store.getters['projectCategories/all'].length
                    ? {
                          categories: {
                              label: this.$t('search.category'),
                              count: this.selectedFiltersNames.categories.length,
                              action: (key) => this.openDrawer(key),
                              condition:
                                  this.selectedSection && this.selectedSection.type === 'projects',
                          },
                      }
                    : {}),
                all: {
                    label: this.$t('search.all-filters'),
                    count: this.selectedFiltersTotal,
                    action: (key) => this.openDrawer(key),
                    condition:
                        (this.selectedSection && this.selectedSection.type === 'projects') ||
                        (this.selectedSection && this.selectedSection.type === 'people'),
                },
            }
        },

        selectedFiltersTotal() {
            function safeArrayLength(arr) {
                return arr ? arr.length : 0
            }

            return (
                safeArrayLength(this.selectedFilters.languages) +
                safeArrayLength(this.selectedFilters.sdgs) +
                safeArrayLength(this.selectedFilters.categories) +
                safeArrayLength(this.selectedFilters.tags) +
                safeArrayLength(this.selectedFilters.skills)
            )
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
            return this.selectedFilters.languages.map((language) =>
                this.$t(`language.label-${language}`)
            )
        },

        sdgNames() {
            return this.selectedFilters.sdgs.map((sdg) => {
                if (typeof sdg === 'string') return this.$t(`sdg.${sdg}.title`)
                return this.$t(`sdg.${sdg.id}.title`)
            })
        },

        categoryNames() {
            return this.selectedFilters.categories.map((cat) => cat.name)
        },

        tagNames() {
            const wikipediaTagsNames = this.wikipediaTags.map(
                (wikiTag) =>
                    wikiTag[`name_${this.$store.state.languages.current}`] || wikiTag['name']
            )
            const organizationTagsNames = this.organizationTags.map((orgTag) => orgTag.name)

            return [...wikipediaTagsNames, ...organizationTagsNames]
        },

        skillsName() {
            return this.selectedFilters.skills.map((skill) => skill.name)
        },
    },

    methods: {
        adaptToParent(filters) {
            const adaptedFilters = {
                search: filters.search,
                categories: filters.categories.map((cat) => cat.id),
                languages: filters.languages,
                sdgs: filters.sdgs,
                wikipedia_tags: this.wikipediaTags.map((tag) => tag.wikipedia_qid),
                organization_tags: this.organizationTags.map((tag) => tag.id),
                organizations: [this.$store.state.organizations.current.code],
                skills: filters.skills.map((tag) => tag.wikipedia_qid),
            }
            delete adaptedFilters['tags']
            return adaptedFilters
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

        getSection(sectionType) {
            return (
                this.sectionFilters.find((sec) => sec.type === sectionType) ||
                this.sectionFilters[0]
            )
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
                this.selectedSection = this.getSection(neo)
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.search-block {
    max-width: pxToRem(800px);
    margin: 0 auto;
    padding: $space-m 0;
}

.search-block.inline {
    max-width: none;
    flex-grow: 1;
    padding: 0;
    padding-right: $space-xl;
}

.add-filter {
    margin-top: $space-l;

    &__title {
        font-size: $font-size-xs;
        font-weight: 700;
        text-align: center;
        margin-bottom: $space-m;
        margin-top: $font-size-3xl;
        color: $dark;
    }
}

.add-filter__button-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $space-m;

    &__button {
        background: $white;
        border: $border-width-s solid $green;
        padding: $space-s $space-m;
        height: 32px;
        box-sizing: border-box;
        border-radius: $border-radius-l;
        text-transform: uppercase;
        font-size: $font-size-s;
        color: $primary-dark;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }

        &--selected {
            font-weight: 700;
            border: $border-width-m solid $primary-dark;
        }

        &--hide {
            display: none;
        }
    }
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
    color: $dark;
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
    display: flex;
    flex-flow: column-reverse wrap;
    align-items: center;

    .search-button {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-width: 0;
        background: $white;
        border-color: $green;
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
    margin-bottom: 24px;

    @media (min-width: $min-tablet) {
        margin-bottom: 0;
    }
}
</style>
