<template>
    <div :class="{ loading: isLoading }" class="help-layout narrow-body">
        <LpiLoader v-if="isLoading" type="simple" />
        <TabsLayout v-else :align-left="true" :border="false" :tabs="tabs"></TabsLayout>
    </div>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { defineAsyncComponent } from 'vue'

export default {
    name: 'HelpPage',

    components: {
        LpiLoader,
        TabsLayout,
    },

    data() {
        return {
            isLoading: true,
            customTab: null,
        }
    },

    mounted() {
        this.setOnboardData()
    },

    computed: {
        faq() {
            return this.$store.getters['faqs/current']
        },

        tabs() {
            const res = []

            if (this.customTab) res.push(this.customTab)

            res.push({
                key: 'help-help',
                label: this.$t('faq.portal'),
                component: defineAsyncComponent(() => import('./Tabs/HelpTab.vue')),
            })
            res.push({
                key: 'help-video',
                label: this.$t('faq.video'),
                component: defineAsyncComponent(() => import('./Tabs/VideoTab.vue')),
            })
            return res
        },
    },

    methods: {
        async setOnboardData() {
            let faq = this.faq
            try {
                if (!faq) {
                    faq = await this.$store.dispatch(
                        'faqs/getFaq',
                        this.$store.getters['organizations/current'].code
                    )
                }

                if (faq && faq.title && faq.content && faq.content !== '<p></p>') {
                    this.customTab = {
                        label: this.faq.title,
                        key: 'help-template',
                        component: defineAsyncComponent(() => import('./Tabs/OnBoardingTab.vue')),
                    }
                }
            } catch (error) {
                console.error(error)
            }

            this.isLoading = false
        },
    },
}
</script>

<style lang="scss" scoped>
.help-layout {
    margin-top: calc($navbar-height + $space-m);
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    &.loading {
        justify-content: center;
        align-items: center;
    }
}

:deep(.tabs) {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    .content {
        display: flex;
        flex-flow: column nowrap;
        flex-grow: 1;

        img {
            max-width: 100%;
        }
    }
}
</style>
