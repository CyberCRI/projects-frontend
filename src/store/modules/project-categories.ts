import { ProjectCategoryOutput } from '@/models/project-category.model'
import { getAllProjectCategories, ProjectCategoryParams } from '@/api/project-categories.service'
import { APIResponseList } from '@/api/types'
import { toRaw } from 'vue'

export interface ProjectCategoriesState {
    all: ProjectCategoryOutput[]
}

const state = (): ProjectCategoriesState => ({
    all: [],
})

const getters = {
    all: (state: ProjectCategoriesState) => state.all,
    allByIds: (state: ProjectCategoriesState) =>
        state.all.reduce((acc, category) => {
            acc[category.id] = category
            return acc
        }, {}),
    hierarchy: (state: ProjectCategoriesState, getters) => {
        const orderCategories = (a, b) => a.order_index - b.order_index
        function hydrateChildren(cat) {
            cat.children =
                cat?.children
                    ?.map((child) => toRaw(getters.allByIds[child.id]))
                    ?.sort(orderCategories) || []
            cat.children?.forEach(hydrateChildren)
        }
        const rootCategories =
            state.all
                ?.map(toRaw)
                .sort(orderCategories)
                ?.filter((category) => !category.hierarchy?.length) || []
        rootCategories.forEach(hydrateChildren)
        return rootCategories
    },
    getOneById: (state: ProjectCategoriesState) => (id) =>
        state.all.find((category: ProjectCategoryOutput) => category.id === Number(id)),
    allOrderedByOrderId: (state: ProjectCategoriesState) => {
        const orderedList = [...state.all]

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
}

const actions = {
    getAllProjectCategories(
        { commit, rootState },
        params: ProjectCategoryParams = {}
    ): Promise<APIResponseList<ProjectCategoryOutput>> {
        // If no organization set in the param use default one
        // TODO check why rootState.organizations.current is sometimes null
        // the fallback on env value is a temporary fix
        if (!params.organization)
            params.organization =
                rootState.organizations?.current?.code || import.meta.env.VITE_APP_ORG_CODE

        return new Promise((resolve, reject) => {
            getAllProjectCategories(params)
                .then((response) => {
                    // Only store project categories from org
                    // Except in "TheAdvancedProjectOptions" where we need all project categories from every org
                    commit('SET_PROJECT_CATEGORIES', response.results)
                    resolve(response)
                })
                .catch((error) => {
                    console.error('Error getting the categories', error)
                    reject(error)
                })
        })
    },
}

const mutations = {
    SET_PROJECT_CATEGORIES(
        state: ProjectCategoriesState,
        categories: ProjectCategoryOutput[]
    ): void {
        state.all = categories
    },
    UPDATE_PROJECT_CATEGORY(state: ProjectCategoriesState, category: ProjectCategoryOutput): void {
        const categoryIndex = state.all.findIndex(
            (cat: any) => cat.id.$oid === category.id || cat.id === category.id
        )
        // TODO check in npow work directly in vue 3
        // Vue.set(state.all, categoryIndex, category)
        state.all[categoryIndex] = category
    },
    ADD_PROJECT_CATEGORY(state: ProjectCategoriesState, category: ProjectCategoryOutput): void {
        state.all.push(category)
    },
    DELETE_PROJECT_CATEGORY(state: ProjectCategoriesState, categoryId: number) {
        const index = state.all.findIndex(
            (category: ProjectCategoryOutput) => category.id === categoryId
        )
        state.all.splice(index, 1)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
