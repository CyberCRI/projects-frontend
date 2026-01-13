import { lpiMount } from '@/../tests/helpers/LpiMount'
import { describe, expect, it } from 'vitest'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import GroupPage from '@/pages/GroupPageV2/GroupPage.vue'
import { peopleGroupFactory } from '../../../factories/group.factory'

const group = peopleGroupFactory.generate()
mockNuxtImport('useRoute', () => () => ({
  params: {
    groupId: group.id,
  },
}))

describe('GroupProjectsTab', () => {
  const orgaCode = useOrganizationCode()

  it('Render', async () => {
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/`, () => group)
    const wrapper = lpiMount(GroupPage, {
      props: {
        group,
        isLoading: false,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('Error fetch', async () => {
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/`, () => {
      throw createError({ status: 500 })
    })
    const wrapper = lpiMount(GroupPage, {
      props: {
        group,
        isLoading: false,
      },
    })
    // @ts-expect-error TS2349
    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
