import { lpiMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ReviewRecap from '@/pages/ProjectPage/Tabs/Summary/ReviewRecap.vue'
import { OrganizationOutputFactory } from '../../../../../factories/organization.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

function buildStore(permissions) {
    return {
        modules: {
            organizations: {
                namespaced: true,
                getters: {
                    current: vi.fn(() => OrganizationOutputFactory.generate()),
                    all: vi.fn(() => OrganizationOutputFactory.generateMany(2)),
                },
            },
            projects: {
                namespaced: true,
                getters: {
                    currentProjectId: vi.fn(() => 123),
                },
            },
            languages: {
                namespaced: true,
                state: {
                    current: 'en',
                    all: ['en', 'fr'],
                },
            },
            users: {
                namespaced: true,
                getters: {
                    getPermissions: vi.fn(() => permissions || {}),
                    accessToken: vi.fn(() => 456),
                },
            },
        },
    }
}

const project = {
    id: 123,
    reviews: [
        {
            id: 158,
            description: "<p>C'était <b>très</b> intéressant</p>",
            title: 'La grande revue',
            created_at: '2022-10-20T13:16:48.183141Z',
            updated_at: '2022-10-25T12:53:23.830479Z',
            reviewer: {
                id: 1133,
                given_name: 'test',
                email: 'test.auto@external.cri-paris.org',
                family_name: 'auto',
                pronouns: '',
            },
        },
        {
            id: 158,
            description: "<p>C'était <b>très</b> <b>très</b> intéressant</p>",
            title: 'La grande revue, saison 2',
            created_at: '2022-10-21T13:16:48.183141Z',
            updated_at: '2022-10-26T12:53:23.830479Z',
            reviewer: {
                id: 1133,
                given_name: 'test',
                email: 'test.auto@external.cri-paris.org',
                family_name: 'auto',
                pronouns: '',
            },
        },
    ],
}

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function setUpComponent(props, store) {
    return lpiMount(ReviewRecap, {
        props,
        i18n,
        store,
    })
}

describe('ReviewRecap.vue', () => {
    it('should render component', () => {
        const wrapper = setUpComponent(
            {
                project: project,
            },
            buildStore({})
        )
        expect(wrapper.exists()).toBe(true)
    })

    it('should contain review data', async () => {
        const wrapper = setUpComponent(
            {
                project: project,
            },
            buildStore({})
        )

        expect(wrapper.text()).toMatch(/La grande revue/)
        expect(wrapper.text()).toMatch(/C'était très intéressant/)
        expect(wrapper.text()).toMatch(/test auto/i)
        // js locale is french on locale test server, english on remote
        expect(wrapper.text()).toMatch(new RegExp(new Date('2022-10-20').toLocaleDateString()))
    })

    it('should display edit button if allowed', async () => {
        const wrapper = setUpComponent(
            {
                project: project,
            },
            buildStore({ 'projects.add_review': true })
        )

        expect(wrapper.findAll('.edit-btn').length).toBe(2)
    })

    it('should not display edit button if not allowed', async () => {
        const wrapper = setUpComponent(
            {
                project: project,
            },
            buildStore({})
        )

        expect(wrapper.findAll('.edit-btn').length).toBe(0)
    })
})
