import { lpiShallowMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GoalDrawer from '@/components/project/goal/GoalDrawer.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    files: [],
                    links: [],
                }),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
    },
}

describe('GoalDrawer.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(GoalDrawer, { i18n, store })
        expect(wrapper.exists()).toBe(true)
    })
})
