import useOrganizationsStore from '~/stores/useOrganizations'

// TODO: blog are disabled for now (as per client request) keep code for later use

import addPageLinkedProjectsFactory from '~/composables/project-pdf-components/addPageLinkedProjects'
import addPageResourceFactory from '~/composables/project-pdf-components/PageResource'
import addPageMembersFactory from '~/composables/project-pdf-components/PageMembers'
import addPageGroupsFactory from '~/composables/project-pdf-components/PageGroups'
import addPageDescriptionFactory from '~/composables/pdf-helpers/PageDescription'
import addPageOneFactory from '~/composables/project-pdf-components/PageOne'
import { fetchPdf } from '~/composables/pdf-helpers/usePdfHelpers'
import { Doc } from '~/composables/pdf-helpers/doc-builder'

export const useProjectToPdf = async (project) => {
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
  mainDoc.add(await addPageMembersFactory(project))
  mainDoc.add(await addPageGroupsFactory(project))
  // TODO: blog are disabled for now (as per client request) keep code for later use
  // mainDoc.add(await addPageBlogFactory(project))
  mainDoc.add(await addPageResourceFactory(project))
  mainDoc.add(await addPageLinkedProjectsFactory(project))

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
  // document.body.innerHTML = pdfContent
}
