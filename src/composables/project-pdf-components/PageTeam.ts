import { Doc, Page } from '@/composables/pdf-helpers/doc-builder'
import PageTitle from '@/composables/project-pdf-components/PageTitle'

import addTeamSectionFactory from '@/composables/project-pdf-components/addTeamSectionFactory'
import addGroupSectionFactory from '@/composables/project-pdf-components/addGroupSectionFactory'

export default async function addPageTeamFactory(team: any) {
  const { t } = useNuxtI18n()

  const addOwnerTeamSection = await addTeamSectionFactory(t('role.editors'), team?.owners || [])
  const addEditorTeamSection = await addTeamSectionFactory(t('role.teammates'), team?.members || [])
  const addReviewerTeamSection = await addTeamSectionFactory(
    t('role.reviewers'),
    team?.reviewers || []
  )

  const addOwnerGroupSection = await addGroupSectionFactory(
    t('role.editor-groups'),
    team?.owner_groups || []
  )
  const addMemberGroupSection = await addGroupSectionFactory(
    t('role.teammate-groups'),
    team?.member_groups || []
  )
  const addReviewerGroupSection = await addGroupSectionFactory(
    t('role.reviewer-groups'),
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
