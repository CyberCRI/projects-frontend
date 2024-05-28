import goalsStore from '@/store/modules/goals'
import { createGoal, getAllGoals, deleteGoal, patchGoal } from '@/api/goals.service'
import { ProjectFactory } from '../../../factories/project.factory'
import { GoalFactory, GoalInputFactory } from '../../../factories/goal.factory'
import analytics from '@/analytics'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/goals.service')
vi.mock('@/analytics')

vi.mock('vuex')
describe('Store module | goals | actions', () => {
    const commit = vi.fn()
    const rootState = {
        projects: {
            project: ProjectFactory.generate(),
        },
    }

    it('getAllGoals', async () => {
        const goals = GoalFactory.generateMany(2)
        const getAllGoalsMock = getAllGoals as Mock

        getAllGoalsMock.mockResolvedValue({ results: goals })

        await goalsStore.actions.getAllGoals({ commit, rootState }, rootState.projects.project.id)

        expect(commit).toHaveBeenCalledWith('projects/SET_GOALS', goals, { root: true })
        expect(getAllGoalsMock).toHaveBeenCalledWith(rootState.projects.project.id)
    })

    it('createGoal', async () => {
        const goal = GoalInputFactory.generate()
        const createGoalAsMock = createGoal as Mock
        const addGoalProjectMock = analytics.goal.addGoalProject as Mock

        createGoalAsMock.mockResolvedValue(goal)

        const result = await goalsStore.actions.createGoal({ commit, rootState }, goal)

        expect(commit).toHaveBeenCalledWith('projects/ADD_GOAL', goal, { root: true })
        expect(createGoalAsMock).toHaveBeenCalledWith({
            goal: goal,
            project_id: rootState.projects.project.id,
        })
        expect(addGoalProjectMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            goal: result,
        })
    })

    it('patchGoal', async () => {
        const goal = GoalInputFactory.generate()
        const patchGoalAsMock = patchGoal as Mock
        const updateGoalProjectMock = analytics.goal.updateGoalProject as Mock

        patchGoalAsMock.mockResolvedValue(goal)

        const result = await goalsStore.actions.patchGoal({ commit, rootState }, goal)

        const index = rootState.projects.project.goals.findIndex((goal) => goal.id === result.id)

        expect(commit).toHaveBeenCalledWith('projects/UPDATE_GOAL', { index, goal }, { root: true })
        expect(patchGoalAsMock).toHaveBeenCalledWith({
            goal: goal,
            project_id: rootState.projects.project.id,
        })
        expect(updateGoalProjectMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            goal: result,
        })
    })

    it('deleteGoal', async () => {
        const goals = rootState.projects.project.goals
        const deleteGoalAsMock = deleteGoal as Mock
        const removeGoalProjectMock = analytics.goal.removeGoalProject as Mock

        deleteGoalAsMock.mockResolvedValue(goals)

        await goalsStore.actions.deleteGoal({ commit, rootState }, goals[1].id)

        expect(commit).toHaveBeenCalledWith('projects/DELETE_GOAL', 1, { root: true })
        expect(deleteGoalAsMock).toHaveBeenCalledWith({
            id: goals[1].id,
            project_id: rootState.projects.project.id,
        })
        expect(removeGoalProjectMock).toHaveBeenCalledWith({
            project: {
                id: rootState.projects.project.id,
            },
            goal: goals[1],
        })
    })
})
