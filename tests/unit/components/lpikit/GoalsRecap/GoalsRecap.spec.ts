import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GoalsRecap from '@/pages/ProjectPage/Tabs/Summary/GoalsRecap.vue'
import { GoalFactory } from '../../../../factories/goal.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GoalItem.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(GoalsRecap, {
            props: {
                goals: GoalFactory.generateMany(3),
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
