import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LinkedProjectsRecap from '@/components/project/linked-project/LinkedProjectsRecap.vue'
import { ProjectFactory } from '../../../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('LinkedProjectsRecap.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(LinkedProjectsRecap, {
            props: {
                linkedProjects: [
                    {
                        reason: 'élément de',
                        project: ProjectFactory.generate(),
                    },
                    {
                        reason: 'inspiré de',
                        project: ProjectFactory.generate(),
                    },
                ],
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
