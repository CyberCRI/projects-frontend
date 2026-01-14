<template>
  <div class="help-page">
    <LpiLoader v-if="isLoading" class="loader" type="simple" />
    <iframe id="helpIframe" :src="docUrl" :style="iframeStyle" @load="isLoading = false" />
  </div>
</template>

<script setup lang="ts">
import LpiLoader from '@/components/base/loader/LpiLoader.vue'

const { locale } = useNuxtI18n()
const runtimeConfig = useRuntimeConfig()
const { isMobile, isTablet } = useViewportWidth()
const isLoading = ref(true)

const docUrl = computed(() => {
  const url = new URL(runtimeConfig.public.appDoc)
  // uppercase lang code are mandatory for this service
  url.searchParams.append('lang', locale.value)

  return url.toString()
})

const iframeStyle = computed(() => {
  if (isMobile.value || isTablet.value) {
    return {
      height: `calc(100vh - ${100}px)`,
    }
  }
  return null
})

onActivated(() => {
  isLoading.value = true
})
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
