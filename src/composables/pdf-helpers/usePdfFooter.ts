import { Doc } from '@/composables/pdf-helpers/doc-builder'

import QRCode from 'qrcode'

export default async function usePdfFooter(url?: string, title?: string) {
  let qrCodeImg = ''
  if (url) {
    const qrCodeDataUrl = await QRCode.toDataURL(url, { color: { dark: '#1d727c' } })
    qrCodeImg = `<img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code"/>`
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

          .qr-code {
            position: absolute;
            height: 2cm;
            width: auto;
            left: .1cm;
            top: .1cm;
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
          <p class="date-url">Generated on ${new Date().toLocaleDateString()}</p>
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
