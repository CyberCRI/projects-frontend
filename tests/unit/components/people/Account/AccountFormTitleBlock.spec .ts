import AccountFormTitleBlock from '~/components/people/Account/AccountFormTitleBlock.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'

describe('AccountFormTitleBlock', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isAddMode: true,
      },
    }
  })

  it('should render AccountFormTitleBlock component', () => {
    wrapper = lpiShallowMount(AccountFormTitleBlock, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
