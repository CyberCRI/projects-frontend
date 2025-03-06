import useLanguages from '@/stores/useLanguages'

export default (url, title, description, image) => {
    const runtimeConfig = useRuntimeConfig()
    const setHead = () =>
        useHeadSafe({
            title: title,
            link: [
                {
                    rel: 'icon',
                    href: `${runtimeConfig.public.appPublicBinariesPrefix}/favicon.ico`,
                },
            ],
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
