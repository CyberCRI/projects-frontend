import { lpiMount } from '@/../tests/helpers/LpiMount'
import MapPointer from '@/components/map/MapPointer.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const project = {
    id: '123abc',
    title: 'We Learn lots of things',
    description: 'This is a description',
    header_image: {
        id: 'xzonixz',
        name: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
    },
    slug: 'we-learn',
}

const factory = (props?) => {
    return lpiMount(MapPointer, {
        props: {
            ...props,
        },
        i18n,
    })
}

describe('MapPointer.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ project, isExpanded: false, location: { type: 'impact' } })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display impact badge', () => {
        const wrapper = factory({ project, isExpanded: false, location: { type: 'impact' } })
        const hiddenBadge = wrapper.find('.badge--hidden')
        const badgeLabel = wrapper.find('.badge__label')

        expect(hiddenBadge.exists()).toBeFalsy()
        expect(badgeLabel.text()).toBe('impact')
    })

    it('should display team badge', () => {
        const wrapper = factory({ project, isExpanded: false, location: { type: 'team' } })
        const hiddenBadge = wrapper.find('.badge--hidden')
        const badgeLabel = wrapper.find('.badge__label')

        expect(hiddenBadge.exists()).toBeFalsy()
        expect(badgeLabel.text()).toBe('Team')
    })
})
