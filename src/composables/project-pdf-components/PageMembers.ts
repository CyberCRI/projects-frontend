import addTeamSectionFactory from '~/composables/project-pdf-components/addTeamSectionFactory'
import type { TranslatedProjectMember } from '~/models/project-member.model'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'
import { Page } from '~/composables/pdf-helpers/doc-builder'
import { getProjectMembers } from '~/api/projects.service'
import { roleI18n } from '~/functs/rolesUtils'
import { groupBy } from 'es-toolkit'

export default async function addPageMembersFactory(project: TranslatedProject) {
  const { t } = useNuxtI18n()
  const { translateUsers } = useAutoTranslate()

  // add limit to 999 to have all users
  const members = unref(
    translateUsers<TranslatedProjectMember>(
      (await getProjectMembers(project.id, { query: { limit: 999 } })).results
    )
  )

  const groupedMembers = groupBy(members, (item) => item.role)

  const addOwnerTeamSection = await addTeamSectionFactory(
    roleI18n('owners'),
    groupedMembers.owners || []
  )
  const addEditorTeamSection = await addTeamSectionFactory(
    roleI18n('members'),
    groupedMembers.members || []
  )
  const addReviewerTeamSection = await addTeamSectionFactory(
    roleI18n('reviewers'),
    groupedMembers.reviewers || []
  )

  return function addPageTeam(this: Doc) {
    if (members.length === 0) {
      return
    }
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('team.team'))
      })
      .render()
      .add(addOwnerTeamSection)
      .add(addEditorTeamSection)
      .add(addReviewerTeamSection)
      .render()
  }
}
