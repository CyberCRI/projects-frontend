import type { Image } from '~/models/image.model'

import type { RefOrRaw } from '~/interfaces/utils'

import useOrganizationsStore from '~/stores/useOrganizations'

import { usePublicURL } from '~/composables/usePublic'
import useNuxtI18n from '~/composables/useNuxtI18n'

const useLpiHead = (url, _title, _description, image, dimensions = null) => {
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useNuxtI18n()

  // sanitize to use in html meta tagswœ
  const title = computed(() => (unref(_title) || '').replace(/<[^>]*>?/gm, ''))
  const description = computed(() => (unref(_description) || '').replace(/<[^>]*>?/gm, ''))
  let imgMimeType = 'image/jpeg'
  if (image) {
    try {
      const imgUrl = new URL(image)
      const imgPath = imgUrl.pathname
      const imgExt = imgPath.split('.').pop().toLowerCase()
      if (imgExt == 'png') imgMimeType = 'image/png'
      if (imgExt == 'webp') imgMimeType = 'image/webp'
    } catch (err) {
      console.error(err)
    }
  }

  const imgWidth = dimensions?.width
  const imgHeight = dimensions?.height

  const ogImage = []
  if (image) {
    ogImage.push({
      property: 'og:image',
      content: image,
    })
    ogImage.push({
      property: 'og:image:type',
      content: imgMimeType,
    })
    if (imgHeight && imgWidth) {
      ogImage.push({
        property: 'og:image:width',
        content: imgWidth,
      })
      ogImage.push({
        property: 'og:image:height',
        content: imgHeight,
      })
    }
  }

  const twitterImage = []
  if (image) {
    twitterImage.push({
      name: 'twitter:image',
      content: image,
    })
  }

  let favicon = usePublicURL('/favicon.ico')
  const customFavicon = (runtimeConfig.public.appFavicon || '') as string
  if (customFavicon) {
    if (customFavicon.match(/^https?:\//)) {
      favicon = customFavicon
    } else {
      favicon = usePublicURL(customFavicon)
    }
  }
  const setHead = () =>
    useHead({
      title: title,
      titleTemplate: (t) => (t && `Projects - ${t}`) || 'Projects',
      link: [
        {
          rel: 'icon',
          href: favicon,
        },
      ],
      htmlAttrs: { lang: 'locale' },
      meta: [
        {
          name: 'description',
          content: description,
        },

        {
          property: 'og:title',
          content: title,
        },

        {
          property: 'og:description',
          content: description,
        },

        {
          property: 'og:url',
          content: url || usePublicURL('/social/meta_background_og.png'),
        },

        ...ogImage,

        // Twitter
        {
          name: 'twitter:title',
          content: title,
        },

        {
          name: 'twitter:description',
          content: description,
        },

        ...twitterImage,
      ],
    })
  setHead()

  watch(() => [locale.value], setHead)
}

export default useLpiHead

type OptionsHead = {
  url?: RefOrRaw<string>
  title?: RefOrRaw<string>
  image?: Image | string
  description?: RefOrRaw<string>
}

/**
 * default value for useLpiHead
 *
 * @function
 * @name useLpiHead2
 * @kind variable
 * @param {OptionsHead} options
 * @returns {void}
 * @exports
 */
export const useLpiHead2 = async (options: OptionsHead) => {
  // TODO(remi): remove try/catch

  const store = useOrganizationsStore()
  try {
    const organization = await store.getOrFetchOrganization()
    const url = options.url || useRequestURL()?.toString() || ''
    const title = options.title || organization?.$t.name || ''
    const description = options.description || organization?.$t.description || ''

    let [image, dimensions] = [null, null]
    if (typeof options.image === 'object') {
      const tmp = useImageAndDimension(options.image, 'medium')
      image = tmp.image
      dimensions = tmp.dimensions
    } else if (typeof options.image === 'string') {
      image = options.image
    } else {
      const tmp = useImageAndDimension(organization?.banner_image, 'medium')
      image = tmp.image
      dimensions = tmp.dimensions
    }

    useLpiHead(url, title, description, image, dimensions)
  } catch (e) {
    console.error(e)
  }
}
