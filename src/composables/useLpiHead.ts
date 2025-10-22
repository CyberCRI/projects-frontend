import useNuxtI18n from '@/composables/useNuxtI18n'

export default (url, _title, _description, image, dimensions = null) => {
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useNuxtI18n()

  // sanitize to use in html meta tagswœ
  const title = computed(() => (unref(_title) || '').replace(/<[^>]*>?/gm, ''))
  const description = computed(() => (_description || '').replace(/<[^>]*>?/gm, ''))
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

  let favicon = `${runtimeConfig.public.appPublicBinariesPrefix}/favicon.ico`
  const customFavicon = (runtimeConfig.public.appFavicon || '') as string
  if (customFavicon) {
    if (customFavicon.match(/^https?:\//)) {
      favicon = customFavicon
    } else {
      favicon = `${runtimeConfig.public.appPublicBinariesPrefix}/${customFavicon}`
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
          content:
            url || `${runtimeConfig.public.appPublicBinariesPrefix}/social/meta_background_og.png`,
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
