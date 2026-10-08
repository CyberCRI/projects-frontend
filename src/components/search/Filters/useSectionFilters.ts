import type { QueryFilterSearch } from 'shared-projects-frontend/models'
import type { IconImageChoice } from '~/functs/IconImage'

type SearchSection = QueryFilterSearch['types'][number]
export const ALL_SECTION_KEY = 'all'
export const PROJECT_SECTION_KEY: SearchSection = 'project'
export const GROUP_SECTION_KEY: SearchSection = 'people_group'
export const PEOPLE_SECTION_KEY: SearchSection = 'user'

export type AllSearchSections = 'all' | SearchSection

type Section = {
  action: (key: string) => void
  clear: (key: string) => void
  names?: string[]
  leftIcon?: IconImageChoice
  rightIcon?: IconImageChoice
  label: string
  dataTest: string
  condition: boolean
  isSelected: boolean
  isUnused: boolean
}

export default function useSectionFilters({
  selectedSection,
}: {
  selectedSection: Ref<AllSearchSections>
}) {
  const { t } = useNuxtI18n()

  function toggleSectionFilter(key) {
    console.log(key, selectedSection.value)
    selectedSection.value = selectedSection.value == key ? ALL_SECTION_KEY : key
  }

  const sectionFilters = computed(() => {
    const isAllSection = !selectedSection.value || selectedSection.value === ALL_SECTION_KEY
    const isProjectSection = selectedSection.value === PROJECT_SECTION_KEY
    const isGroupSection = selectedSection.value === GROUP_SECTION_KEY
    const isUserSection = selectedSection.value === PEOPLE_SECTION_KEY

    return {
      [ALL_SECTION_KEY]: {
        action: toggleSectionFilter,
        clear: toggleSectionFilter,
        names: [],
        leftIcon: 'BarsStaggered',
        label: t('search.all-section'),
        dataTest: 'all-sections-button',
        condition: false,
        isSelected: isAllSection,
        isUnused: false,
      },
      [PROJECT_SECTION_KEY]: {
        action: toggleSectionFilter,
        clear: toggleSectionFilter,
        names: [],
        leftIcon: 'Briefcase',
        label: t('search.projects-section'),
        dataTest: 'project-section-button',
        condition: isAllSection || isProjectSection,
        isSelected: isProjectSection,
        isUnused: false,
      },
      [GROUP_SECTION_KEY]: {
        action: toggleSectionFilter,
        clear: toggleSectionFilter,
        names: [],
        leftIcon: 'PeopleGroup',
        label: t('search.groups'),
        dataTest: 'group-section-button',
        condition: isAllSection || isGroupSection,
        isSelected: isGroupSection,
        isUnused: false,
      },
      [PEOPLE_SECTION_KEY]: {
        action: toggleSectionFilter,
        clear: toggleSectionFilter,
        leftIcon: 'Account',
        label: t('search.peoples'),
        dataTest: 'person-section-button',
        condition: isAllSection || isUserSection,
        isSelected: isUserSection,
        isUnused: false,
      },
    } as {
      [key: string]: Section
    }
  })

  return {
    sectionFilters,
  }
}
