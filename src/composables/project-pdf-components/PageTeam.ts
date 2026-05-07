import addGroupSectionFactory from '~/composables/project-pdf-components/addGroupSectionFactory'
import addTeamSectionFactory from '~/composables/project-pdf-components/addTeamSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'
import { roleI18n } from '~/functs/rolesUtils'

export default async function addPageTeamFactory(team: any) {
  const { t } = useNuxtI18n()

  const addOwnerTeamSection = await addTeamSectionFactory(roleI18n('owners'), team?.owners || [])
  const addEditorTeamSection = await addTeamSectionFactory(roleI18n('members'), team?.members || [])
  const addReviewerTeamSection = await addTeamSectionFactory(
    roleI18n('reviewers'),
    team?.reviewers || []
  )

  const addOwnerGroupSection = await addGroupSectionFactory(
    roleI18n('owner_groups'),
    team?.owner_groups || []
  )
  const addMemberGroupSection = await addGroupSectionFactory(
    roleI18n('member_groups'),
    team?.member_groups || []
  )
  const addReviewerGroupSection = await addGroupSectionFactory(
    roleI18n('reviewer_groups'),
    team?.reviewer_groups || []
  )

  return function addPageTeam(this: Doc) {
    if (
      !team?.owners?.length &&
      !team?.members?.length &&
      !team?.reviewers?.length &&
      !team?.owner_groups?.length &&
      !team?.member_groups?.length &&
      !team?.reviewer_groups?.length
    )
      return

    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('team.team'))
      })
      .render()
      .add(addOwnerTeamSection)
      .add(addEditorTeamSection)
      .add(addReviewerTeamSection)
      .add(addOwnerGroupSection)
      .add(addMemberGroupSection)
      .add(addReviewerGroupSection)
      .render()
  }
}
