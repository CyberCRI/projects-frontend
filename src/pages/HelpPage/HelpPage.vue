<template>
    <div :class="{ loading: isLoading }" class="page-section-extra-wide help-layout page-top">
        <div>
            <h1 class="page-title">{{ $filters.capitalize($t('faq.portal')) }}</h1>
        </div>

        <LpiLoader v-if="isLoading" type="simple" />
        <TabsLayout v-else :align-left="true" :border="false" :tabs="tabs" router-view></TabsLayout>
    </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import { getFaq } from '@/api/faqs.service'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import { computed } from 'vue'

export default {
    name: 'HelpPage',

    components: {
        LpiLoader,
        TabsLayout,
    },

    mixins: [onboardingStatusMixin],
    provide() {
        return {
            helpPageHasFaq: computed(() => this.hasFaq),
            helpPageFaq: computed(() => this.faq),
        }
    },

    data() {
        return {
            isLoading: true,
            customTab: null,
            faq: null,
        }
    },

    async mounted() {
        try {
            this.faq = await getFaq(this.$store.getters['organizations/current'].code)
        } catch (err) {
            console.error(err)
            // ignore 404 error
        }
        this.setOnboardData()

        this.onboardingTrap('take_tour', false)
    },

    computed: {
        hasFaq() {
            let faq = this.faq
            return faq && faq.title && faq.content && faq.content !== '<p></p>'
        },
        tabs() {
            const res = []

            if (this.customTab) res.push(this.customTab)

            res.push({
                key: 'help-help',
                label: this.$t('faq.portal'),
                view: { name: 'HelpHelpTab' },
            })
            res.push({
                key: 'help-video',
                label: this.$t('faq.video'),
                view: { name: 'HelpVideoTab' },
            })
            return res
        },
    },

    methods: {
        async setOnboardData() {
            try {
                if (this.hasFaq) {
                    this.customTab = {
                        label: this.faq.title,
                        key: 'help-template',
                        view: { name: 'HelpFaqTab' },
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
.intro-ctn {
    margin-bottom: $space-xl;
    background: $primary-lighter;
    padding: $space-l;
    border-radius: $border-radius-17;

    .action-list {
        list-style-type: disc;
        list-style-position: inside;
        font-size: $font-size-l;

        li {
            padding: $space-m 0;
        }
    }
}

.help-layout {
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
