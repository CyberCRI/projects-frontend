import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ResourcesRecap from '@/components/project/resource/ResourcesRecap.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import pinia from '@/stores'
import useProjectsStore from '@/stores/useProjects'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ResourcesRecap.vue', () => {
  beforeEach(() => {
    const projectsStore = useProjectsStore(pinia)

    projectsStore.project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(ResourcesRecap, {
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
