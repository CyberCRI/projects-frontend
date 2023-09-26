<template>
    <div class="on-boarding-page">
        <div v-html="onBoardingData.content"></div>
    </div>
</template>

<script>
export default {
    name: 'OnBoardingPage',

    components: {},

    data() {
        return {
            onBoardingData: {},
        }
    },

    mounted() {
        this.getCustomData()
    },

    computed: {
        faq() {
            return this.$store.getters['faqs/current']
        },
    },

    methods: {
        async getCustomData() {
            if (this.faq && this.faq.title && this.faq.content && this.faq.content !== '<p></p>') {
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
