import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import AnnouncementDrawer from '@/components/project/announcement/AnnouncementDrawer.vue'
import waitForExpect from 'wait-for-expect'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = (propsData?) => {
    return lpiShallowMount(AnnouncementDrawer, {
        props: {
            ...propsData,
        },
        i18n,
    })
}

describe('AnnouncementDrawer.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ isOpened: true })
        expect(wrapper.exists()).toBe(true)
    })

    it('assigns existing announcement to form in edit mode', async () => {
        const announcement = {
            title: 'job offer',
            description: '<p>description</p>',
            is_remunerated: true,
            deadline: 'Wed Sep 14 2022 17:37:23 GMT+0200 (heure d’été d’Europe centrale)',
            type: 'job',
        }
        const wrapper = factory({ isOpened: true, isAddMode: false, announcement })
        const vm: any = wrapper.vm
        await waitForExpect(() => {
            expect(vm.form).toStrictEqual({
                ...announcement,
            })
        })
    })
})
