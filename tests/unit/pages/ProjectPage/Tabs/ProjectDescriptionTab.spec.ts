import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ProjectDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectDescriptionTab.vue'
import { ProjectFactory } from '@/../tests/factories/project.factory'
import { UserFactory } from '@/../tests/factories/user.factory'

import pinia from '@/stores'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'

import { ProjectOutputFactory } from '@/../tests/factories/project.factory'

import { useAutoTranslate } from '#imports'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import usePermissions from '@/composables/usePermissions'
vi.mock('@/composables/usePermissions', () => ({
  default: () => ({
    canEditProject: computed(() => true),
  }),
}))
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ProjectDescriptionTab.vue', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      user: UserFactory.generate(),
    } as any)
    const projectsStore = useProjectsStore(pinia)

    const { translateProject } = useAutoTranslate()

    projectsStore.project = {
      ...translateProject(ProjectOutputFactory.generate()).value,
      files: [],
      links: [],
    }
  })

  it('should render component', () => {
    const { translateProject } = useAutoTranslate()
    const wrapper = lpiShallowMount(ProjectDescriptionTab, {
      props: {
        project: translateProject(ProjectFactory.generate()).value,
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
