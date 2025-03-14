import useLanguages from '@/stores/useLanguages'

export default (url, title, description, image) => {
  const setHead = () =>
    useHeadSafe({
      title: title,
      titleTemplate: (t) => (t && `Projects - ${t}`) || 'Projects',
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
          content: url,
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
          content: image,
        },
      ],
    })
  setHead()

  const languagesStore = useLanguages()

  watch(() => [languagesStore.current], setHead)
}
