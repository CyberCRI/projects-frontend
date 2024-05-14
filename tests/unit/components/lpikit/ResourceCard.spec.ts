import { lpiMount } from '../../../helpers/LpiMount'
import ResourceCard from '@/components/project/ResourceCard/ResourceCard.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = (props?) => {
    return lpiMount(ResourceCard, {
        props: {
            ...props,
        },
        i18n,
    })
}

describe('ResourceCard.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ title: 'File 1' })
        expect(wrapper.exists()).toBe(true)
    })
})
