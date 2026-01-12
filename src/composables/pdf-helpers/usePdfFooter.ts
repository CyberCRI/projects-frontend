import { Doc } from '@/composables/pdf-helpers/doc-builder'
export default function usePdfFooter() {
  const footerContent = new Doc()
    .add(function (this: Doc) {
      this.styles.add(/* CSS */ `
          html, body {
            font-size: 12px;
            text-align: center;
          }
          footer {
            width: 100%;
            border-top: 1px solid #ddd;
          }
          a {
            color: #1d727c;
            text-decoration: none;
            font-weight:bold;
          }
          .page-number, .date-url {
            width: 100%;
            text-align: center;
          }`)
      this.content.push(/* HTML */ `
        <footer>
          <p class="date-url">
            Generated on ${new Date().toLocaleDateString()} -
            <a href="${window.location.href}">${window.location.href}</a>
          </p>
          <p class="page-number">
            <span class="pageNumber"></span>
            of
            <span class="totalPages"></span>
          </p>
        </footer>
      `)
    })
    .getContent()
  return footerContent
}
