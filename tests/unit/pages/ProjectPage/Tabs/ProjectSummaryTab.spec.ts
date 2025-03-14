import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ProjectSummaryTab from '@/pages/ProjectPage/Tabs/ProjectSummaryTab.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { CommentFactory } from '@/../tests/factories/comment.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
import projectAnalytic from '@/analytics/project.analytic'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
vi.mock('y-prosemirror', () => ({ default: {} }))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('Tab.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = OrganizationOutputFactory.generate()
  })
  it('should render component', () => {
    const project = ProjectOutputFactory.generate()
    const wrapper = lpiShallowMount(ProjectSummaryTab, {
      props: {
        project,
        comments: [CommentFactory.generate()],
        team: project.team,
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
