<template>
    <TabsLayout :tabs="tabs" align-left />
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import TabHomeCarouselItem from '@/components/home/HomeCarousel/TabHomeCarouselItem.vue'
export default {
    name: 'HomeCarousel',

    mixins: [imageMixin],

    components: {
        TabsLayout,
    },

    computed: {
        tabs() {
            return [
                {
                    key: 'carousel-1',
                    label: this.$t('homeCarousel.tab1.title'),
                    component: TabHomeCarouselItem,
                    props: {
                        tab: {
                            title: this.$t('homeCarousel.tab1.title'),
                            image: {
                                default: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-1.png`,
                                sources: [
                                    {
                                        type: 'image/webp',
                                        srcset: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-1.webp 920w, ${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-1-small.webp 660w`,
                                        sizes: '(min-width: 660px) and (max-width: 1024px) 920px, 660px',
                                    },
                                ],
                            },
                            text: 'homeCarousel.tab1.text',
                        },
                    },
                },
                {
                    key: 'carousel-2',
                    label: this.$t('homeCarousel.tab2.title'),
                    component: TabHomeCarouselItem,
                    props: {
                        tab: {
                            title: this.$t('homeCarousel.tab2.title'),
                            image: {
                                default: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-2.png`,
                                sources: [
                                    {
                                        type: 'image/webp',
                                        srcset: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-2.webp 920w, ${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-2-small.webp 660w`,
                                        sizes: '(min-width: 660px) and (max-width: 1024px) 920px, 660px',
                                    },
                                ],
                            },
                            text: 'homeCarousel.tab2.text',
                        },
                    },
                },
                {
                    key: 'carousel-3',
                    label: this.$t('homeCarousel.tab3.title'),
                    component: TabHomeCarouselItem,
                    props: {
                        tab: {
                            title: this.$t('homeCarousel.tab3.title'),
                            image: {
                                default: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-3.gif`,
                                sources: [
                                    {
                                        type: 'image/gif',
                                        srcset: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-3.gif 920w, ${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-3-small.gif 660w`,
                                        sizes: '(min-width: 660px) and (max-width: 1024px) 920px, 660px',
                                    },
                                ],
                            },
                            text: 'homeCarousel.tab3.text',
                        },
                    },
                },
                {
                    key: 'carousel-4',
                    label: this.$t('homeCarousel.tab4.title'),
                    component: TabHomeCarouselItem,
                    props: {
                        tab: {
                            title: this.$t('homeCarousel.tab4.title'),
                            image: {
                                default: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-4.png`,
                                sources: [
                                    {
                                        type: 'image/webp',
                                        srcset: `${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-4.webp 920w, ${this.PUBLIC_BINARIES_PREFIX}/onboarding/tab-4-small.webp 660w`,
                                        sizes: '(min-width: 660px) and (max-width: 1024px) 920px, 660px',
                                    },
                                ],
                            },
                            text: 'homeCarousel.tab4.text',
                        },
                    },
                },
            ]
        },
    },
}
</script>
