import { lpiMount } from '../../../helpers/LpiMount'
import LinkCreateTab from '@/pages/AdminPortalPage/Tabs/LinkCreateTab.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import MockComponent from '../../../helpers/MockComponent.vue'
import { axios, configFormData } from '@/api/api.config'

// fix unhnadled rejection due to invalid url
vi.mock('@/api/api.config', () => {
    return {
        axios: {
            get: vi.fn().mockResolvedValue({ data: { results: [] } }),
        },
    }
})

vi.mock('@/api/invitations.service.ts', () => {
    return {
        getInvitations: vi.fn(() => ({ results: [] })),
        postInvitations: vi.fn(),
        deleteInvitations: vi.fn(),
    }
})

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        modules: {
            organizations: {
                namespaced: true,
                state: {
                    current: { code: 'FOOBAR' },
                },
            },
        },
    }
}

const factory = (props?) => {
    return lpiMount(LinkCreateTab, {
        props,
        i18n,
        store: buildStore(),
        router: [
            { name: 'Home', path: '/', component: MockComponent },
            { name: 'Help', path: '/help', component: MockComponent },
            { path: '/blank', component: MockComponent, name: 'blank' },
        ],
    })
}

describe('LinkCreateTab.vue', () => {
    it('should mount the component', () => {
        const wrapper = factory({ projects: [] })
        const vm: any = wrapper.vm
        expect(wrapper.exists()).toBeTruthy()
    })
})
