import CategoriesPage from '@/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('CategoriesPage', () => {
    it('should render CategoriesPage', () => {
        let wrapper = lpiShallowMount(CategoriesPage)

        expect(wrapper.exists()).toBeTruthy()
    })
})
