import { Doc } from '@/composables/pdf-helpers/doc-builder'

import QRCode from 'qrcode'
import { lpiLogo } from '@/composables/project-pdf-components/common-styles'

export default async function usePdfFooter(url?: string, title?: string) {
  const { t } = useNuxtI18n()
  let qrCodeImg = ''
  if (url) {
    const qrCodeDataUrl = await QRCode.toDataURL(url, { color: { dark: '#1d727c' } })
    qrCodeImg = `<a class="project-qr-code-link" href="${url}"><img src="${qrCodeDataUrl}" alt="QR Code" class="project-qr-code"/></a>`
  }

  let titleHtml = ''
  if (title) {
    titleHtml = `<p class="title">${title}</p>`
  }

  const footerContent = new Doc()
    .add(function (this: Doc) {
      this.styles.add(/* CSS */ `
          html, body {
            text-align: center;
          }
          footer {
            display: flex;
            padding: .2cm 3cm;
            align-items: center;
            justify-content: center;
            gap: .2cm;
            flex-direction: column;
            width: 100%;
            border-top: 1px solid #ddd;
            font-size: .8rem;
            position: relative;
            height: 4.cm;
          }

          .project-qr-code-link, .project-qr-code-link:hover, .project-qr-code-link:visited, .project-qr-code-link:active {
            text-decoration: none;
            display: inline-block;
          }

          .lpi-logo, .project-qr-code-link {
            position: absolute;
          }

          .lpi-logo, .project-qr-code {
            height: 2cm;
            width: auto;
          }
 
          .lpi-logo {
            right: .1cm;
            top: .1cm;
          }

          .project-qr-code-link {
            display: inline-block;
            padding: 0;
            margin: 0;
            height: 2cm;
            width: min-content;
            left: .1cm;
            top: 0;
          }
          p.title { font-weight: bold; color: #1d727c; }
          p { margin: 0; padding: 0; }

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
          ${qrCodeImg} ${titleHtml}
          <p class="date-url">
            ${t('pdf.generated-on', { date: new Date().toLocaleDateString() })}
          </p>
          <p class="page-number">
            <span class="pageNumber"></span>
            /
            <span class="totalPages"></span>
          </p>
          ${lpiLogo}
        </footer>
      `)
    })
    .getContent()
  return footerContent
}
