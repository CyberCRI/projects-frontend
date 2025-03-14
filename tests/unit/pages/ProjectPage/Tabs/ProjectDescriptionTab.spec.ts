import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectDescriptionTab from '@/pages/ProjectPage/Tabs/ProjectDescriptionTab.vue'
import { ProjectFactory } from '@/../tests/factories/project.factory'
import { UserFactory } from '@/../tests/factories/user.factory'
import permissions from '@/mixins/permissions'

import pinia from '@/stores'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'

import { ProjectOutputFactory } from '@/../tests/factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
vi.mock('@/mixins/permissions')
;(permissions.computed.canEditProject as Mock).mockImplementation(() => true)

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

    projectsStore.project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
  })

  it('should render component', () => {
    const wrapper = lpiShallowMount(ProjectDescriptionTab, {
      props: {
        project: ProjectFactory.generate(),
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
