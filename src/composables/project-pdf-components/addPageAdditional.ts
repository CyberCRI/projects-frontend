import type {
  TranslatedBlogEntry,
  TranslatedProject,
  TranslatedProjectTab,
} from 'shared-projects-frontend/models'
import addBlogLimitWarningFactory from '~/composables/project-pdf-components/addBlogLimitWarningFactory'
import addBlogSectionFactory from '~/composables/project-pdf-components/addBlogSectionFactory'
import { addPageTextFactory } from '~/composables/pdf-helpers/PageDescription'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import { getAllProjectTabItem } from 'shared-projects-frontend/apis'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'

async function addAdditionalPageBlogFactory(
  tab: TranslatedProjectTab,
  items: TranslatedBlogEntry[]
) {
  const addBlogSection = await addBlogSectionFactory(items)
  const addBlogLimitWarning = await addBlogLimitWarningFactory(items, length)

  return function addPageBlog(this: Doc) {
    if (!items?.length) return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(tab.$t.title)
      })
      .render()
      .add(addBlogLimitWarning)
      .add(addBlogSection)
      .render()
  }
}

export default async function addAdditionalPage(
  project: TranslatedProject,
  tab: TranslatedProjectTab
) {
  const { translateProjectTabItems } = useAutoTranslate()

  const rsp = await getAllProjectTabItem(project.id, tab.id, { query: { limit: 10 } })
  const translateditems = unref(translateProjectTabItems(rsp.results))

  if (tab.type === 'text') {
    return addPageTextFactory(tab, translateditems?.[0]?.$t?.content || '')
  } else {
    return addAdditionalPageBlogFactory(tab, translateditems)
  }
}
