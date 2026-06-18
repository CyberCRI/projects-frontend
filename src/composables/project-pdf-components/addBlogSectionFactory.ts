import type { Container } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import { formatDate } from '~/functs/date'

export default async function addBlogSectionFactory(blogEntries: TranslatedBlogEntry[]) {
  const { locale } = useNuxtI18n()
  // const { getTranslatableField } = useAutoTranslate()
  return function addBlogSection(this: Container) {
    if (blogEntries.length === 0) {
      return
    }

    this.styles.add(/* CSS */ `

          .blog-entries-ctn {
            display: flex;
            flex-direction: column;
            gap: 1cm;
          }

          .blog-entry {
            box-sizing: border-box;
            background: #fff;
            position: relative;
            border-bottom: 0.1cm solid #00dba7;
            padding-bottom: 0.2cm;
            margin-top: 0.2cm;
          }
          .blog-entry .blog-entry-header {
            display: flex;
            color: #1d727c;
          }
          .blog-entry .blog-entry-header .header-main {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            justify-content: space-between;
            padding: 0.3cm 0.5cm;
            font-weight: 700;
            width: 100%;
          }
          .blog-entry .blog-entry-header .header-main .entry-title {
            font-size: 1.2rem;
            line-height: 1.1;
          }
          .blog-entry .blog-entry-header .header-main .date {
            font-size: .8rem;
          }
          .blog-entry .entry-body {
            border-top: 0.1cms solid #00dba7;
            padding: 0.2cm 0.4cm;
            overflow-x: hidden;
          }
          .blog-entry .entry-body::after {
            content: "";
            display: block;
            clear: both;
          }

          `)

    const blogList = blogEntries
      .map(
        (blogEntry) => /*HTML*/ `
            <div class="blog-entry">
              <div class="blog-entry-header">
                <div class="header-main">
                  <div class="date">
                    ${formatDate(new Date(blogEntry.created_at), locale.value)}
                  </div>
                  <div class="entry-title">
                    ${blogEntry.$t.title}
                  </div>
                </div>
              </div>
              <div class="entry-body">
                ${blogEntry.$t.content}
              </div>
            </div>`
      )
      .join('')

    this.content.push(/* HTML */ `
      <div class="blog-entries-ctn">${blogList}</div>
    `)
  }
}
