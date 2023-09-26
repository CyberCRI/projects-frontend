import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CategoryBanner from '@/components/lpikit/CategoryBanner/CategoryBanner.vue'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = () => {
    return lpiMount(CategoryBanner, {
        props: {
            category: ProjectCategoryOutputFactory.generate(),
        },
        i18n,
    })
}

describe('CategoryBanner.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })
})
