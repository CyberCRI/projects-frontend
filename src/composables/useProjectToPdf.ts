import useOrganizationsStore from '~/stores/useOrganizations'

// TODO: blog are disabled for now (as per client request) keep code for later use

import addPageLinkedProjectsFactory from '~/composables/project-pdf-components/addPageLinkedProjects'
import addPageResourceFactory from '~/composables/project-pdf-components/PageResource'
import addGoalsSection from '~/composables/project-pdf-components/addGoalsSection.ts'
import addPageMembersFactory from '~/composables/project-pdf-components/PageMembers'
import type { ProjectModulesKeys, TranslatedProject } from '~/models/project.model'
import addPageGroupsFactory from '~/composables/project-pdf-components/PageGroups'
import addPageDescriptionFactory from '~/composables/pdf-helpers/PageDescription'
import addPageBlogFactory from '~/composables/project-pdf-components/PageBlog'
import addPageOneFactory from '~/composables/project-pdf-components/PageOne'
import { fetchPdf } from '~/composables/pdf-helpers/usePdfHelpers'
import { Doc } from '~/composables/pdf-helpers/doc-builder'

export const DEFAULT_PDF_OPTIONS = Object.freeze({
  members: true,
  groups: true,
  blogs: true,
  goals: true,
  resources: true,
  linked_projects: true,
}) satisfies { [key in ProjectModulesKeys]?: boolean }

export type ProjectPDFOptions = typeof DEFAULT_PDF_OPTIONS

export const useProjectToPdf = async (
  project: TranslatedProject,
  options: Partial<ProjectPDFOptions> = {}
) => {
  options = {
    ...DEFAULT_PDF_OPTIONS,
    ...options,
  }
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

  mainDoc.add(await addPageOneFactory(project))
  mainDoc.add(await addPageDescriptionFactory(project))

  if (options.members) {
    mainDoc.add(await addPageMembersFactory(project))
  }
  if (options.groups) {
    mainDoc.add(await addPageGroupsFactory(project))
  }
  if (options.blogs) {
    mainDoc.add(await addPageBlogFactory(project))
  }
  if (options.resources) {
    mainDoc.add(await addPageResourceFactory(project))
  }
  if (options.linked_projects) {
    mainDoc.add(await addPageLinkedProjectsFactory(project))
  }
  if (options.goals) {
    mainDoc.add(await addGoalsSection(project))
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
