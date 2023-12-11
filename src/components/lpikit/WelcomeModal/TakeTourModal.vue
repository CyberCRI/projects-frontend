<template>
    <BaseModal @close="$emit('close')" data-test="take-tour-modal">
        <template #content>
            <h2 class="welcome-title">{{ $t('plateform-tour-modal.title') }}</h2>
            <p class="notice">{{ $t('plateform-tour-modal.intro') }}</p>
            <div class="video-wrapper">
                <iframe
                    class="video"
                    :src="videoSrc"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen="allowfullscreen"
                ></iframe>
            </div>
            <i18n-t keypath="plateform-tour-modal.notice-tutorial" tag="p" class="notice">
                <RouterLink
                    class="link"
                    :to="{ name: 'HelpVideoTab' }"
                    data-test="link-to-tutorials"
                    @click="$emit('close')"
                >
                    {{ $t('plateform-tour-modal.tutorial') }}
                </RouterLink>
            </i18n-t>
        </template>
        <template #footer><!-- empty --></template>
    </BaseModal>
</template>
<script>
import BaseModal from '@/components/lpikit/BaseModal/BaseModal.vue'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
export default {
    name: 'TakeTourModal',

    emits: ['close'],

    components: { BaseModal },

    mixins: [onboardingStatusMixin],

    mounted() {
        this.onboardingTrap('take_tour', false)
    },

    computed: {
        videoSrc() {
            return this.$store.state.languages.current === 'fr'
                ? 'https://player.vimeo.com/video/525574857'
                : 'https://player.vimeo.com/video/525597321'
        },
    },
}
</script>
<style scoped lang="scss">
.portal-logo-ctn {
    text-align: center;
}

.portal-logo {
    max-width: 20rem;
}

.welcome-title {
    text-align: center;
    font-weight: 700;
    font-size: $font-size-3xl;
    line-height: 1.25;
    margin-bottom: pxToRem(56px);
}

.notice {
    font-size: $font-size-m;
    line-height: 1.6;
}

.footer {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: $space-l;
}

.link {
    color: $primary-dark;
    text-decoration: underline;
    font-weight: 700;

    &:hover {
        text-decoration: none;
    }
}

.video-wrapper {
    margin: 2rem auto;
    width: 100%;
    height: 0;
    padding-bottom: 100% * calc(9 / 16);
    position: relative;
}

.video {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
}
</style>
