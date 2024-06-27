import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const ALL_SECTION_KEY = 'all'
export const PROJECT_SECTION_KEY = 'projects'
export const GROUP_SECTION_KEY = 'groups'
export const PEOPLE_SECTION_KEY = 'people'
// TODO
// !this.showSectionDropDown && this.showSectionFilter &&

export default function useSectionFilters(selectedSection) {
    const { t } = useI18n()

    function toggleSectionFilter(key) {
        // TODO
        // this.clearSelectedFilters()
        selectedSection.value = selectedSection.value == key ? ALL_SECTION_KEY : key
    }

    const sectionFilters = computed(() => {
        return {
            [ALL_SECTION_KEY]: {
                action: toggleSectionFilter,
                clear: toggleSectionFilter,
                names: [],
                leftIcon: 'BarsStaggered',
                label: t('search.all-section'),
                dataTest: 'all-sections-button',
                condition: false,
                isSelected: !selectedSection.value || selectedSection.value === ALL_SECTION_KEY,
                isUnused: false,
            },
            [PROJECT_SECTION_KEY]: {
                action: toggleSectionFilter,
                clear: toggleSectionFilter,
                names: [],
                leftIcon: 'Briefcase',
                label: t('search.projects-section'),
                dataTest: 'project-section-button',
                condition:
                    selectedSection.value == ALL_SECTION_KEY ||
                    selectedSection.value == PROJECT_SECTION_KEY,
                isSelected: selectedSection.value === PROJECT_SECTION_KEY,
                isUnused: false,
            },
            [GROUP_SECTION_KEY]: {
                action: toggleSectionFilter,
                clear: toggleSectionFilter,
                names: [],
                leftIcon: 'PeopleGroup',
                label: t('search.groups'),
                dataTest: 'group-section-button',
                condition:
                    selectedSection.value == ALL_SECTION_KEY ||
                    selectedSection.value == GROUP_SECTION_KEY,
                isSelected: selectedSection.value === GROUP_SECTION_KEY,
                isUnused: false,
            },
            [PEOPLE_SECTION_KEY]: {
                action: toggleSectionFilter,
                clear: toggleSectionFilter,
                leftIcon: 'Account',
                label: t('search.peoples'),
                dataTest: 'person-section-button',
                condition:
                    selectedSection.value == ALL_SECTION_KEY ||
                    selectedSection.value == PEOPLE_SECTION_KEY,
                isSelected: selectedSection.value === PEOPLE_SECTION_KEY,
                isUnused: false,
            },
        }
    })

    return {
        sectionFilters,
    }
}
