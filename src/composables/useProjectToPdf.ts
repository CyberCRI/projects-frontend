import { Doc, Page } from '@/composables/pdf-helpers/doc-builder'
import { convertImages, fetchPdf } from '@/composables/pdf-helpers/usePdfHelpers'

import ProjectHeader from '@/composables/project-pdf-components/ProjectHeader'
import ProjectHeaderContent from '@/composables/project-pdf-components/ProjectHeaderContent'
import addProjectPhotoFactory from '@/composables/project-pdf-components/addProjectPhotoFactory'
import addPurposeFactory from '@/composables/project-pdf-components/addPurposeFactory'
import addTagsFactory from '@/composables/project-pdf-components/addTagFactory'
import addSdgsFactory from '@/composables/project-pdf-components/addSdgsFactory'
import PageTitle from '@/composables/project-pdf-components/PageTitle'
import addTeamSectionFactory from '@/composables/project-pdf-components/addTeamSectionFactory'
import addGroupSectionFactory from '@/composables/project-pdf-components/addGroupSectionFactory'
import addGoalsSectionFactory from '@/composables/project-pdf-components/addGoalsSectionFactory'
// TODO: blog are disabled for now (as per client request) keep code for later use
// import addBlogSectionFactory from '@/composables/project-pdf-components/addBlogSectionFactory'
// import addBlogLimitWarningFactory from './project-pdf-components/addBlogLimitWarningFactory'
import addResourceSectionFactory from '@/composables/project-pdf-components/addResourceSectionFactory'
import addLinkedProjectSectionFactory from '@/composables/project-pdf-components/addLinkedProjectSectionFactory'

export default function useProjectToPdf() {
  const generateAndDownloadPdf = async ({
    project,
    team,
    goals,
    // TODO: blog are disabled for now (as per client request) keep code for later use
    // blogEntries,
    fileResources,
    linkResources,
    linkedProjects,
  }) => {
    const { locale, t } = useNuxtI18n()

    let fixedDescription = await convertImages(project.description)
    // TODO: replace with a link to video ?
    fixedDescription = fixedDescription.replaceAll(/<video.*?>.*?<\/video>/g, '')

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

    const mainDoc = new Doc()
    mainDoc.styles.add(/* CSS */ `
      html, body {
        margin: 20px;
      }
      @page {
        margin-top: 2.5cm;
        margin-bottom: 2cm;
      }`)

    // FIRST PAGE - HEADER

    const projectPhotoHeader = await addProjectPhotoFactory(project)

    const addPurpose = addPurposeFactory(project)
    const addTags = addTagsFactory(project, locale)

    const addOwnerTeamSection = await addTeamSectionFactory(t('role.editors'), team?.owners || [])
    const addEditorTeamSection = await addTeamSectionFactory(
      t('role.teammates'),
      team?.members || []
    )
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

    const addGoalsSection = await addGoalsSectionFactory(sortedGoals)

    // TODO: blog are disabled for now (as per client request) keep code for later use
    // const MAX_BLOG_ENTRIES = 10
    // const addBlogSection = await addBlogSectionFactory(blogEntries, MAX_BLOG_ENTRIES)
    // const addBlogLimitWarning = await addBlogLimitWarningFactory(blogEntries, MAX_BLOG_ENTRIES)

    const addFileResourceSection = await addResourceSectionFactory(project, fileResources, 'file')
    const addLinkResourceSection = await addResourceSectionFactory(project, linkResources, 'link')

    const addLinkedProjectSection = await addLinkedProjectSectionFactory(linkedProjects || [])

    const addSdgs = await addSdgsFactory(project.sdgs || [])

    const firstPage = mainDoc
      .addContainer(Page)
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

    if (sortedGoals?.length || project.sdgs?.length) {
      firstPage
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('goal.goals'))
        })
        .render()
      if (project.sdgs?.length) firstPage.add(addSdgs)
      if (sortedGoals?.length) firstPage.add(addGoalsSection)
    }
    firstPage
      .render() // Page
      .render() // Doc

    // SECOND PAGE - DESCRIPTION
    if (fixedDescription?.length && fixedDescription !== '<p></p>') {
      mainDoc
        .addContainer(Page)
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('form.description'))
        })
        .render()
        .add(function (this: Page) {
          this.content.push(/* HTML */ `
            <div>${fixedDescription}</div>
          `)
        })
        .render()
    }

    if (
      team?.owners?.length ||
      team?.members?.length ||
      team?.reviewers?.length ||
      team?.owner_groups?.length ||
      team?.member_groups?.length ||
      team?.reviewer_groups?.length
    ) {
      mainDoc
        .addContainer(Page)
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

    // TODO: blog are disabled for now (as per client request) keep code for later use
    // mainDoc
    //   .addContainer(Page)
    //   .addContainer(PageTitle)
    //   .add(function (this: PageTitle) {
    //     this.content.push(t('blog.title'))
    //   })
    //   .render()
    //   .add(addBlogLimitWarning)
    //   .add(addBlogSection)
    //   .render()

    if (fileResources?.length || linkResources?.length) {
      mainDoc
        .addContainer(Page)
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('resource.resources'))
        })
        .render()
        .add(addFileResourceSection)
        .add(addLinkResourceSection)
        .render()
    }

    if (linkedProjects?.length) {
      mainDoc
        .addContainer(Page)
        .addContainer(PageTitle)
        .add(function (this: PageTitle) {
          this.content.push(t('project.linked-projects'))
        })
        .render()
        .add(addLinkedProjectSection)
        .render()
    }

    // FINALIZE AND DOWNLOAD PDF
    const projectUrl = `${window.location.origin}/projects/${project.id}/`
    const pdfContent = mainDoc.getContent()
    await fetchPdf(
      pdfContent,
      `${project.slug || `project-${project.id}`}.pdf`,
      projectUrl,
      project.$t.title
    )
    // document.body.innerHTML = pdfContent
  }

  return {
    generateAndDownloadPdf,
  }
}
