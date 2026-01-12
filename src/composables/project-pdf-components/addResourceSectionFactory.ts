import { Container } from '@/composables/pdf-helpers/doc-builder'

export default async function addResourceSectionFactory(resources: any[], type: 'file' | 'link') {
  const { t } = useNuxtI18n()
  // const { getTranslatableField } = useAutoTranslate()

  return function addResourceSection(this: Container) {
    let out = ''

    if (resources.length > 0) {
      this.styles.add(/* CSS */ `

          .resource-title {
            font-size: .4cm;
            font-weight: bold;
            margin-bottom: .4cm;
            color: #1d727c;
            font-weight: bold;
          }

          .resource-list {
            display: flex;
            flex-wrap: wrap;
            gap: .2cm;
            padding: .4cm 0;
          }
          .resource-list  div {
            width: calc(33% - .2cm);
          }

         .resource-wrapper {
            width: 100%;
            position: relative;
          }
          .resource-wrapper .resource-card {
            border: 0.1cm solid #00dba7;
            border-radius: 0.3cm;
            display: flex;
            cursor: pointer;
            height: 4cm;
            overflow: hidden;
            position: relative;
          }
          .resource-wrapper .resource-card.h-reverse {
            flex-direction: row-reverse;
          }
          .resource-wrapper .resource-card.h-reverse .icon-ctn {
            border-left: 1px solid #00dba7;
            border-right: unset;
          }
          .resource-wrapper .resource-card:hover .content {
            background-color: #f0fffb;
          }
          .resource-wrapper .resource-card .icon-ctn {
            background: #00dba7;
            border-right: 1px solid #00dba7;
            padding: 0.4cm;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .resource-wrapper .resource-card .icon-ctn svg {
            display: inline-block;
            width: 1cm;
            height: 1cm;
            fill: #fff;
          }
          .resource-wrapper .resource-card .content {
            background-color: #fff;
            font-size: 0.4cm;
            padding: 0.2cm 0.4cm;
            margin-right: auto;
            overflow: hidden;
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
            font-size: 0.3cm;
            line-height: 1.1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-top: 0.2cm;
            word-wrap: break-word;
          }
          .resource-wrapper .resource-card .content span {
            display: block;
          }
          `)
      const resourceList = resources
        .map(
          (resource) => /*HTML*/ `
          <div class="resource-wrapper">
            <div
              class="resource-card shadow-box"
            >
              <div class="icon-ctn">
                
                ${
                  type === 'file'
                    ? /* HTML */ `
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon" />
                    <path
                      d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"
                    />
                  </svg>
                  `
                    : /* HTML */ `
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon" />
                    <path
                      d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"
                    />
                  </svg>
                  `
                }
              </div>

              <div class="content">
                <span class="resource-title">${resource?.$t?.title}</span>
                <span class="resource-subtitle">${resource?.$t?.description}</span>
              </div>
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
