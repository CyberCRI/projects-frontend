import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import PublicationRecap from '@/components/project/blog/PublicationRecap.vue'
import { BlogEntryFactory } from '@/../tests/factories/blog-entry.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
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
