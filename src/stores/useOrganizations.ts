import { defineStore } from 'pinia'
import {
  getOrganizationByCode,
  getOrganizations,
  patchOrganization,
} from '@/api/organizations.service'

import type { APIResponseList } from '@/api/types'
import type { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import analytics from '@/analytics'

import useAutoTranslate from '@/composables/useAutoTranslate'

export interface OrganizationsState {
  _all: OrganizationOutput[]
  _current: OrganizationOutput | null
}

const useOrganizationsStore = defineStore('organizations', () => {
  const { translateOrganization, translateOrganizations } = useAutoTranslate()

  const _all = ref([])
  const _current = ref(null)

  const all = translateOrganizations(_all)
  const current = translateOrganization(_current)

  const isDefault = computed((): boolean => {
    return current.value?.code === 'DEFAULT'
  })

  const languages = computed((): string[] => {
    return current.value?.languages || []
  })

  const allClassifications = computed((): object[] => {
    const index = {}
    current.value?.enabled_projects_tag_classifications.forEach((classification: any) => {
      if (!index[classification.id]) {
        index[classification.id] = classification
      }
      index[classification.id].is_enabled_for_projects = true
    })

    current.value?.enabled_skills_tag_classifications.forEach((classification: any) => {
      if (!index[classification.id]) {
        index[classification.id] = classification
      }
      index[classification.id].is_enabled_for_skills = true
    })
    return Object.values(index)
  })

  async function getCurrentOrganization(code: string): Promise<OrganizationOutput> {
    try {
      // foo
      const organization = await getOrganizationByCode(code)
      // TODO: temp fix while API is not setup
      organization.languages = organization.languages || ['en', 'fr']

      _current.value = organization
      analytics.setOrganizationProperties()

      return organization
    } catch (err) {
      throw new Error(err)
    }
  }

  async function getAllOrganizations(): Promise<APIResponseList<OrganizationOutput>> {
    try {
      const response = await getOrganizations()
      _all.value = response.results

      return response
    } catch (err) {
      throw new Error(err)
    }
  }

  async function updateCurrentOrganization(
    organization: OrganizationPatchInput | FormData
  ): Promise<OrganizationOutput> {
    try {
      const result = await patchOrganization(current.value.code, organization)
      const currentOrganization = { ...current.value, ...organization, ...result }
      _current.value = currentOrganization
      return currentOrganization
    } catch (err) {
      throw new Error(err)
    }
  }

  return {
    // state
    all,
    current,
    // getters
    isDefault,
    languages,
    allClassifications,
    // actions
    getCurrentOrganization,
    getAllOrganizations,
    updateCurrentOrganization,
    // needed in unit test, shouldn't be used anywhere else
    _all,
    _current,
  }
})

export default useOrganizationsStore
