import { Container } from '@/composables/pdf-helpers/doc-builder'

export default async function addBlogSectionFactory(blogEntries: any[], MAX_BLOG_ENTRIES) {
  const { d } = useNuxtI18n()
  // const { getTranslatableField } = useAutoTranslate()
  return function addBlogSection(this: Container) {
    let out = ''

    if (blogEntries.length > 0) {
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
        .slice(0, MAX_BLOG_ENTRIES)
        .map(
          (blogEntry) => /*HTML*/ `
            <div class="blog-entry">
              <div class="blog-entry-header">
                <div class="header-main">
                  <div class="date">
                    ${d(new Date(blogEntry.created_at))}
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

      out = /* HTML */ `
        <div class="blog-entries-ctn">${blogList}</div>
      `
    }
    this.content.push(out)
  }
}
