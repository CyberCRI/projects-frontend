import type { ProjectCategoryOutput } from '@/models/project-category.model'
import { getAllProjectCategories, ProjectCategoryParams } from '@/api/project-categories.service'
import type { APIResponseList } from '@/api/types'
import { toRaw } from 'vue'
import { useRuntimeConfig } from '#imports'
import { defineStore } from 'pinia'

export interface ProjectCategoriesState {
  all: ProjectCategoryOutput[]
}

export interface ProjectCategoriesMap {
  [key: number]: ProjectCategoryOutput
}

const useProjectCategoriesStore = defineStore('projectCategories', {
  state: (): ProjectCategoriesState => ({
    all: [],
  }),

  getters: {
    allByIds(): ProjectCategoriesMap {
      return this.all.reduce((acc, category) => {
        acc[category.id] = category
        return acc
      }, {})
    },

    allBySlugs(): ProjectCategoriesMap {
      return this.all.reduce((acc, category) => {
        if (category.slug) acc[category.slug] = category
        return acc
      }, {})
    },

    hierarchy(): ProjectCategoryOutput[] {
      const orderCategories = (a, b) => a.order_index - b.order_index
      const hydrateChildren = (cat) => {
        cat.children =
          cat?.children?.map((child) => toRaw(this.allByIds[child.id]))?.sort(orderCategories) || []
        cat.children?.forEach(hydrateChildren)
      }
      const rootCategories =
        this.all
          ?.map(toRaw)
          .sort(orderCategories)
          ?.filter((category) => !category.hierarchy?.length) || []
      rootCategories.forEach(hydrateChildren)
      return rootCategories
    },

    // TODO: replace by allByIds[id]
    // getOneById: (state: ProjectCategoriesState) => (id) =>
    //     state.all.find((category: ProjectCategoryOutput) => category.id === Number(id)),

    // TODO: what's the use ?
    allOrderedByOrderId(): ProjectCategoryOutput[] {
      const orderedList = [...this.all]

      return orderedList.sort((a: ProjectCategoryOutput, b: ProjectCategoryOutput) => {
        if (a.order_index > b.order_index) {
          return 1
        }
        if (a.order_index < b.order_index) {
          return -1
        }
        return 0
      })
    },
  },

  actions: {
    getAllProjectCategories(
      params: ProjectCategoryParams = {}
    ): Promise<APIResponseList<ProjectCategoryOutput>> {
      // If no organization set in the param use default one
      // TODO check why rootState.organizations.current is sometimes null
      // the fallback on env value is a temporary fix
      const runtimeConfig = useRuntimeConfig()
      if (!params.organization) params.organization = runtimeConfig.public.appApiOrgCode

      return new Promise((resolve, reject) => {
        getAllProjectCategories(params)
          .then((response) => {
            // Only store project categories from org
            // Except in "TheAdvancedProjectOptions" where we need all project categories from every org
            //commit('SET_PROJECT_CATEGORIES', response.results)
            this.all = response.results
            resolve(response)
          })
          .catch((error) => {
            console.error('Error getting the categories', error)
            reject(error)
          })
      })
    },
  },
})

export default useProjectCategoriesStore
