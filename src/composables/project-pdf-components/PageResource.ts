import addResourceSectionFactory from '~/composables/project-pdf-components/addResourceSectionFactory'
import { getProjectAttachmentLinks, getProjectAttachmentFiles } from 'shared-projects-frontend/apis'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageResourceFactory(
  project: TranslatedProject,
  tab: TranslatedProjectTab
) {
  const { translateFiles, translateLinks } = useAutoTranslate()

  const fileResources = unref(
    translateFiles((await getProjectAttachmentFiles(project.id, { query: { limit: 10 } })).results)
  )
  const linkResources = unref(
    translateLinks((await getProjectAttachmentLinks(project.id, { query: { limit: 10 } })).results)
  )

  const addFileResourceSection = await addResourceSectionFactory(project, fileResources, 'file')
  const addLinkResourceSection = await addResourceSectionFactory(project, linkResources, 'link')

  return function addPageResource(this: Doc) {
    if (!fileResources?.length && !linkResources?.length) return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(tab.$t.title)
      })
      .render()
      .add(addFileResourceSection)
      .add(addLinkResourceSection)
      .render()
  }
}
