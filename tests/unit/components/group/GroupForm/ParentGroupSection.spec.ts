import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ParentGroupSection from '@/components/group/GroupForm/ParentGroupSection.vue'
import { describe, expect, it } from 'vitest'
import useValidate from '@vuelidate/core'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('ParentGroupSection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                modelValue: [1, 2, 3],
                groups: [
                    {
                        id: 123,
                        name: '123',
                        children: [],
                    },
                ],
            },
        }
    })

    it('should render ParentGroupSection component', () => {
        wrapper = lpiMount(ParentGroupSection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the update:modelValue', () => {
            wrapper = lpiMount(ParentGroupSection, defaultParams)
            const vm: any = wrapper.vm

            vm.confirmGroup()
            expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        })
})
