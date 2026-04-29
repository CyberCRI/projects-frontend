import useOrganizationsStore from '~/stores/useOrganizations'

import addPageLinkedProjectsFactory from '~/composables/project-pdf-components/addPageLinkedProjects'
// TODO: blog are disabled for now (as per client request) keep code for later use

import addPageResourceFactory from '~/composables/project-pdf-components/PageResource'
import addPageDescriptionFactory from '~/composables/pdf-helpers/PageDescription'
import addPageTeamFactory from '~/composables/project-pdf-components/PageTeam'
import addPageOneFactory from '~/composables/project-pdf-components/PageOne'
import { fetchPdf } from '~/composables/pdf-helpers/usePdfHelpers'
import { Doc } from '~/composables/pdf-helpers/doc-builder'

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

    mainDoc.add(await addPageOneFactory(project, goals || []))
    mainDoc.add(await addPageDescriptionFactory(project))
    mainDoc.add(await addPageTeamFactory(team || {}))
    // TODO: blog are disabled for now (as per client request) keep code for later use
    // mainDoc.add(await addPageBlogFactory(blogEntries || []))
    mainDoc.add(await addPageResourceFactory(project, fileResources || [], linkResources || []))
    mainDoc.add(await addPageLinkedProjectsFactory(project, linkedProjects || []))

    // FINALIZE AND DOWNLOAD PDF
    const isPublic = project.publication_status === 'public'
    const projectUrl = isPublic ? `${organisation.website_url}/projects/${project.id}/` : null
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
