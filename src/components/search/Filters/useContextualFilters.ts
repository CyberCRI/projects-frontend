import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useSectionFilters, {
    PROJECT_SECTION_KEY,
    PEOPLE_SECTION_KEY,
} from '@/components/search/Filters/useSectionFilters'

import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import LanguageFilter from '@/components/search/Filters/LanguageFilter.vue'
import TagsFilterSummary from '@/components/search/Filters/TagsFilterSummary.vue'
import SkillsFilterSummary from '@/components/search/Filters/SkillsFilterSummary.vue'
import SkillsFilterEditor from '@/components/search/Filters/SkillsFilterEditor.vue'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import CategoriesFilterSummary from '@/components/search/Filters/CategoriesFilterSummary.vue'
import CategoriesFilterEditor from '@/components/search/Filters/CategoriesFilterEditor.vue'

export const ALL_FILTERS_MODE = 'all-filters'

export default function useContextualFilters({
    selectedSection,
    selectedFilters,
    filterBlackList,
    openDrawer,
    clearSelectedFilters,
    showSectionFilter,
}) {
    const { t } = useI18n()

    const store = useStore()

    const { sectionFilters } = useSectionFilters({ selectedSection })

    const contextualFilters = computed(() => {
        return {
            // TAGS
            tags: makeFilterButton({
                label: t('search.tag'),
                names: filterBlackList.value.includes('tags')
                    ? []
                    : selectedFilters.value?.tags?.map((tag) => {
                          if (tag.wikipedia_qid) {
                              // wikipedia tags
                              return tag[`name_${store.state.languages.current}`] || tag['name']
                          } else {
                              // org tags
                              return tag.name
                          }
                      }) || [],
                dataTest: 'contextual-filter-tags',
                condition:
                    selectedSection.value === PROJECT_SECTION_KEY &&
                    !filterBlackList.value.includes('tags'),
                // drawer config part
                title: 'tag',
                toggleable: true,
                componentSummary: TagsFilterSummary,
                componentEditor: TagsFilterEditor,
            }),
            // SDGS
            sdgs: makeFilterButton({
                label: t('search.sdg'),
                names: filterBlackList.value.includes('sdgs')
                    ? []
                    : selectedFilters.value?.sdgs?.map((sdg) => {
                          if (typeof sdg === 'string') return t(`sdg.${sdg}.title`)
                          return t(`sdg.${sdg.id}.title`)
                      }) || [],
                dataTest: 'contextual-filter-sdgs',
                condition:
                    (selectedSection.value === PROJECT_SECTION_KEY ||
                        selectedSection.value === PEOPLE_SECTION_KEY) &&
                    !filterBlackList.value.includes('sdgs'),
                // drawer config part
                title: 'sdg',
                componentSummary: SdgsFilter,
                componentEditor: SdgsFilter,
                toggleable: false,
            }),
            // LANGUAGES
            languages: makeFilterButton({
                label: t('search.language'),
                names: filterBlackList.value.includes('languages')
                    ? []
                    : selectedFilters.value?.languages?.map((language) =>
                          t(`language.label-${language}`)
                      ) || [],
                condition:
                    selectedSection.value === PROJECT_SECTION_KEY &&
                    !filterBlackList.value.includes('languages'),
                dataTest: 'contextual-filter-languages',
                // drawer config part
                title: 'language',
                componentSummary: LanguageFilter,
                componentEditor: LanguageFilter,
                toggleable: false,
            }),
            // SKILLS
            skills: makeFilterButton({
                label: t('search.skills'),
                names: filterBlackList.value.includes('skills')
                    ? []
                    : selectedFilters.value?.skills?.map((skill) => skill.name) || [],
                condition:
                    selectedSection.value === PEOPLE_SECTION_KEY &&
                    !filterBlackList.value.includes('skills'),
                dataTest: 'contextual-filter-skills',
                // drawer config part
                title: 'skills',
                toggleable: true,
                componentSummary: SkillsFilterSummary,
                componentEditor: SkillsFilterEditor,
            }),
            // CATEGORIES
            ...(store.getters['projectCategories/all'].length
                ? {
                      categories: makeFilterButton({
                          label: t('search.category'),
                          names: filterBlackList.value.includes('categories')
                              ? []
                              : selectedFilters.value?.categories?.map((cat) => cat.name) || [],
                          condition:
                              selectedSection.value === PROJECT_SECTION_KEY &&
                              !filterBlackList.value.includes('categories'),
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
    })

    const selectedFiltersTotal = computed(() => {
        function safeArrayLength(arr) {
            return arr ? arr.length : 0
        }
        const count = ['languages', 'sdgs', 'categories', 'tags', 'skills'].reduce(
            (acc, filter) =>
                acc +
                (filterBlackList.value.includes(filter)
                    ? 0
                    : safeArrayLength(selectedFilters.value[filter])),
            0
        )
        return count
    })

    const filterButtons = computed(() => {
        return {
            ...(showSectionFilter?.value ? sectionFilters.value : {}),
            ...contextualFilters.value,
            // ALL FILTERS
            [ALL_FILTERS_MODE]: makeFilterButton({
                label: t('search.all-filters'),
                forceCount: selectedFiltersTotal.value,
                condition:
                    selectedSection.value === PROJECT_SECTION_KEY ||
                    selectedSection.value === PEOPLE_SECTION_KEY,
            }),
        }
    })

    function makeFilterButton(config) {
        const count = config.forceCount || config.names?.length || 0
        const labelWithCount = config.label + (count ? ` (${count})` : '')
        const label = config.names?.length == 1 ? config.names[0] : labelWithCount
        return {
            ...config,
            label,
            isUnused: !count,
            isSelected: count > 0,
            action: openDrawer,
            clear: clearSelectedFilters,
        }
    }

    return { sectionFilters, contextualFilters, filterButtons, selectedFiltersTotal }
}
