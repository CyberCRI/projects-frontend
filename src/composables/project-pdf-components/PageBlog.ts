import addBlogLimitWarningFactory from '~/composables/project-pdf-components/addBlogLimitWarningFactory'
import addBlogSectionFactory from '~/composables/project-pdf-components/addBlogSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageBlogFactory(blogEntries: any[]) {
  const { t } = useNuxtI18n()
  const MAX_BLOG_ENTRIES = 10
  const addBlogSection = await addBlogSectionFactory(blogEntries, MAX_BLOG_ENTRIES)
  const addBlogLimitWarning = await addBlogLimitWarningFactory(blogEntries, MAX_BLOG_ENTRIES)
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
