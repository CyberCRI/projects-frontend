import { GoalInput, GoalOutput } from '@/models/goal.model'
import { getAllGoals, createGoal, deleteGoal, patchGoal } from '@/api/goals.service'
import { APIResponseList } from '@/api/types'
import analytics from '@/analytics'

const actions = {
    async getAllGoals({ commit, rootState }, id: string): Promise<APIResponseList<GoalOutput>> {
        try {
            const result = await getAllGoals(id)

            commit('projects/SET_GOALS', result.results, { root: true })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async createGoal({ commit, rootState }, goal: GoalInput): Promise<GoalOutput> {
        try {
            const result = await createGoal({
                goal,
                project_id: rootState.projects.project.id,
            })

            commit('projects/ADD_GOAL', result, { root: true })

            analytics.goal.addGoalProject({
                project: {
                    id: rootState.projects.project.id,
                },
                goal: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchGoal({ commit, rootState }, goal: GoalInput): Promise<GoalOutput> {
        try {
            const result = await patchGoal({
                goal: goal,
                project_id: rootState.projects.project.id,
            })

            const index = rootState.projects.project.goals.findIndex(
                (goal) => goal.id === result.id
            )

            commit('projects/UPDATE_GOAL', { index, goal: result }, { root: true })

            analytics.goal.updateGoalProject({
                project: {
                    id: rootState.projects.project.id,
                },
                goal: result,
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async deleteGoal({ commit, rootState }, id: number): Promise<void> {
        try {
            const result = await deleteGoal({
                id: id,
                project_id: rootState.projects.project.id,
            })

            const index = rootState.projects.project.goals.findIndex((goal) => goal.id === id)

            commit('projects/DELETE_GOAL', index, { root: true })

            analytics.goal.removeGoalProject({
                project: {
                    id: rootState.projects.project.id,
                },
                goal: rootState.projects.project.goals[index],
            })

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    actions,
}
