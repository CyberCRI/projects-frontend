import Vue from 'vue'

import {
    ProjectCategoryCreateInput,
    ProjectCategoryOutput,
    ProjectCategoryPatchInput,
} from '@/models/project-category.model'
import {
    createProjectCategory,
    deleteProjectCategory,
    getAllProjectCategories,
    patchProjectCategory,
    ProjectCategoryParams,
} from '@/api/project-categories.service'
import { APIResponseList } from '@/api/types'

export interface ProjectCategoriesState {
    all: ProjectCategoryOutput[]
}

const state = (): ProjectCategoriesState => ({
    all: [],
})

const getters = {
    all: (state: ProjectCategoriesState) => state.all,
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
        if (!params.organization) params.organization = rootState.organizations.current.code

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
    updateProjectCategory(
        { commit, dispatch },
        {
            categoryId,
            newCategory,
        }: { categoryId: number; newCategory: ProjectCategoryPatchInput | FormData }
    ): Promise<ProjectCategoryOutput> {
        return new Promise((resolve, reject) => {
            patchProjectCategory(categoryId, newCategory)
                .then((response) => {
                    commit('UPDATE_PROJECT_CATEGORY', response)
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    updateProjectCategoriesOrder(
        { commit, dispatch },
        { reordered }: { reordered: Array<{ categoryId: number; index: number }> }
    ): Promise<Array<ProjectCategoryOutput>> {
        return new Promise((resolve, reject) => {
            Promise.all(
                reordered.map((item) =>
                    patchProjectCategory(item.categoryId, { order_index: item.index })
                )
            )
                .then(async (response) => {
                    await dispatch('getAllProjectCategories') // Fetch all categories to update order
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    addProjectCategory(
        { commit },
        newCategory: ProjectCategoryCreateInput | FormData
    ): Promise<ProjectCategoryOutput> {
        return new Promise((resolve, reject) => {
            createProjectCategory(newCategory)
                .then((response) => {
                    commit('ADD_PROJECT_CATEGORY', response)
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    deleteProjectCategory({ commit }, categoryId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            deleteProjectCategory(categoryId)
                .then(() => {
                    commit('DELETE_PROJECT_CATEGORY', categoryId)
                    resolve(categoryId)
                })
                .catch((error) => {
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
