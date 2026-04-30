import AnnouncementDrawer from '~/components/project/announcement/AnnouncementDrawer.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { describe, expect, it } from 'vitest'
import waitForExpect from 'wait-for-expect'

describe('AnnouncementDrawer.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(AnnouncementDrawer, { props: { isOpened: true } })
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
    const wrapper = lpiShallowMount(AnnouncementDrawer, {
      props: { isOpened: true, isAddMode: false, announcement },
    })

    const vm: any = wrapper.vm
    await waitForExpect(() => {
      expect(vm.form).toStrictEqual({
        ...announcement,
      })
    })
  })
})
