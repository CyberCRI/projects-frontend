import addGroupSectionFactory from '~/composables/project-pdf-components/addGroupSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'
import { Page } from '~/composables/pdf-helpers/doc-builder'
import { getProjectGroups } from '~/api/projects.service'
import { roleI18n } from '~/functs/rolesUtils'
import { groupBy } from 'es-toolkit'

export default async function addPageGroupsFactory(project: TranslatedProject) {
  const { t } = useNuxtI18n()
  const { translateGroups } = useAutoTranslate()

  const groups = unref(
    translateGroups((await getProjectGroups(project.id, { query: { limit: 10 } })).results)
  )

  const groupedGroups = groupBy(groups, (item) => item.role)

  const addOwnerGroupSection = await addGroupSectionFactory(
    roleI18n('owner_groups'),
    groupedGroups.owner_groups || []
  )
  const addEditorGroupSection = await addGroupSectionFactory(
    roleI18n('member_groups'),
    groupedGroups.member_groups || []
  )
  const addReviewerGroupSection = await addGroupSectionFactory(
    roleI18n('reviewer_groups'),
    groupedGroups.reviewer_groups || []
  )

  return function addPageTeam(this: Doc) {
    if (groups.length === 0) {
      return
    }
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('project.groups'))
      })
      .render()
      .add(addOwnerGroupSection)
      .add(addEditorGroupSection)
      .add(addReviewerGroupSection)
      .render()
  }
}
