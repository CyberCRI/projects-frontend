import { Container } from '@/composables/pdf-helpers/doc-builder'

export default async function addBlogSectionFactory(blogEntries: any[]) {
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
            break-inside: avoid;
            break-after: auto;
            border-radius: 0.4cm;
            border: 0.1cm solid #00dba7;
            box-sizing: border-box;
            background: #fff;
            position: relative;
          }
          .blog-entry .blog-entry-header {
            display: flex;
            color: #1d727c;
          }
          .blog-entry .blog-entry-header .header-main {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.3cm 0.5cm;
            font-weight: 700;
            width: 100%;
          }
          .blog-entry .blog-entry-header .header-main .entry-title {
            font-size: 0.5cm;
            line-height: 1.1;
          }
          .blog-entry .blog-entry-header .header-main .date {
            font-size: 0.3cm;
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
                  <div class="entry-title">
                    ${blogEntry.$t.title}
                  </div>
                  <div class="date">
                    ${d(new Date(blogEntry.created_at))}
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
