import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import TeamRecap from '@/pages/ProjectPage/Tabs/Summary/TeamRecap.vue'
import { ProjectOutputFactory } from '../../../../../factories/project.factory'
import MockComponent from '../../../../../helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const mockRouter = {
    push: vi.fn(),
}

const mockRoute = {
    path: '/test1',
}

const project = ProjectOutputFactory.generate()

describe('TeamRecap.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(TeamRecap, {
            props: {
                members: project.team.members,
            },
            i18n,
            router: [{ path: '/:pathMatch(.*)', component: MockComponent }],
            global: {
                mocks: {
                    $router: mockRouter,
                    $route: mockRoute,
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
