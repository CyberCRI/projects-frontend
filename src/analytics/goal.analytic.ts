import analytics from '@/analytics'
import { GoalModel } from '@/models/goal.model'
import { SdgOutput } from '@/models/sdg.model'
import i18n from '@/locales/i18n'
export interface GoalAnalytic {
    project: {
        id: string
    }
    goal: GoalModel
}

export default {
    /**
     * "Add Goal project" analytic event
     * @param goal
     */
    addGoalProject(goal: GoalAnalytic): void {
        analytics.track('add_goal', goal)
    },

    /**
     * "Update Goal project" analytic event
     * @param goal
     */
    updateGoalProject(goal: GoalAnalytic): void {
        analytics.track('update_goal', goal)
    },

    /**
     * "Remove Goal project" analytic event
     * @param goal
     */
    removeGoalProject(goal: GoalAnalytic): void {
        analytics.track('remove_goal', goal)
    },

    /**
     * "Update SDGs" analytic event
     * @param project_id
     * @param sdgs
     */
    updateSDG(project_id: string, sdgs: Array<SdgOutput>): void {
        const sdgList = sdgs.map((sdg) => ({
            id: sdg,
            title: i18n.global.t(`sdg.${sdg}.title`),
        }))
        analytics.track('update_SDG', {
            project: {
                id: project_id,
            },
            sdgs: sdgList,
        })
    },
}
