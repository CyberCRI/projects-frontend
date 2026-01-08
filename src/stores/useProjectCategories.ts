import type { ProjectCategoryOutput } from '@/models/project-category.model'
import useOrganizationCode from '@/composables/useOrganizationCode'
import {
  getAllProjectCategories as apiGetAllProjectCategories,
  getRootProjectCategory as apiGetRootProjectCategory,
} from '@/api/project-categories.service'
import type { APIResponseList } from '@/api/types'
import { defineStore } from 'pinia'
import useAutoTranslate from '@/composables/useAutoTranslate'

export interface ProjectCategoriesState {
  all: ProjectCategoryOutput[]
  root: ProjectCategoryOutput
}

export interface ProjectCategoriesMap {
  [key: number]: ProjectCategoryOutput
}

const useProjectCategoriesStore = defineStore('projectCategories', () => {
  const _all = ref([])
  const { translateCategories, translateCategory } = useAutoTranslate()
  const all = translateCategories(_all)
  const _root = ref(null)
  const root = translateCategory(_root)

  const allByIds = computed<ProjectCategoriesMap>(() => {
    return all.value.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {})
  })

  const allBySlugs = computed<ProjectCategoriesMap>(() => {
    return all.value.reduce((acc, category) => {
      if (category.slug) acc[category.slug] = category
      return acc
    }, {})
  })

  const hierarchy = computed<ProjectCategoryOutput[]>(() => {
    const orderCategories = (a, b) => a.order_index - b.order_index
    const hydrateChildren = (cat) => {
      cat.children =
        cat?.children?.map((child) => unref(allByIds)[child.id])?.sort(orderCategories) || []
      cat.children?.forEach(hydrateChildren)
    }
    const clone = (x) => JSON.parse(JSON.stringify(x))
    const rootCategories =
      unref(all)
        ?.map(unref)
        .map(clone)
        .sort(orderCategories)
        ?.filter((category) => !category.hierarchy?.length) || []
    rootCategories.forEach(hydrateChildren)
    return rootCategories
  })

  // TODO: replace by allByIds[id]
  // getOneById: (state: ProjectCategoriesState) => (id) =>
  //     state.all.find((category: ProjectCategoryOutput) => category.id === Number(id)),

  // TODO: what's the use ?
  const allOrderedByOrderId = computed<ProjectCategoryOutput[]>(() => {
    const orderedList = [...all.value]

    return orderedList.sort((a: ProjectCategoryOutput, b: ProjectCategoryOutput) => {
      if (a.order_index > b.order_index) {
        return 1
      }
      if (a.order_index < b.order_index) {
        return -1
      }
      return 0
    })
  })

  // actions: {
  const getAllProjectCategories = (): Promise<APIResponseList<ProjectCategoryOutput>> => {
    // If no organization set in the param use default one
    // TODO check why rootState.organizations.current is sometimes null
    // the fallback on env value is a temporary fix
    const organizationCode = useOrganizationCode()

    return new Promise((resolve, reject) => {
      apiGetAllProjectCategories(organizationCode)
        .then((response) => {
          // Only store project categories from org
          // Except in "TheAdvancedProjectOptions" where we need all project categories from every org
          //commit('SET_PROJECT_CATEGORIES', response.results)
          _all.value = response.results
          resolve(response)
        })
        .catch((error) => {
          console.error('Error getting the categories', error)
          reject(error)
        })
    })
  }

  const getRootProjectCategory = (): Promise<ProjectCategoryOutput> => {
    // If no organization set in the param use default one
    // TODO check why rootState.organizations.current is sometimes null
    // the fallback on env value is a temporary fix
    const organizationCode = useOrganizationCode()

    return new Promise((resolve, reject) => {
      apiGetRootProjectCategory(organizationCode)
        .then((response) => {
          // Only store project categories from org
          // Except in "TheAdvancedProjectOptions" where we need all project categories from every org
          //commit('SET_PROJECT_CATEGORIES', response.results)
          _root.value = response
          resolve(response)
        })
        .catch((error) => {
          console.error('Error getting the categories', error)
          reject(error)
        })
    })
  }

  return {
    all,
    root,
    allByIds,
    allBySlugs,
    hierarchy,
    allOrderedByOrderId,
    getAllProjectCategories,
    getRootProjectCategory,
    // for unit tests only
    _all,
    _root,
  }
})

export default useProjectCategoriesStore
