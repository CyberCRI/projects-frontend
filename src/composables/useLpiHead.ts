export default (url, title, description, image) => {
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

  const setHead = () =>
    useHeadSafe({
      title: title,
      titleTemplate: (t) => (t && `Projects - ${t}`) || 'Projects',
      link: [
        {
          rel: 'icon',
          href: `${runtimeConfig.public.appPublicBinariesPrefix}/favicon.ico`,
        },
      ],
      htmlAttrs: { lang: 'locale' },
      meta: [
        {
          name: 'description',
          content: description,
        },

        {
          name: 'og:title',
          content: title,
        },

        {
          name: 'og:description',
          content: description,
        },

        {
          name: 'og:url',
          content:
            url || `${runtimeConfig.public.appPublicBinariesPrefix}/social/meta_background_og.png`,
        },

        {
          name: 'og:image',
          content: image,
        },

        {
          name: 'og:image:type',
          content: imgMimeType,
        },

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
