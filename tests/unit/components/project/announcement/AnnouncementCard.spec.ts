import AnnouncementCard from '~/components/project/announcement/AnnouncementCard.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { TranslatedAnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { describe, expect, it } from 'vitest'

describe('AnnouncementCard.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(AnnouncementCard, {
      props: {
        announcement: TranslatedAnnouncementFactory.generate(),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
