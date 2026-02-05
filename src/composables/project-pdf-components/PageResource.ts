import { Doc, Page } from '@/composables/pdf-helpers/doc-builder'
import PageTitle from '@/composables/project-pdf-components/PageTitle'

import addResourceSectionFactory from '@/composables/project-pdf-components/addResourceSectionFactory'

export default async function addPageResourceFactory(
  project: any,
  fileResources: any[],
  linkResources: any[]
) {
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
