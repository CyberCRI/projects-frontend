import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GoalSummaryItem from '@/components/lpikit/ProjectView/Summary/GoalSummaryItem.vue'
import { GoalFactory } from '../../../../factories/goal.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GoalSummaryItem.vue', () => {
    it('should render component', () => {
        const wrapper = lpiMount(GoalSummaryItem, {
            props: {
                goal: GoalFactory.generate(),
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should have status icon visible', () => {
        const wrapper = lpiMount(GoalSummaryItem, {
            props: {
                goal: { ...GoalFactory.generate(), status: 'complete' },
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should not have status icon visible', () => {
        const wrapper = lpiMount(GoalSummaryItem, {
            props: {
                goal: { ...GoalFactory.generate(), status: 'na' },
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
