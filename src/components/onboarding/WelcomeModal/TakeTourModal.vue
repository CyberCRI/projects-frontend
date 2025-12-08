<template>
  <BaseModal data-test="take-tour-modal" @close="$emit('close')">
    <template #content>
      <h2 class="welcome-title">
        {{ $t('plateform-tour-modal.title') }}
      </h2>
      <p class="notice">
        {{ $t('plateform-tour-modal.intro') }}
      </p>
      <div class="video-wrapper">
        <LoaderSimple class="loader" />
        <iframe
          class="video"
          :src="videoSrc"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen="allowfullscreen"
        />
      </div>
      <i18n-t keypath="plateform-tour-modal.notice-tutorial" tag="p" class="notice" scope="global">
        <NuxtLink
          class="link"
          :to="{ name: 'HelpVideoTab' }"
          data-test="link-to-tutorials"
          @click="$emit('close')"
        >
          {{ $t('plateform-tour-modal.tutorial') }}
        </NuxtLink>
      </i18n-t>
    </template>
    <template #footer>
      <!-- empty -->
    </template>
  </BaseModal>
</template>
<script>
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
export default {
  name: 'TakeTourModal',

  components: { BaseModal, LoaderSimple },

  emits: ['close'],

  setup() {
    const { locale } = useNuxtI18n()

    const { onboardingTrap } = useOnboardingStatus()
    return {
      locale,
      onboardingTrap,
    }
  },

  computed: {
    videoSrc() {
      return this.locale === 'fr'
        ? 'https://www.youtube.com/embed/p5_DaK7CQUI?si=AH_F9MANlsPP_h1l'
        : 'https://www.youtube.com/embed/0DncVa2JWQY?si=RKu3bY4QQiOvnBHk'
    },
  },
  mounted() {
    this.onboardingTrap('take_tour', false)
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
  line-height: $line-height-tight;
  margin-bottom: pxToRem(56px);
}

.notice {
  font-size: $font-size-m;
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
  padding-bottom: 57.6307363927428%;
  position: relative;

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .video {
    position: absolute;
    z-index: 10;
    inset: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
