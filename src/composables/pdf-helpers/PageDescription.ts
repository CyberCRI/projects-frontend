import { Doc, Page } from '@/composables/pdf-helpers/doc-builder'
import PageTitle from '@/composables/project-pdf-components/PageTitle'
import { convertImages } from '@/composables/pdf-helpers/usePdfHelpers'
import { tiptapContentStyles } from '@/composables/project-pdf-components/common-styles'

export default async function addPageDescriptionFactory(project: any) {
  const { t } = useNuxtI18n()
  let fixedDescription = await convertImages(project.description)
  // TODO: replace with a link to video ?
  fixedDescription = fixedDescription.replaceAll(/<video.*?>.*?<\/video>/g, '')

  return function addPageDescription(this: Doc) {
    if (!fixedDescription?.length || fixedDescription == '<p></p>') return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('form.description'))
        this.styles.add(tiptapContentStyles)
      })
      .render()
      .add(function (this: Page) {
        this.content.push(/* HTML */ `
          <div class="tiptap-content">${fixedDescription}</div>
        `)
      })
      .render()
  }
}
