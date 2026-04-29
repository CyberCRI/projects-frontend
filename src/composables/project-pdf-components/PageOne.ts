import addProjectPhotoFactory from '~/composables/project-pdf-components/addProjectPhotoFactory'
import addGoalsSectionFactory from '~/composables/project-pdf-components/addGoalsSectionFactory'
import ProjectHeaderContent from '~/composables/project-pdf-components/ProjectHeaderContent'
import addPurposeFactory from '~/composables/project-pdf-components/addPurposeFactory'
import addSdgsFactory from '~/composables/project-pdf-components/addSdgsFactory'
import addTagsFactory from '~/composables/project-pdf-components/addTagFactory'
import ProjectHeader from '~/composables/project-pdf-components/ProjectHeader'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageOneFactory(project: any, goals: any[]) {
  const { locale, t } = useNuxtI18n()

  const sortedGoals = [...goals].sort((a, b) => {
    if (!a.deadline_at && !b.deadline_at) {
      return a.title < b.title ? -1 : 1
    } else if (!a.deadline_at) {
      return -1
    } else if (!b.deadline_at) {
      return 1
    } else {
      return a.deadline_at < b.deadline_at ? -1 : 1
    }
  })

  const projectPhotoHeader = await addProjectPhotoFactory(project)
  const addPurpose = addPurposeFactory(project)
  const addTags = addTagsFactory(project, locale)

  const addSdgs = await addSdgsFactory(project.sdgs || [])
  const addGoalsSection = await addGoalsSectionFactory(sortedGoals)

  return function addPageOne(this: Doc) {
    const firstPage = this.addContainer(Page)
      .add(function (this: Page) {
        this.styles.add(/* CSS */ `
          .body {
            padding-top: 1cm;
            padding-bottom: 1cm;
          }
          .project-title {
            font-size: 1.6rem;
            margin-bottom: 1cm;
            color: #1d727c;
            font-weight: bold;
            text-align: center;
          }`)
        this.content.push(/* HTML */ `
          <h1 class="project-title">${project.$t.title}</h1>
        `)
      })
      .addContainer(ProjectHeader)
      .add(projectPhotoHeader)
      .addContainer(ProjectHeaderContent)
      .add(addPurpose)
      .add(addTags)
      .render() // ProjectHeaderContent
      .render() // ProjectHeader

    if (project.sdgs?.length) {
      firstPage
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('sdg.title'))
        })
        .render()
      firstPage.add(addSdgs)
    }

    if (sortedGoals?.length) {
      firstPage
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('goal.goals'))
        })
        .render()
      firstPage.add(addGoalsSection)
    }
    firstPage
      .render() // Page
      .render() // Doc
  }
}
