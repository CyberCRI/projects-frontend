import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LpiFooter from '@/components/app/LpiFooter.vue'
import MockComponent from '../../../helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        state: {
            languages: {
                current: 'fr',
            },
        },
    }
}

const factory = () => {
    return lpiMount(LpiFooter, {
        i18n,
        store: buildStore(),
        router: [
            { path: '/', component: MockComponent },
            { path: '/help', component: MockComponent },
            { path: '/terms-of-service', component: MockComponent },
            { path: '/legal-notices', component: MockComponent },
            { path: '/cookies', component: MockComponent },
            { path: '/accessibility', component: MockComponent },
            { path: '/personal-data', component: MockComponent },
            { path: '/blank', component: MockComponent, name: 'blank' },
        ],
    })
}

describe('LpiFooter.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })
})
