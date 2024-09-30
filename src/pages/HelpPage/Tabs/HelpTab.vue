<template>
    <div class="help-page">
        <LpiLoader v-if="isLoading" class="loader" type="simple" />
        <iframe id="helpIframe" :src="docUrl" :style="iframeStyle" @load="isLoading = false" />
    </div>
</template>

<script>
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import viewportWidth from '@/mixins/viewportWidth.ts'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'HelpTab',

    components: { LpiLoader },

    mixins: [viewportWidth],

    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },
    data() {
        return {
            isLoading: true,
        }
    },

    activated() {
        this.isLoading = true // component is "keep-alive" in tab, so redisplay loader while re-fetching iframe
    },

    computed: {
        docUrl() {
            const url = new URL(import.meta.env.VITE_APP_DOC)
            // uppercase lang code are mandatory for this service
            url.searchParams.append('lang', this.languagesStore.current)

            return url
        },

        iframeStyle() {
            if (this.isMobile || this.isTablet)
                return {
                    height: `calc(100vh - ${100}px)`,
                }
            return null
        },
    },
}
</script>

<style lang="scss" scoped>
.help-page {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    position: relative;
}

.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

iframe {
    width: 100%;
    height: calc(100vh - 100px);
}

@media screen and (min-width: $max-tablet) {
    iframe {
        width: 100%;

        /* 170px are an addition of the header, tabs and margins and the start of the footer (gray zone) */

        /* Can be changed as will */
        height: calc(100vh - 170px);
    }
}
</style>
