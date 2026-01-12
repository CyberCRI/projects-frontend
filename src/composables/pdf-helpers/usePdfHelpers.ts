import usePdfFooter from '@/composables/pdf-helpers/usePdfFooter'
import usePdfHeader from '@/composables/pdf-helpers/usePdfHeader'

// exeport function imageElementToDataUrl(imgElement) {
//   const myCanvasElement = document.createElement('canvas')
//   myCanvasElement.width = imgElement.naturalWidth
//   myCanvasElement.height = imgElement.naturalHeight
//   const context = myCanvasElement.getContext('2d')
//   context.drawImage(imgElement, 0, 0)
//   return myCanvasElement.toDataURL('image/png')
// }

export function proxyImageUrl(url: string): string {
  return `/proxy-image?url=${encodeURIComponent(url)}`
}

export async function fetchImageAsDataUrl(url): Promise<string | ArrayBuffer> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      console.error('Error reading blob as data URL for url:', url)
      resolve('')
    }
    reader.readAsDataURL(blob)
  })
}

export async function convertImages(html) {
  const imageTags = html.match(/<img [^>]*src="[^"]*"[^>]*>/gm) || []
  const dataUrls = await Promise.all(
    imageTags.map((tag) => {
      return new Promise(async (resolve) => {
        const srcMatch = tag.match(/src="([^"]*)"/)
        if (srcMatch && srcMatch[1]) {
          const src = srcMatch[1]
          if (!src.startsWith('data:')) {
            const base64data = await fetchImageAsDataUrl(src)
            resolve([tag, base64data])
          } else {
            resolve([tag, src.substring('data:'.length)]) // already a data URL
          }
        } else {
          resolve([tag, null]) // no src found
        }
      })
    })
  )
  // replace src after all conversions are done to avoid concurrence issues
  dataUrls.forEach(([tag, dataUrl]) => {
    if (dataUrl) {
      html = html.replace(tag, tag.replace(/src="[^"]*"/, `src="${dataUrl}"`))
    }
  })
  return html
}

export async function fetchPdf(pdfContent: string, fileName: string) {
  const payload = new FormData()
  payload.append('files', new Blob([pdfContent], { type: 'text/html' }), 'index.html')
  payload.append('files', new Blob([usePdfFooter()], { type: 'text/html' }), 'footer.html')
  payload.append('files', new Blob([await usePdfHeader()], { type: 'text/html' }), 'header.html')
  // payload.append('emulatedMediaType', 'screen')
  const resp = await fetch('/pdf-generator', {
    method: 'POST',
    body: payload,
  })
  const respBlob = await resp.blob()
  const url = window.URL.createObjectURL(respBlob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = fileName
  document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
  a.click()
  a.remove() //afterwards we remove the element again
}
