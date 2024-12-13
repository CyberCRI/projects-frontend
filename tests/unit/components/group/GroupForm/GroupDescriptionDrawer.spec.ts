import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GroupDescriptionDrawer from '@/components/group/GroupForm/GroupDescriptionDrawer.vue'
import { describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GroupDescriptionDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render GroupDescriptionDrawer component', () => {
        wrapper = lpiMount(GroupDescriptionDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the close event', () => {
            wrapper = lpiMount(GroupDescriptionDrawer, defaultParams)
            const vm: any = wrapper.vm

            vm.closeDrawer()
            expect(wrapper.emitted('close')).toBeTruthy()
        }),
        it('should emit the update-description event', () => {
            wrapper = lpiMount(GroupDescriptionDrawer, defaultParams)
            const vm: any = wrapper.vm

            vm.saveDescription()
            expect(wrapper.emitted('update-description')).toBeTruthy()
        })
})
