import addBlogLimitWarningFactory from '~/composables/project-pdf-components/addBlogLimitWarningFactory'
import addBlogSectionFactory from '~/composables/project-pdf-components/addBlogSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'
import { Page } from '~/composables/pdf-helpers/doc-builder'
import { getBlogEntries } from '~/api/blogentries.service'

export default async function addPageBlogFactory(project: TranslatedProject) {
  const { t } = useNuxtI18n()

  const { translateBlogEntries } = useAutoTranslate()

  const rsp = await getBlogEntries(project.id, { query: { limit: 10 } })
  const blogEntries = unref(translateBlogEntries(rsp.results))

  const addBlogSection = await addBlogSectionFactory(blogEntries)
  const addBlogLimitWarning = await addBlogLimitWarningFactory(blogEntries, length)

  return function addPageBlog(this: Doc) {
    if (!blogEntries?.length) return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('blog.title'))
      })
      .render()
      .add(addBlogLimitWarning)
      .add(addBlogSection)
      .render()
  }
}
