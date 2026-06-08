<script setup lang="ts">
import { onClient } from '~/composables/onClient'

const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
  recapchaKey: string
}>()

const model = defineModel<string>()

const setToken = (respToken) => (model.value = respToken)

const initCaptcha = onClient(() => {
  window.grecaptcha.render(props.recapchaKey, {
    sitekey: runtimeConfig.public.appCaptchaKey,
    callback: setToken,
  })
})

const initialize = onClient(() => {
  if (model.value) {
    window.grecaptcha.reset(model.value)
  }
  initCaptcha()
})

watch(() => props.recapchaKey, initialize, { immediate: true })
</script>

<template>
  <div class="form-section captcha_cont has-text-centered">
    <div :id="recapchaKey" />
  </div>
</template>
