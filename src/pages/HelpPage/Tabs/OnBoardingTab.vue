<template>
    <div class="on-boarding-page">
        <div v-html="onBoardingData.content" class="onboarding-content"></div>
    </div>
</template>

<script>
import fixEditorContent from '@/functs/editorUtils.ts'
export default {
    name: 'OnBoardingTab',

    components: {},

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

    watch: {
        'onBoardingData.content': {
            handler: function (neo, old) {
                if (neo != old) {
                    // give time to render content
                    this.$nextTick(() => {
                        const contentNode = this.$el.querySelector('.onboarding-content')
                        fixEditorContent(contentNode)
                    })
                }
            },
            immediate: true,
        },
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
