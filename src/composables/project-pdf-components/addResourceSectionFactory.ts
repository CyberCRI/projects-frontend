import { Container } from '@/composables/pdf-helpers/doc-builder'
import QRCode from 'qrcode'

export default async function addResourceSectionFactory(
  project: any,
  _resources: any[],
  type: 'file' | 'link'
) {
  const { t } = useNuxtI18n()
  // const { getTranslatableField } = useAutoTranslate()

  const runtimeConfig = useRuntimeConfig()
  const apiUrl = runtimeConfig.public.appApiUrl

  const resources = await Promise.all(
    (_resources || []).map(async (resource) => {
      let qrCodeImg = ''
      // proxyed because we need fresh access token and short url for qrcode
      const url = `${apiUrl}/v1/project/${project.id}/${type}/${resource.id}/`
      if (url) {
        const qrCodeDataUrl = await QRCode.toDataURL(url, { color: { dark: '#1d727c' } })
        qrCodeImg = `<a class="resource-qr-code-link" href="${url}"><img src="${qrCodeDataUrl}" alt="QR Code" class="resource-qr-code"/></a>`
      }

      {
        return {
          ...resource,
          qrCodeImg,
        }
      }
    })
  )

  return function addResourceSection(this: Container) {
    let out = ''

    if (resources.length > 0) {
      this.styles.add(/* CSS */ `

          .resource-title {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #1d727c;
            font-weight: bold;
          }

          .resource-list {
            display: flex;
            flex-wrap: wrap;
            gap: .2cm;
            padding: 1rem 0;
          }

         .resource-wrapper {
            width: 100%;
            position: relative;
            display: flex;
            gap: .4cm;
            justify-content: stretch;
            break-inside: avoid;
          }
          
          .resource-qr-code-ctn {
            width: 2cm;
            height: 2cm;
            flex-shrink: 0;
          }

          .resource-qr-code-link, .resource-qr-code-link:hover, .resource-qr-code-link:visited, .resource-qr-code-link:active {
            text-decoration: none;
            display: inline-block;
          }


          .resource-qr-code {
            width: 2cm;
            height: auto;
          }
        
          .resource-wrapper .content {
            font-size:  1rem;
            flex-grow: 1;
          }
          .resource-wrapper .resource-card .content .resource-title {
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-wrap: break-word;
          }
          .resource-wrapper .resource-card .content .resource-subtitle {
            font-size: .8rem;
            line-height: 1.1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-top: 0.2cm;
            word-wrap: break-word;
          }
          `)
      const resourceList = resources
        .map(
          (resource) => /*HTML*/ `
          <div class="resource-wrapper">
              <div class="resource-qr-code-ctn">
                ${resource.qrCodeImg}
              </div>
              <div class="content">
                <div class="resource-title">${resource?.$t?.title}</div>
                <div class="resource-subtitle">${resource?.$t?.description}</div>
              </div>
          </div>
            `
        )
        .join('')

      out = /* HTML */ `
        <div class="resource-entries-ctn">
          <h3 class="resource-title">
            ${type === 'file'
              ? t('project.files', resources.length)
              : t('resource.web', resources.length)}
          </h3>
          <div>${resourceList}</div>
        </div>
      `
    }
    this.content.push(out)
  }
}
