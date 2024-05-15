import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import OrganizationsGrid from '@/components/org/OrganizationsGrid/OrganizationsGrid.vue'
import { ProjectFactory } from '../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('OrganizationsGrid.vue', () => {
    it('should render component', () => {
        const wrapper = lpiMount(OrganizationsGrid, {
            props: {
                project: {
                    ...ProjectFactory.generate(),
                    organizations: [OrganizationOutputFactory.generate()],
                },
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
