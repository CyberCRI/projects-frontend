import GroupHierarchyList from '~/components/people/Account/GroupHierarchyList.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'

describe('GroupHierarchyList', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isAddMode: true,
        selectedGroups: {},
      },
    }
  })

  it('should render GroupHierarchyList component', () => {
    wrapper = lpiShallowMount(GroupHierarchyList, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
