<template>
    <Drawer
        v-if="mode"
        :confirm-action-name="$t('common.confirm')"
        :is-opened="isOpened"
        :title="drawerTitle"
        class="small"
        @close="close"
        @confirm="confirm"
    >
        <template v-if="focusedFilter || mode !== allFiltersMode" #header_prefix>
            <span class="icon-back" @click="closeFocusedOrModeFilter"
                ><IconImage name="ArrowLeft"
            /></span>
        </template>

        <template v-if="mode === allFiltersMode">
            <Component
                :is="filters[focusedFilter].componentEditor"
                v-if="focusedFilter"
                v-model="selection[focusedFilter]"
                :ambiguous-tags-open="ambiguousTagsOpen"
                @ambiguous-menu="toggleAmbiguousMenu"
            />

            <div v-else v-for="(filter, key) in filters" :key="key" class="filter-wrapper">
                <FilterWrapper
                    v-if="filter.condition"
                    :filter-key="key"
                    :has-filters="filter.hasFilters"
                    :is-toggleable="filter.toggleable"
                    @toggle-filter="toggleFilter"
                >
                    <template #header>
                        {{ $filters.capitalize($t(`search.${filter.title}`)) }}
                    </template>
                    <component :is="filter.componentSummary" v-model="selection[key]" />
                </FilterWrapper>
            </div>
        </template>
        <template v-else>
            <Component
                :is="filters[mode].componentEditor"
                v-model="selection[mode]"
                :ambiguous-tags-open="ambiguousTagsOpen"
                @ambiguous-menu="toggleAmbiguousMenu"
            />
        </template>
    </Drawer>
</template>

<script>
import Drawer from '@/components/base/BaseDrawer.vue'
import FilterWrapper from '@/components/search/Filters/FilterWrapper.vue'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import LanguageFilter from '@/components/search/Filters/LanguageFilter.vue'
import TagsFilterSummary from '@/components/search/Filters/TagsFilterSummary.vue'
import SkillsFilterSummary from '@/components/search/Filters/SkillsFilterSummary.vue'
import SkillsFilterEditor from '@/components/search/Filters/SkillsFilterEditor.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import CategoriesFilterSummary from '@/components/search/Filters/CategoriesFilterSummary.vue'
import CategoriesFilterEditor from '@/components/search/Filters/CategoriesFilterEditor.vue'
import IconImage from '@/components/base/media/IconImage.vue'

const ALL_FILTERS_MODE = 'all-filters'

export default {
    name: 'FiltersDrawer',

    emits: ['confirm', 'close'],

    components: { FilterWrapper, Drawer, SdgsFilter, LanguageFilter, IconImage },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },

        mode: {
            type: String,
            required: true,
        },

        preselection: {
            type: Object,
            required: true,
        },
        selectedSection: {
            type: String,
            default: ALL_FILTERS_MODE,
        },
        filterBlackList: {
            // filters we dont want to show/edit but are still active (i.e. categories in category page)
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            selection: JSON.parse(JSON.stringify(this.preselection)),
            focusedFilter: null,
            ambiguousTagsOpen: false,
            allFiltersMode: ALL_FILTERS_MODE,
        }
    },

    computed: {
        filters() {
            return {
                tags: {
                    title: 'tag',
                    toggleable: true,
                    componentSummary: TagsFilterSummary,
                    componentEditor: TagsFilterEditor,
                    hasFilters: this.selection['tags'].length > 0,
                    condition:
                        this.selectedSection === 'projects' &&
                        !this.filterBlackList.includes('tags'),
                },
                sdgs: {
                    title: 'sdg',
                    componentSummary: SdgsFilter,
                    componentEditor: SdgsFilter,
                    toggleable: false,
                    hasFilters: true,
                    condition: !this.filterBlackList.includes('sdgs'),
                },
                skills: {
                    title: 'skills',
                    toggleable: true,
                    componentSummary: SkillsFilterSummary,
                    componentEditor: SkillsFilterEditor,
                    hasFilters: this.selection['skills'].length > 0,
                    condition:
                        this.selectedSection === 'people' &&
                        !this.filterBlackList.includes('skills'),
                },
                languages: {
                    title: 'language',
                    componentSummary: LanguageFilter,
                    componentEditor: LanguageFilter,
                    toggleable: false,
                    hasFilters: true,
                    condition:
                        this.selectedSection === 'projects' &&
                        !this.filterBlackList.includes('languages'),
                },
                // TODO
                // localization: {
                //     title: 'Localisation',
                // },

                ...(this.$store.getters['projectCategories/all'].length
                    ? {
                          categories: {
                              title: 'category',
                              toggleable: true,
                              componentSummary: CategoriesFilterSummary,
                              componentEditor: CategoriesFilterEditor,
                              hasFilters: this.selection['categories'].length > 0,
                              condition:
                                  this.selectedSection === 'projects' &&
                                  !this.filterBlackList.includes('categories'),
                          },
                      }
                    : {}),
            }
        },
        drawerTitle() {
            if (this.mode === this.allFiltersMode) {
                if (this.focusedFilter) {
                    const title = this.filters[this.focusedFilter].title
                    return this.$t(`search.${title}`)
                }

                return this.$t('search.all-filters')
            }

            const title =
                this.mode === 'tags' && this.ambiguousTagsOpen
                    ? 'ambiguousTag'
                    : this.filters[this.mode].title
            return this.$t(`search.${title}`)
        },
    },

    methods: {
        confirm() {
            this.$emit('confirm', this.selection)
        },

        toggleFilter(filterKey) {
            this.focusedFilter = filterKey
        },

        toggleAmbiguousMenu(value) {
            this.ambiguousTagsOpen = value
        },

        closeFocusedOrModeFilter() {
            if (!this.ambiguousTagsOpen)
                if (this.focusedFilter) this.focusedFilter = null
                else this.$emit('close')
            else {
                this.ambiguousTagsOpen = false
            }
        },

        close() {
            this.ambiguousTagsOpen = false
            this.$emit('close')
        },
    },

    watch: {
        isOpened: function () {
            this.selection = JSON.parse(JSON.stringify(this.preselection))
            this.focusedFilter = null
        },
    },
}
</script>

<style lang="scss" scoped>
.icon-back {
    cursor: pointer;
    margin-right: $space-m;

    svg {
        fill: $primary-dark;
        width: 24px;
    }
}

.filter-wrapper {
    border-bottom: $border-width-s solid $primary;

    &:last-child {
        border-bottom: none;
    }

    &:first-child .header {
        margin-top: 0;
    }
}
</style>
