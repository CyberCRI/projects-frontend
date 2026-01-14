import { Container } from '@/composables/pdf-helpers/doc-builder'
export default async function addBlogLimitWarningFactory(blogEntries: any[], MAX_BLOG_ENTRIES) {
  const { t } = useNuxtI18n()
  const entryCount = blogEntries.length
  let limitedWarning = ''
  if (entryCount > MAX_BLOG_ENTRIES) {
    limitedWarning = /* HTML */ `
      <span class="blog-limited-warning">
        ${t('pdf.blog-entries-limited-warning', { count: MAX_BLOG_ENTRIES, total: entryCount })}
      </span>
    `
  }
  return function addBlogLimitWarning(this: Container) {
    this.styles.add(/* CSS */ `
        .blog-limited-warning {
            font-size: 0.8rem;
            font-style: italic;
            color: #999;
        }
    `)
    this.content.push(limitedWarning)
  }
}
