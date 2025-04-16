export default (url, title, description, image, dimensions = null) => {
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useI18n()

  let imgMimeType = 'image/jpeg'
  try {
    const imgUrl = new URL(image)
    const imgPath = imgUrl.pathname
    const imgExt = imgPath.split('.').pop().toLowerCase()
    if (imgExt == 'png') imgMimeType = 'image/png'
    if (imgExt == 'webp') imgMimeType = 'image/webp'
  } catch (err) {
    console.error(err)
  }

  const imgWidth = dimensions?.width
  const imgHeight = dimensions?.height

  const optMetas = []
  if (imgHeight && imgWidth) {
    optMetas.push({
      property: 'og:image:width',
      content: imgWidth,
    })
    optMetas.push({
      property: 'og:image:height',
      content: imgHeight,
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
    useHeadSafe({
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

        {
          property: 'og:image',
          content: image,
        },

        {
          property: 'og:image:type',
          content: imgMimeType,
        },

        ...optMetas,

        // Twitter
        {
          name: 'twitter:title',
          content: title,
        },

        {
          name: 'twitter:description',
          content: description,
        },

        {
          name: 'twitter:image',
          content:
            image ||
            `${runtimeConfig.public.appPublicBinariesPrefix}/social/meta_background_twt.png`,
        },
      ],
    })
  setHead()

  watch(() => [locale.value], setHead)
}
