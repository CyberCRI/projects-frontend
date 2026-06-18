import addResourceSectionFactory from '~/composables/project-pdf-components/addResourceSectionFactory'
import { getProjectAttachmentLinks } from '~/api/attachment-links.service'
import { getProjectAttachmentFiles } from '~/api/attachment-files.service'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageResourceFactory(project: TranslatedProject) {
  const { translateFiles, translateLinks } = useAutoTranslate()

  const fileResources = unref(
    translateFiles((await getProjectAttachmentFiles(project.id, { query: { limit: 10 } })).results)
  )
  const linkResources = unref(
    translateLinks((await getProjectAttachmentLinks(project.id, { query: { limit: 10 } })).results)
  )

  const { t } = useNuxtI18n()
  const addFileResourceSection = await addResourceSectionFactory(project, fileResources, 'file')
  const addLinkResourceSection = await addResourceSectionFactory(project, linkResources, 'link')

  return function addPageResource(this: Doc) {
    if (!fileResources?.length && !linkResources?.length) return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('resource.resources'))
      })
      .render()
      .add(addFileResourceSection)
      .add(addLinkResourceSection)
      .render()
  }
}
