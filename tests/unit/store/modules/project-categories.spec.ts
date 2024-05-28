import projectCategories from '@/store/modules/project-categories'
import {
    createProjectCategory,
    deleteProjectCategory,
    getAllProjectCategories,
    patchProjectCategory,
} from '@/api/project-categories.service'

import {
    ProjectCategoryCreateInputFactory,
    ProjectCategoryOutputFactory,
    ProjectCategoryPatchInputFactory,
} from '../../../factories/project-category.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/project-categories.service')

vi.mock('vuex')
const commit = vi.fn()
const dispatch = vi.fn()
const rootState = { organizations: { current: OrganizationOutputFactory.generate() } }

describe('Store module | categories | getters', () => {
    const state = {
        all: ProjectCategoryOutputFactory.generateMany(4),
    }

    it('getOneById', () => {
        const categoryId = state.all[0].id
        const result = projectCategories.getters.getOneById(state)(categoryId)

        expect(result).toEqual(state.all[0])
    })

    it('allOrderedByOrderId', () => {
        const result = projectCategories.getters.allOrderedByOrderId(state)

        expect(result[0].order_index).toBeLessThan(result[3].order_index)
    })
})

describe('Store module | categories | actions', () => {
    it('getAllProjectCategories', async () => {
        const categories = ProjectCategoryOutputFactory.generateMany(2)
        const getAllProjectCategoriesMock = getAllProjectCategories as Mock

        getAllProjectCategoriesMock.mockResolvedValue({ results: categories })

        await projectCategories.actions.getAllProjectCategories({ commit, rootState }, {})

        expect(commit).toHaveBeenCalledWith('SET_PROJECT_CATEGORIES', categories)
    })

    it('updateProjectCategory', async () => {
        const categoryId = 1
        const newCategory = ProjectCategoryPatchInputFactory.generate()
        const patchProjectCategoryMock = patchProjectCategory as Mock

        patchProjectCategoryMock.mockResolvedValue(newCategory)

        await projectCategories.actions.updateProjectCategory(
            { commit, dispatch },
            {
                categoryId,
                newCategory,
            }
        )

        expect(commit).toHaveBeenCalledWith('UPDATE_PROJECT_CATEGORY', newCategory)
    })

    it('updateProjectCategoriesOrder', async () => {
        const categoryId = 1
        const index = 0
        const newCategory = ProjectCategoryPatchInputFactory.generate()
        const patchProjectCategoryMock = patchProjectCategory as Mock

        patchProjectCategoryMock.mockResolvedValue(newCategory)

        await projectCategories.actions.updateProjectCategoriesOrder(
            { commit, dispatch },
            {
                reordered: [
                    {
                        categoryId,
                        index,
                    },
                ],
            }
        )

        expect(dispatch).toHaveBeenCalledWith('getAllProjectCategories')
    })

    it('createProjectCategory', async () => {
        const newCategory = ProjectCategoryCreateInputFactory.generate()
        const createProjectCategoryMock = createProjectCategory as Mock

        createProjectCategoryMock.mockResolvedValue(newCategory)

        await projectCategories.actions.addProjectCategory({ commit }, newCategory)

        expect(commit).toHaveBeenCalledWith('ADD_PROJECT_CATEGORY', newCategory)
    })

    it('deleteProjectCategory', async () => {
        const categoryId = 1
        const deleteProjectCategoryMock = deleteProjectCategory as Mock

        deleteProjectCategoryMock.mockResolvedValue(categoryId)

        await projectCategories.actions.deleteProjectCategory({ commit }, categoryId)

        expect(commit).toHaveBeenCalledWith('DELETE_PROJECT_CATEGORY', categoryId)
    })
})

describe('Store module | categories | mutations', () => {
    it('SET_PROJECT_CATEGORIES', () => {
        const categoryList = ProjectCategoryOutputFactory.generateMany(2)
        const state = { all: categoryList }

        projectCategories.mutations.SET_PROJECT_CATEGORIES(state, categoryList)

        expect(state).toEqual({ all: categoryList })
    })

    it('UPDATE_PROJECT_CATEGORY', () => {
        const categoryList = ProjectCategoryOutputFactory.generateMany(2)
        const state = { all: categoryList }
        const newCategory = ProjectCategoryOutputFactory.generate()

        projectCategories.mutations.UPDATE_PROJECT_CATEGORY(state, newCategory)

        for (let i = 0; i < categoryList.length; i++) {
            if (categoryList[i].id === newCategory.id) {
                categoryList[i] = newCategory
            }
        }

        expect(state).toEqual({
            all: categoryList,
        })
    })

    it('ADD_PROJECT_CATEGORY', () => {
        const categoryList = ProjectCategoryOutputFactory.generateMany(2)
        const category = ProjectCategoryOutputFactory.generate()
        const state = { all: categoryList }

        projectCategories.mutations.ADD_PROJECT_CATEGORY(state, category)
        categoryList.push(category)

        expect(state).toEqual({
            all: categoryList,
        })
    })

    it('DELETE_PROJECT_CATEGORY', () => {
        const categoryList = ProjectCategoryOutputFactory.generateMany(2)
        const categoryId = categoryList[0].id
        const state = { all: categoryList }

        projectCategories.mutations.DELETE_PROJECT_CATEGORY(state, categoryId)
        const index = state.all.findIndex((category) => category.id === categoryId)
        categoryList.splice(index, 1)

        expect(state).toEqual({
            all: categoryList,
        })
    })
})
