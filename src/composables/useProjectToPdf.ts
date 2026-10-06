import useOrganizationsStore from '~/stores/useOrganizations'

// TODO: blog are disabled for now (as per client request) keep code for later use

import addPageLinkedProjectsFactory from '~/composables/project-pdf-components/addPageLinkedProjects'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import addAdditionalPage from '~/composables/project-pdf-components/addPageAdditional'
import addPageResourceFactory from '~/composables/project-pdf-components/PageResource'
import addGoalsSection from '~/composables/project-pdf-components/addGoalsSection.ts'
import addPageMembersFactory from '~/composables/project-pdf-components/PageMembers'
import addPageGroupsFactory from '~/composables/project-pdf-components/PageGroups'
import addPageDescriptionFactory from '~/composables/pdf-helpers/PageDescription'
import addPageBlogFactory from '~/composables/project-pdf-components/PageBlog'
import addPageOneFactory from '~/composables/project-pdf-components/PageOne'
import { fetchPdf } from '~/composables/pdf-helpers/usePdfHelpers'
import { Doc } from '~/composables/pdf-helpers/doc-builder'

export type PDFChoies = {
  visibility: boolean
  tab: TranslatedProjectTab
}[]

export const useProjectToPdf = async (project: TranslatedProject, options: PDFChoies) => {
  const organizationsStore = useOrganizationsStore()
  const organisation = organizationsStore.current

  const mainDoc = new Doc()
  mainDoc.styles.add(/* CSS */ `
    html, body {
      margin: 20px;
    }
    @page {
      margin-top: 2.5cm;
      margin-bottom: 2cm;
    }`)

  // project info
  mainDoc.add(await addPageOneFactory(project))

  // tab info
  for (const option of options) {
    if (!option.visibility) {
      continue
    }
    switch (option.tab.type) {
      case 'description': {
        mainDoc.add(await addPageDescriptionFactory(project, option.tab))
        break
      }
      case 'members': {
        mainDoc.add(await addPageMembersFactory(project, option.tab))
        break
      }
      case 'groups': {
        mainDoc.add(await addPageGroupsFactory(project, option.tab))
        break
      }
      case 'blogs': {
        mainDoc.add(await addPageBlogFactory(project, option.tab))
        break
      }
      case 'resources': {
        mainDoc.add(await addPageResourceFactory(project, option.tab))
        break
      }
      case 'linked_projects': {
        mainDoc.add(await addPageLinkedProjectsFactory(project, option.tab))
        break
      }
      case 'goals': {
        mainDoc.add(await addGoalsSection(project, option.tab))
        break
      }
      case 'blog':
      case 'text': {
        mainDoc.add(await addAdditionalPage(project, option.tab))
        break
      }
    }
  }

  // FINALIZE AND DOWNLOAD PDF
  const isPublic = project.publication_status === 'public'
  const projectUrl = isPublic ? `${organisation.website_url}/projects/${project.id}/` : null
  const pdfContent = mainDoc.getContent()
  return fetchPdf(
    pdfContent,
    `${project.slug || `project-${project.id}`}.pdf`,
    projectUrl,
    project.$t.title
  )
}
