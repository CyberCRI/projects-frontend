<template>
    <div class="on-boarding-page">
        <TipTapOutput :content="onBoardingData.content" class="onboarding-content" />
    </div>
</template>

<script>
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
export default {
    name: 'OnBoardingTab',

    components: { TipTapOutput },

    inject: {
        hasFaq: { from: 'helpPageHasFaq', default: false },
        faq: { from: 'helpPageFaq', default: {} },
    },

    data() {
        return {
            onBoardingData: {},
        }
    },

    mounted() {
        if (!this.hasFaq) {
            this.$router.replace({ name: 'HelpHelpTab' })
        }
        this.getCustomData()
    },

    methods: {
        async getCustomData() {
            if (
                this.hasFaq &&
                this.faq.title &&
                this.faq.content &&
                this.faq.content !== '<p></p>'
            ) {
                this.onBoardingData = this.faq
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.on-boarding-page {
    margin: $font-size-2xl;
}
</style>
