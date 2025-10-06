import type { ProjectCategoryOutput } from '@/models/project-category.model'
import {
  getAllProjectCategories as apiGetAllProjectCategories,
  ProjectCategoryParams,
} from '@/api/project-categories.service'
import type { APIResponseList } from '@/api/types'
import { useRuntimeConfig } from '#imports'
import { defineStore } from 'pinia'
import useAutoTranslate from '@/composables/useAutoTranslate'

export interface ProjectCategoriesState {
  all: ProjectCategoryOutput[]
}

export interface ProjectCategoriesMap {
  [key: number]: ProjectCategoryOutput
}

const useProjectCategoriesStore = defineStore('projectCategories', () => {
  const _all = ref([])
  const { translateCategories } = useAutoTranslate()
  const all = translateCategories(_all)

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
  const getAllProjectCategories = (
    params: ProjectCategoryParams = {}
  ): Promise<APIResponseList<ProjectCategoryOutput>> => {
    // If no organization set in the param use default one
    // TODO check why rootState.organizations.current is sometimes null
    // the fallback on env value is a temporary fix
    const runtimeConfig = useRuntimeConfig()
    if (!params.organization) params.organization = runtimeConfig.public.appApiOrgCode

    return new Promise((resolve, reject) => {
      apiGetAllProjectCategories(params)
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

  return {
    all,
    allByIds,
    allBySlugs,
    hierarchy,
    allOrderedByOrderId,
    getAllProjectCategories,
    // for unit tests only
    _all,
  }
})

export default useProjectCategoriesStore
