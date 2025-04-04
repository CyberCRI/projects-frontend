export default (url, title, description, image) => {
  const runtimeConfig = useRuntimeConfig()
  const { locale } = useI18n()
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
