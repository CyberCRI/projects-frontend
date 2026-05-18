import LocationForm from '@/components/map/LocationForm.vue'
import { lpiMount } from '@/../tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

describe('LocationForm', () => {
  it('should render LocationForm component', () => {
    const modelValue = ref({
      lat: 55,
      lng: 66,
    })
    const props = {
      modelValue,
    }
    const wrapper = lpiMount(LocationForm, { props })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('invalid LocationType', async () => {
    let wrapper
    wrapper = lpiMount(LocationForm, {
      props: {
        modelValue: {
          lat: 55,
          lng: 66,
          type: 'address',
        },
        locationTypes: ['team', 'impact'],
      },
    })

    await flushPromises()

    // form type is 'address' but only 'team' and 'impact' are accepcted, so form change first correct type
    expect(wrapper.emitted()['update:modelValue'].at(-1)[0].type).toEqual('team')
  })
})
