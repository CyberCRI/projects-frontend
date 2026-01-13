import GroupSnapshotTab from '@/pages/GroupPageV2/Tabs/GroupSnapshotTab.vue'
import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import { flushPromises } from '@vue/test-utils'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import { groupTranslatedFactory } from '../../../../factories/group.factory'

describe('GroupSnapshotTab', () => {
  it('should render without modules', () => {
    const group = groupTranslatedFactory.generate()
    const wrapper = lpiShallowMount(GroupSnapshotTab, {
      props: {
        group,
        isLoading: false,
      },
    })

    expect(wrapper.exists()).toBeTruthy()
    // no modules set
    expect(wrapper.find("[data-test='group-modules']").element.childElementCount).toBe(0)
  })
  it('should render with modules', () => {
    const group = groupTranslatedFactory.generate()
    const wrapper = lpiMount(GroupSnapshotTab, {
      props: {
        group: {
          ...group,
          modules: {
            featured_projects: 100,
            members: 2,
          },
        },
        isLoading: false,
      },
    })

    expect(wrapper.exists()).toBeTruthy()
    // no modules set
    console.log(wrapper.html())
    expect(wrapper.find("[data-test='group-modules']").element.childElementCount).toBe(2)
  })
})
