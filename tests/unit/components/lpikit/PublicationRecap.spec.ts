import { lpiShallowMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import PublicationRecap from '@/components/lpikit/ProjectView/Summary/PublicationRecap.vue'
import { BlogEntryFactory } from '../../../factories/blog-entry.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('PublicationRecap.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(PublicationRecap, {
            props: {
                publications: BlogEntryFactory.generateMany(3),
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
