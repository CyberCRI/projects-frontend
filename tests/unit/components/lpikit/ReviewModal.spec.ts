import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ReviewModal from '@/components/lpikit/ReviewModal/ReviewModal.vue'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import waitForExpect from 'wait-for-expect'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const store = {
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
                getPermissions: vi.fn(() => []),
                accessToken: vi.fn(() => 456),
            },
        },
    },
}

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function setUpComponent(props) {
    return lpiMount(ReviewModal, {
        props,
        i18n,
        store,
        global: {
            stubs: {
                TipTapEditor: {
                    template: '<p></p>',
                },
                teleport: true,
            },
        },
    })
}

describe('ReviewModal.vue', () => {
    it('should render component in add mode', () => {
        const wrapper = setUpComponent({ mode: 'add', project: { id: 123 } })

        expect(wrapper.exists()).toBe(true)
    })

    it('should have two buttons in add mode', () => {
        const wrapper = setUpComponent({ mode: 'add', project: { id: 123 } })
        const footerButtons = wrapper.findAll('.button-footer')
        expect(footerButtons.length).toBe(2)
    })

    it('should render component in edit mode', () => {
        const wrapper = setUpComponent({
            mode: 'edit',
            project: { id: 123 },
            rdata: {
                id: 158,
                description: "<p>C'était <b>très</b> intéressant</p>",
                title: 'La grande revue',
                created_at: '2022-10-20T13:16:48.183141Z',
                updated_at: '2022-10-25T12:53:23.830479Z',
                reviewer: {
                    id: 1133,
                    keycloak_id: 'e55f9554-e1b2-487e-8d88-ec18c99a388a',
                    people_id: '4e134c1a-bd53-436d-ad11-02982b19cd9c',
                    given_name: 'test',
                    email: 'test.auto@external.cri-paris.org',
                    family_name: 'auto',
                    pronouns: '',
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should contain review data in edit mode', async () => {
        const wrapper = setUpComponent({
            mode: 'edit',
            project: { id: 123 },
            rdata: {
                id: 158,
                description: "<p>C'était <b>très</b> intéressant</p>",
                title: 'La grande revue',
                created_at: '2022-10-20T13:16:48.183141Z',
                updated_at: '2022-10-25T12:53:23.830479Z',
                reviewer: {
                    id: 1133,
                    keycloak_id: 'e55f9554-e1b2-487e-8d88-ec18c99a388a',
                    people_id: '4e134c1a-bd53-436d-ad11-02982b19cd9c',
                    given_name: 'test',
                    email: 'test.auto@external.cri-paris.org',
                    family_name: 'auto',
                    pronouns: '',
                },
            },
        })

        const result = wrapper.find('.review-container')

        await waitForExpect(() => {
            expect(result.exists()).toBe(true)
        })
    })

    it('should have three buttons in edit mode', () => {
        const wrapper = setUpComponent({
            mode: 'edit',
            project: { id: 123 },
            rdata: {
                id: 158,
                description: "<p>C'était <b>très</b> intéressant</p>",
                title: 'La grande revue',
                created_at: '2022-10-20T13:16:48.183141Z',
                updated_at: '2022-10-25T12:53:23.830479Z',
                reviewer: {
                    id: 1133,
                    keycloak_id: 'e55f9554-e1b2-487e-8d88-ec18c99a388a',
                    people_id: '4e134c1a-bd53-436d-ad11-02982b19cd9c',
                    given_name: 'test',
                    email: 'test.auto@external.cri-paris.org',
                    family_name: 'auto',
                    pronouns: '',
                },
            },
        })
        const footerButtons = wrapper.findAll('.button-footer')
        expect(footerButtons.length).toBe(3)
    })
})
