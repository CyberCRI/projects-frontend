import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import AnnouncementCard from '@/components/project/announcement/AnnouncementCard.vue'
import { ProjectFactory } from '@/../tests/factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('AnnouncementCard.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(AnnouncementCard, {
      props: {
        announcement: {
          description:
            'We are looking for an intern to join our team. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          title: 'Front-end developer',
          type: 'traineeship',
          status: 'open',
          deadline: new Date(),
          is_remunerated: false,
          updated_at: new Date(),
          project: ProjectFactory.generate(),
        },
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
