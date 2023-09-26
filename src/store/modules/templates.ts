import { createTemplate, patchTemplate } from '@/api/templates.service'
import { TemplateCreateInput, TemplateOutput } from '@/models/template.model'

export interface TemplatesState {
    current: TemplateOutput
}

const state = (): TemplatesState => ({
    current: null,
})

const getters = {
    current: (state: TemplatesState) => state.current || null,
}

const actions = {
    async createTemplate(
        { commit, rootState },
        template: TemplateCreateInput
    ): Promise<TemplateOutput> {
        try {
            let result

            if (rootState.projectCategories.current.templates) {
                result = await patchTemplate(template)
            } else {
                result = await createTemplate(template)
            }

            commit('SET_CURRENT_TEMPLATE', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
    async patchTemplate({ commit }, template: TemplateCreateInput): Promise<TemplateOutput> {
        try {
            const result = await patchTemplate(template)

            commit('SET_CURRENT_TEMPLATE', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    SET_CURRENT_TEMPLATE(state: TemplatesState, template: TemplateOutput): void {
        state.current = template
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
